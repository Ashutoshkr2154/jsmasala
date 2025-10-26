const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        // Run aggregation queries in parallel
        const [
            userCount,
            orderCount,
            totalRevenueResult,
            outOfStockCount
        ] = await Promise.all([
            // Count total users
            User.countDocuments(),
            // Count total orders
            Order.countDocuments(),
            // Calculate total revenue from 'Delivered' or 'Shipped' orders
            Order.aggregate([
                { $match: { orderStatus: { $in: ['Shipped', 'Delivered'] } } },
                { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
            ]),
            // Count products where *all* variants are out of stock
            Product.aggregate([
                 { $match: { 'variants.stock': { $lte: 0 } } }, // Find products with at least one variant OOS
                 { $project: {
                     _id: 1,
                     // Check if *all* variants have stock <= 0
                     allVariantsOutOfStock: {
                         $allElementsTrue: [ { $map: { input: "$variants", as: "v", in: { $lte: [ "$$v.stock", 0 ] } } } ]
                     }
                 } },
                 { $match: { allVariantsOutOfStock: true } },
                 { $count: "outOfStockCount" }
            ])
        ]);

        // Extract results from aggregation arrays
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
        const productsOutOfStock = outOfStockCount.length > 0 ? outOfStockCount[0].outOfStockCount : 0;

        res.json({
            users: userCount,
            orders: orderCount,
            revenue: totalRevenue,
            outOfStockProducts: productsOutOfStock,
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        // Fetch all users, excluding their password and refresh token
        const users = await User.find({})
            .select('-password -refreshToken')
            .sort({ createdAt: -1 });
            
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// --- TODO: Add Delete User Controller ---
// const deleteUser = async (req, res, next) => { ... }

// --- TODO: Add Update User Role Controller ---
// const updateUserRole = async (req, res, next) => { ... }


module.exports = {
    getDashboardStats,
    getUsers,
    // deleteUser,
    // updateUserRole,
};