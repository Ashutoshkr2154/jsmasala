const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product'); // Needed to check if product exists
const mongoose = require('mongoose');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
    try {
        // Find wishlist by user ID and populate the 'products' array
        // with selected fields from the Product model
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate({
                path: 'products',
                select: 'name slug images variants category rating reviewsCount', // Select fields you want to show
                populate: { path: 'category', select: 'name slug' } // Populate category within product
            });

        if (!wishlist) {
            // If no wishlist exists, return an empty one
            return res.json({
                _id: null,
                user: req.user._id,
                products: [], // Empty products array
            });
        }

        res.json(wishlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Add or remove a product from the wishlist (toggle)
// @route   POST /api/wishlist
// @access  Private
const toggleWishlist = async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user._id;

    // --- Validation ---
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        return next(new Error('Invalid Product ID'));
    }
    // --- End Validation ---

    try {
        // 1. Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        // 2. Find the user's wishlist (or create one if it doesn't exist)
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        // 3. Check if the product is already in the wishlist
        const productIndex = wishlist.products.findIndex(
            (pid) => pid.toString() === productId
        );

        let message = '';
        if (productIndex > -1) {
            // Product exists, remove it ($pull)
            wishlist.products.pull(productId);
            message = 'Product removed from wishlist';
        } else {
            // Product does not exist, add it ($addToSet to prevent duplicates)
            wishlist.products.addToSet(productId); // addToSet automatically handles duplicates
            message = 'Product added to wishlist';
        }

        // 4. Save the wishlist
        await wishlist.save();

        // 5. Populate the updated wishlist for the response
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'products',
                select: 'name slug images variants category rating reviewsCount',
                populate: { path: 'category', select: 'name slug' }
            });

        res.status(200).json({
            message,
            wishlist: populatedWishlist,
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getWishlist,
    toggleWishlist,
};