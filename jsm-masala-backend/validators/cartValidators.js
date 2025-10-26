const Joi = require('joi');

// Schema for adding an item to the cart
const addItemSchema = Joi.object({
    productId: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Product ID is required.',
        'string.hex': 'Product ID must be a valid ObjectId.',
        'string.length': 'Product ID must be 24 characters long.',
        'any.required': 'Product ID is required.'
    }),
    variantId: Joi.string().required().messages({ // Variant ID is a string/ObjectId from the sub-doc
        'string.empty': 'Variant ID is required.',
        'any.required': 'Variant ID is required.'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be a whole number.',
        'number.min': 'Quantity must be at least 1.',
        'any.required': 'Quantity is required.'
    }),
});

// Schema for updating item quantity
const updateQuantitySchema = Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be a whole number.',
        'number.min': 'Quantity must be at least 1.',
        'any.required': 'Quantity is required.'
    }),
});

module.exports = { addItemSchema, updateQuantitySchema };