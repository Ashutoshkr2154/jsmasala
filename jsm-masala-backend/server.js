const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// --- IMPORT ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
// --- END IMPORT ROUTES ---

// --- IMPORT ERROR MIDDLEWARE ---
const { notFound, errorHandler } = require('./middlewares/errorHandler');
// --- END ERROR MIDDLEWARE IMPORT ---

dotenv.config();
connectDB();
const app = express();

// --- Middlewares ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Basic Route for Testing ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to JSM Masala Backend API! 🌶️' });
});

// --- USE ROUTE HANDLERS ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
// --- END USE ROUTES ---

// --- USE ERROR HANDLING MIDDLEWARE ---
app.use(notFound);
app.use(errorHandler);
// --- END ERROR MIDDLEWARE USAGE ---

// --- Define Port and Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});