const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Import the crypto module

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't send password in queries by default
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // --- ADDED refreshToken FIELD ---
    refreshToken: {
        type: String,
        select: false // Don't include this field in queries by default
    },
    // --- END ---
  },
  {
    timestamps: true,
  }
);

// --- Password Hashing Middleware ---
userSchema.pre('save', async function (next) {
  // Only run if password was modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Password Comparison Method ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- Method to generate a reset token ---
userSchema.methods.createPasswordResetToken = function () {
  // 1. Generate a simple token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2. Hash the token and save it to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set an expiration time (e.g., 10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes in ms

  // 4. Return the *unhashed* token (this is what we email to the user)
  return resetToken;
};
// --- END METHOD ---

const User = mongoose.model('User', userSchema);

module.exports = User;