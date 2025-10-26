const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 2 characters long.',
            'string.max': 'Name cannot exceed 50 characters.',
            'any.required': 'Name is required.'
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Basic email validation
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is required.'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 8 characters long.',
            'any.required': 'Password is required.'
        }),
    phone: Joi.string()
        .allow('') // Allow empty string if phone is optional
        .pattern(/^[0-9]{10}$/) // Example: Basic 10-digit phone validation
        .messages({
            'string.pattern.base': 'Please provide a valid 10-digit phone number.'
        }),
    address: Joi.object({ // Optional address object
        street: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zipCode: Joi.string().allow('').pattern(/^[0-9]{6}$/).messages({'string.pattern.base': 'Zip code must be 6 digits.'}),
        country: Joi.string().allow('')
    }).optional()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is required.'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.'
        }),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is required.'
        }),
});

// --- ADDED SCHEMA for Reset Password ---
const resetPasswordSchema = Joi.object({
    // 'password' field validation (should match registration)
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'New password is required.',
            'string.min': 'New password must be at least 8 characters long.',
            'any.required': 'New password is required.'
        }),
});
// --- END ---

// --- UPDATED EXPORTS to include resetPasswordSchema ---
module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema // Added export
};
// --- END ---