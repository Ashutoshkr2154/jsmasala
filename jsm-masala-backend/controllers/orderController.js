const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail'); // <-- 1. IMPORT EMAIL UTIL
const mongoose = require('mongoose');
const ejs = require('ejs'); // Optional: for HTML email templates
const path = require('path'); // Optional: for HTML email templates

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, paymentResult } = req.body;

    // Validation middleware already handled this, but good to keep
    if (!shippingAddress || !paymentMethod) {
        res.status(400);
        return next(new Error('Shipping address and payment method are required'));
    }

    try {
        // 1. Get user's cart items
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            res.status(400);
            return next(new Error('No items in cart to order'));
        }

        // 2. Prepare order items
        const orderItems = cart.items.map(item => ({
            product: item.product,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            pack: item.pack,
            image: item.image,
        }));

        // 3. Calculate prices
        const itemsPrice = cart.totalPrice;
        const shippingPrice = itemsPrice > 500 ? 0 : 50; // Example rule
        const taxPrice = parseFloat((itemsPrice * 0.05).toFixed(2)); // Example 5% tax
        const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

        // 4. Create the order document
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            isPaid: paymentResult?.status === 'succeeded',
            paidAt: paymentResult?.status === 'succeeded' ? Date.now() : undefined,
            paymentResult: paymentResult ? {
                id: paymentResult.id,
                status: paymentResult.status,
                update_time: paymentResult.update_time,
                email_address: paymentResult.payer ? paymentResult.payer.email_address : shippingAddress.email,
            } : undefined,
            orderStatus: 'Pending',
        });

        // 5. Save the order (triggers pre-save hook for orderId)
        const createdOrder = await order.save();

        // 6. Update product stock (Crucial step!)
        const stockUpdateOps = order.items.map(item => {
            return {
                updateOne: {
                    // --- 2. CRITICAL FIX: Use 'variants._id' to match subdocument ---
                    filter: { _id: item.product, 'variants._id': item.variantId },
                    update: { $inc: { 'variants.$.stock': -item.quantity } }
                }
            };
        });

        if (stockUpdateOps.length > 0) {
            await Product.bulkWrite(stockUpdateOps);
        }

        // 7. Clear the user's cart
        await Cart.deleteOne({ user: userId });

        // --- 3. SEND ORDER CONFIRMATION EMAIL ---
        try {
            // Simple text email
            const subject = `Your JSM Masala Order Confirmation (#${createdOrder.orderId})`;
            const text = `Hi ${req.user.name},\n\nThank you for your order!\n\nOrder ID: ${createdOrder.orderId}\nTotal: ₹${createdOrder.totalPrice}\nStatus: ${createdOrder.orderStatus}\n\nWe will notify you once your order has shipped.\n\nBest,\nThe JSM Masala Team`;
            
            // Optional: Generate HTML email from a template
            // const html = await ejs.renderFile(path.join(__dirname, '../views/emails/orderConfirmation.ejs'), {
            //     name: req.user.name,
            //     order: createdOrder
            // });

            await sendEmail({
                to: shippingAddress.email, // Send to email provided in shipping
                subject: subject,
                text: text,
                // html: html // Uncomment if using HTML templates
            });
        } catch (emailError) {
            // Log the email error, but don't fail the order request
            console.error(`Order ${createdOrder.orderId} created, but confirmation email failed:`, emailError);
        }
        // --- END EMAIL SEND ---

        // 8. Respond with the created order
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Order creation failed:", error);
        next(error);
    }
};


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User can get their own, Admin can get any)
const getOrderById = async (req, res, next) => {
    const orderId = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(400);
        return next(new Error('Invalid Order ID format'));
    }

    try {
        const order = await Order.findById(orderId).populate('user', 'name email');

        if (order) {
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                return next(new Error('Not authorized to view this order'));
            }
            res.json(order);
        } else {
            res.status(404);
            return next(new Error('Order not found'));
        }
    } catch (error) {
        next(error);
    }
};


// --- Admin Only Controllers ---

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (e.g., to Shipped, Delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
        res.status(400);
        return next(new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }
     if (!mongoose.Types.ObjectId.isValid(orderId)) {
        res.status(400);
        return next(new Error('Invalid Order ID format'));
    }

    try {
        // Populate user and shippingAddress to get the email
        const order = await Order.findById(orderId).populate('user', 'name');

        if (order) {
            // Check if status is actually changing
            const oldStatus = order.orderStatus;
            order.orderStatus = status;

            if (status === 'Delivered') {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();

            // --- 4. SEND STATUS UPDATE EMAIL ---
            // Send email only if the status has changed
            if (oldStatus !== status && (status === 'Shipped' || status === 'Delivered' || status === 'Cancelled')) {
                 try {
                    const subject = `Your JSM Masala Order Status (#${order.orderId})`;
                    const text = `Hi ${order.user.name},\n\nYour order #${order.orderId} has been updated to: ${status}.\n\n` +
                                (status === 'Shipped' ? 'It is now on its way to you!\n' : '') +
                                (status === 'Delivered' ? 'Your order has been delivered. Enjoy!\n' : '') +
                                `\nBest,\nThe JSM Masala Team`;
                    
                    await sendEmail({
                        to: order.shippingAddress.email,
                        subject: subject,
                        text: text,
                    });
                } catch (emailError) {
                    console.error(`Order ${order.orderId} updated, but status email failed:`, emailError);
                }
            }
            // --- END EMAIL SEND ---

            res.json(updatedOrder);
        } else {
            res.status(404);
            return next(new Error('Order not found'));
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus,
};