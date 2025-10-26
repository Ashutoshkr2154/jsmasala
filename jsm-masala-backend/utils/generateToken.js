// utils/generateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure environment variables are loaded

/**
 * Generates a short-lived Access Token.
 * @param {string} userId - The MongoDB user ID.
 * @param {string} role - The user's role (e.g., 'user', 'admin').
 * @returns {string} The JWT Access Token.
 * @throws {Error} If JWT_SECRET is missing.
 */
const generateAccessToken = (userId, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign(
    { id: userId, role: role }, // Payload
    secret,                     // Secret key from .env
    { expiresIn: '15m' }        // Expires in 15 minutes
  );
};

/**
 * Generates a long-lived Refresh Token.
 * @param {string} userId - The MongoDB user ID.
 * @returns {string} The JWT Refresh Token.
 * @throws {Error} If JWT_REFRESH_SECRET is missing.
 */
const generateRefreshToken = (userId) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables.');
  }
  return jwt.sign(
    { id: userId },             // Payload
    refreshSecret,              // Refresh secret key from .env
    { expiresIn: '7d' }         // Expires in 7 days
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};