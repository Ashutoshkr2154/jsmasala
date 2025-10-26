const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Needed to check stock and get details
const mongoose = require('mongoose');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
    try {
        // Find cart by user ID (attached by 'protect' middleware) and populate product details
        const cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.product', // Populate the product field within the items array
                select: 'name images variants slug', // Select only necessary product fields
            });

        if (!cart) {
            // If user has no cart yet, return an empty cart structure
            return res.json({
                _id: null, // Indicates no cart exists in DB yet
                user: req.user._id,
                items: [],
                totalPrice: 0,
                totalItems: 0,
            });
        }

        // Optional: Re-calculate total price and items if virtuals aren't used/trusted
        // const totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        // const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            _id: cart._id,
            user: cart.user,
            items: cart.items,
            totalPrice: cart.totalPrice, // Use virtual
            totalItems: cart.totalItems, // Use virtual
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res, next) => {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    // --- Validation ---
    if (!productId || !variantId || !quantity || quantity < 1) {
        res.status(400);
        return next(new Error('Product ID, Variant ID, and a valid quantity are required'));
    }
     if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        return next(new Error('Invalid Product ID format'));
    }
    // Variant ID is string, no ObjectId check needed unless it refs another collection
    // --- End Validation ---

    try {
        // 1. Find the product and the specific variant
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        const variant = product.variants.find(v => v.id === variantId); // Note: Mongoose subdoc id is string/ObjectId like
        if (!variant) {
            res.status(404);
            return next(new Error('Variant not found for this product'));
        }

        // 2. Check stock
        if (variant.stock < quantity) {
            res.status(400);
            return next(new Error(`Insufficient stock for ${product.name} (${variant.pack}). Available: ${variant.stock}`));
        }

        // 3. Find user's cart (or create if none exists)
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // 4. Check if item (product + variant) already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.variantId === variantId
        );

        if (existingItemIndex > -1) {
            // Item exists, update quantity
            const existingItem = cart.items[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            // Re-check stock for the *total* quantity
            if (variant.stock < newQuantity) {
                 res.status(400);
                 return next(new Error(`Cannot add ${quantity}. Total quantity (${newQuantity}) would exceed stock (${variant.stock}) for ${product.name} (${variant.pack}).`));
            }
            existingItem.quantity = newQuantity;

        } else {
            // Item does not exist, add it to the items array
            cart.items.push({
                product: productId,
                variantId: variantId,
                quantity: quantity,
                price: variant.price, // Store price at time of adding
                pack: variant.pack,   // Store variant details
                name: product.name,   // Store product name
                image: product.images.length > 0 ? product.images[0].url : '/path/to/default.jpg' // Store image
            });
        }

        // 5. Save the updated cart
        const updatedCart = await cart.save();

        // 6. Populate product details for the response (optional but good for frontend)
        await updatedCart.populate({
             path: 'items.product',
             select: 'name images variants slug',
         });

        res.status(200).json({
            _id: updatedCart._id,
            user: updatedCart.user,
            items: updatedCart.items,
            totalPrice: updatedCart.totalPrice,
            totalItems: updatedCart.totalItems,
         });

    } catch (error) {
        next(error);
    }
};


// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId (Using variantId as itemId for simplicity)
// @access  Private
const updateCartItemQuantity = async (req, res, next) => {
    const { variantId } = req.params; // Use variantId from URL param
    const { quantity } = req.body;
    const userId = req.user._id;

    // --- Validation ---
    if (!quantity || quantity < 1) {
        res.status(400);
        return next(new Error('A valid quantity (>= 1) is required'));
    }
    // --- End Validation ---

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404);
            return next(new Error('Cart not found'));
        }

        const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
        if (itemIndex === -1) {
            res.status(404);
            return next(new Error('Item not found in cart'));
        }

        // Find the product and variant to check stock
        const product = await Product.findById(cart.items[itemIndex].product);
        if (!product) {
            // Product might have been deleted, remove from cart?
             cart.items.splice(itemIndex, 1);
             await cart.save();
             res.status(404);
             return next(new Error('Product associated with cart item not found. Item removed.'));
        }
        const variant = product.variants.find(v => v.id === variantId);
         if (!variant) {
            // Variant might have been deleted, remove from cart?
             cart.items.splice(itemIndex, 1);
             await cart.save();
             res.status(404);
             return next(new Error('Variant associated with cart item not found. Item removed.'));
         }

        // Check stock
        if (variant.stock < quantity) {
            res.status(400);
            return next(new Error(`Insufficient stock. Available: ${variant.stock}`));
        }

        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        const updatedCart = await cart.save();

        await updatedCart.populate({ path: 'items.product', select: 'name images variants slug' });

         res.json({
            _id: updatedCart._id,
            items: updatedCart.items,
            totalPrice: updatedCart.totalPrice,
            totalItems: updatedCart.totalItems,
         });

    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId (Using variantId as itemId)
// @access  Private
const removeItemFromCart = async (req, res, next) => {
    const { variantId } = req.params; // Use variantId from URL param
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404);
            return next(new Error('Cart not found'));
        }

        const initialLength = cart.items.length;
        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.variantId !== variantId);

        if (cart.items.length === initialLength) {
             res.status(404);
             return next(new Error('Item not found in cart'));
        }

        const updatedCart = await cart.save();

        await updatedCart.populate({ path: 'items.product', select: 'name images variants slug' });

         res.json({
             _id: updatedCart._id,
            items: updatedCart.items,
            totalPrice: updatedCart.totalPrice,
            totalItems: updatedCart.totalItems,
         });

    } catch (error) {
        next(error);
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            // No cart to clear, arguably not an error
             return res.json({
                _id: null,
                user: userId,
                items: [],
                totalPrice: 0,
                totalItems: 0,
            });
        }

        cart.items = []; // Empty the items array
        const updatedCart = await cart.save();

        res.json({
             _id: updatedCart._id,
            items: updatedCart.items,
            totalPrice: 0,
            totalItems: 0,
         });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
};