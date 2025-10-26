const mongoose = require('mongoose');

// Sub-schema for individual items within the cart
const cartItemSchema = new mongoose.Schema({
    product: { // Reference to the Product document
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantId: { // ID of the specific variant chosen
        type: String, // Matches the variant ID in the Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1.'],
        default: 1,
    },
    price: { // Price per unit *at the time of adding* (important!)
        type: Number,
        required: true,
    },
    // Store key details directly for easier cart display
    name: { type: String, required: true },
    pack: { type: String }, // e.g., "100g"
    image: { type: String }, // URL of the main product image
}, { _id: false }); // No separate _id for subdocuments in the array

// Main schema for the user's cart
const cartSchema = new mongoose.Schema(
    {
        user: { // Link to the User document
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Each user has only one cart
            index: true,
        },
        items: [cartItemSchema], // Array of items
    },
    {
        timestamps: true, // createdAt, updatedAt for the cart document itself
        toJSON: { virtuals: true }, // Include virtuals when converting to JSON
        toObject: { virtuals: true },
    }
);

// Virtual property to calculate the total price of all items in the cart
cartSchema.virtual('totalPrice').get(function() {
    if (!this.items) return 0;
    return this.items.reduce((total, item) => total + item.quantity * item.price, 0);
});

// Virtual property to calculate the total number of items (sum of quantities)
cartSchema.virtual('totalItems').get(function() {
     if (!this.items) return 0;
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;