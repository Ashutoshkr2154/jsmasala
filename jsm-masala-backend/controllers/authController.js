const User = require('../models/User'); // Import User model
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken'); // Import token generators
const sendEmail = require('../utils/sendEmail'); // Import email utility
const crypto = require('crypto'); // Import crypto
const jwt = require('jsonwebtoken'); // <-- 1. Import jsonwebtoken

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        return next(new Error('Please provide name, email, and password'));
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error('User already exists with this email'));
        }

        const user = await User.create({ name, email, password, phone });

        if (user) {
            // ... (Send Welcome Email) ...
            sendEmail({ to: user.email, subject: 'Welcome to JSM Masala!', text: `Hi ${user.name},\n\nWelcome...` })
                .catch(err => console.error('Welcome email failed to send:', err));

            const accessToken = generateAccessToken(user._id, user.role);
            const refreshToken = generateRefreshToken(user._id);

            // Save Refresh Token to DB
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            // SET HTTPONLY COOKIE
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: accessToken,
                // refreshToken removed from response body
            });
        } else {
            res.status(400);
            return next(new Error('Invalid user data'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password +refreshToken');

        if (user && (await user.comparePassword(password))) {
            const accessToken = generateAccessToken(user._id, user.role);
            const newRefreshToken = generateRefreshToken(user._id);

            // Save/Update Refresh Token to DB
            user.refreshToken = newRefreshToken;
            await user.save({ validateBeforeSave: false });

            // SET HTTPONLY COOKIE
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: accessToken,
                // refreshToken removed from response body
            });
        } else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password - Get reset token
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    // ... (rest of forgotPassword function remains the same) ...
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Password reset attempt for non-existent email: ${email}`);
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
        const message = `You requested a password reset.\n\nPlease click this link (valid for 10 minutes):\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.\n\nBest,\nThe JSM Masala Team`;
        const subject = 'JSM Masala - Password Reset Request';
        try {
            await sendEmail({ to: user.email, subject: subject, text: message });
            res.json({ message: 'Password reset link sent to email.' });
        } catch (emailError) {
            console.error('Password reset email failed:', emailError);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new Error('Email could not be sent. Please try again later.'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    // ... (rest of resetPassword function remains the same) ...
    try {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400);
            return next(new Error('Token is invalid or has expired. Please request a new one.'));
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        sendEmail({ to: user.email, subject: 'Your Password Has Been Changed', text: `Hi ${user.name},\n\nYour password...` })
            .catch(err => console.error('Password change confirmation email failed:', err));
        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
    const userId = req.user._id;

    try {
        // Clear refresh token in DB
        await User.findByIdAndUpdate(userId, { refreshToken: null });

        // CLEAR HTTPONLY COOKIE
        res.clearCookie('refreshToken', {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite: 'strict',
        });

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// --- 2. ADD refreshToken FUNCTION ---
// @desc    Refresh access token using refresh token (from cookie)
// @route   POST /api/auth/refresh
// @access  Public (but requires valid refresh token cookie)
const refreshToken = async (req, res, next) => {
    // 1. Get refresh token from HttpOnly cookie
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401); // Unauthorized
        return next(new Error('Not authorized, no refresh token found'));
    }

    try {
        // 2. Verify the refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // 3. Find user by ID from token payload and check stored token
        const user = await User.findById(decoded.id).select('+refreshToken');

        // 4. Check if user exists and if the provided token matches the one in DB
        if (!user || user.refreshToken !== token) {
            res.status(403); // Forbidden
            return next(new Error('Forbidden: Invalid refresh token'));
        }

        // 5. If valid, generate a new access token
        const newAccessToken = generateAccessToken(user._id, user.role);

        // 6. Send the new access token back
        res.json({
            accessToken: newAccessToken,
            // Send user details back so frontend store can be re-synced if needed
             _id: user._id,
             name: user.name,
             email: user.email,
             role: user.role,
        });

    } catch (error) {
        console.error('Refresh token error:', error.message);
        if (error.name === 'TokenExpiredError') {
            res.status(403);
            return next(new Error('Forbidden: Refresh token expired'));
        }
         if (error.name === 'JsonWebTokenError') {
             res.status(403);
             return next(new Error('Forbidden: Invalid refresh token'));
         }
        res.status(401);
        return next(new Error('Not authorized, refresh token failed'));
    }
};
// --- END refreshToken FUNCTION ---


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logoutUser,
    refreshToken, // <-- 3. Export refreshToken
};