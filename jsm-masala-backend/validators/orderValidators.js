const Joi = require('joi');

// Schema for the shipping address object (nested within createOrderSchema)
const shippingAddressSchema = Joi.object({
    firstName: Joi.string().trim().required().messages({
        'string.empty': 'First name is required.', 'any.required': 'First name is required.'
    }),
    lastName: Joi.string().trim().required().messages({
        'string.empty': 'Last name is required.', 'any.required': 'Last name is required.'
    }),
    address: Joi.string().trim().required().messages({
        'string.empty': 'Address is required.', 'any.required': 'Address is required.'
    }),
    apartment: Joi.string().allow('').optional(), // Optional field
    city: Joi.string().trim().required().messages({
        'string.empty': 'City is required.', 'any.required': 'City is required.'
    }),
    state: Joi.string().trim().required().messages({
        'string.empty': 'State is required.', 'any.required': 'State is required.'
    }),
    zipCode: Joi.string().trim().pattern(/^[0-9]{6}$/).required().messages({ // Indian Pincode format
        'string.empty': 'Zip code is required.',
        'string.pattern.base': 'Zip code must be 6 digits.',
        'any.required': 'Zip code is required.'
    }),
    country: Joi.string().trim().default('India'), // Default country
    phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({ // 10-digit Indian phone number
        'string.empty': 'Phone number is required.',
        'string.pattern.base': 'Phone number must be 10 digits.',
        'any.required': 'Phone number is required.'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Please provide a valid email.',
        'any.required': 'Email is required.'
    }),
});

// Schema for the main order creation request body
const createOrderSchema = Joi.object({
    shippingAddress: shippingAddressSchema.required().messages({
        'any.required': 'Shipping address object is required.'
    }),
    paymentMethod: Joi.string().trim().required().messages({
        'string.empty': 'Payment method is required.',
        'any.required': 'Payment method is required.'
    }),
    // paymentResult is optional and depends on payment gateway flow
    paymentResult: Joi.object({
        id: Joi.string(),
        status: Joi.string(),
        update_time: Joi.string(),
        // Add other expected fields from your payment gateway response if needed
    }).optional().allow(null), // Allow it to be null if not provided
});

// Schema for updating order status (used by admin)
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') // Match enum in Order model
        .required()
        .messages({
            'string.empty': 'Order status is required.',
            'any.only': 'Invalid status. Must be one of: Pending, Processing, Shipped, Delivered, Cancelled.',
            'any.required': 'Order status is required.'
        }),
});


module.exports = { createOrderSchema, updateStatusSchema };