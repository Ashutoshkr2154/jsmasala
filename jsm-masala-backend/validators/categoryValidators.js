const Joi = require('joi');

// Schema for creating or updating a category
const categorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Category name is required.',
            'string.min': 'Category name must be at least 2 characters long.',
            'string.max': 'Category name cannot exceed 50 characters.',
            'any.required': 'Category name is required.'
        }),
    // Add validation for description or image if you add those fields later
});

module.exports = { categorySchema };