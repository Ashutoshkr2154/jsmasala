const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: { // Link to the user who owns this wishlist
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user has only one wishlist
      index: true,
    },
    products: [ // An array of product ObjectIds
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      }
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;