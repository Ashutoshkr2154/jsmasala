const mongoose = require('mongoose');
const crypto = require('crypto'); // For generating a unique order ID (optional)

// --- Sub-schema for items within an order (similar to cart items) ---
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantId: {
        type: String, // Or ObjectId if variants are separate documents
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: { // Price per unit *at the time of order*
        type: Number,
        required: true,
    },
    // Store key details directly on the order item for historical accuracy
    name: { type: String, required: true },
    pack: { type: String },
    image: { type: String },
}, { _id: false });

// --- Sub-schema for shipping address ---
const shippingAddressSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }, // Assuming default country
    phone: { type: String, required: true },
    email: { type: String, required: true }, // Store email used for order
}, { _id: false });

// --- Main Order Schema ---
const orderSchema = new mongoose.Schema(
    {
        // Custom, human-readable Order ID (e.g., JSM-20251023-ABCDE)
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: { // Link to the user who placed the order
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        items: [orderItemSchema], // Array of items ordered
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        // Billing address can be added if different from shipping
        // billingAddress: { type: shippingAddressSchema },

        // Pricing Summary
        itemsPrice: { // Subtotal of items
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: { // e.g., GST
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: { // Grand total
            type: Number,
            required: true,
            default: 0.0,
        },

        // Payment Details
        paymentMethod: { // e.g., 'Card', 'UPI', 'COD' (if supported)
            type: String,
            required: true,
        },
        paymentResult: { // Store details from payment gateway
            id: { type: String }, // Payment gateway transaction ID
            status: { type: String }, // e.g., 'succeeded', 'pending', 'failed'
            update_time: { type: String },
            email_address: { type: String }, // Payer email from gateway
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },

        // Order Status Tracking
        orderStatus: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
            index: true,
        },
        deliveredAt: {
            type: Date,
        },
        // Optional: Tracking number, shipping carrier
        // trackingNumber: { type: String },
        // carrier: { type: String },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

// --- Middleware to generate a unique Order ID before saving ---
orderSchema.pre('save', function (next) {
    if (!this.isNew) { // Only run for new orders
        return next();
    }
    // Generate a unique ID (e.g., JSM-YYYYMMDD-RandomString)
    const date = new Date();
    const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
    this.orderId = `JSM-${dateString}-${randomString}`;
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;