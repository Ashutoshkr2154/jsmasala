const Joi = require('joi');

// Schema for a single variant
const variantSchema = Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    pack: Joi.string().trim().required().messages({
        'string.empty': 'Variant pack size is required.',
        'any.required': 'Variant pack size is required.'
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Variant price must be a number.',
        'number.min': 'Variant price cannot be negative.',
        'any.required': 'Variant price is required.'
    }),
    mrp: Joi.number().min(Joi.ref('price')).optional().allow(null).messages({
        'number.min': 'MRP must be >= price.'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Variant stock must be a number.',
        'number.integer': 'Variant stock must be whole.',
        'number.min': 'Variant stock cannot be negative.',
        'any.required': 'Variant stock is required.'
    }),
});

// Helper to parse JSON strings from form-data
// Let's modify this slightly to return undefined on error, simplifying the schema
const parseJsonString = (value, helpers) => {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            // Basic check if it looks like the expected array structure
            if (Array.isArray(parsed)) {
                return parsed;
            }
            // If not an array after parsing, it's invalid for variants
            return helpers.error('array.base', { message: 'Variants must be an array.' });
        } catch (error) {
            // If JSON parsing fails
            return helpers.error('any.invalid', { message: 'Variants string is not valid JSON.' });
        }
    }
    // If it's not a string initially, let the next Joi rule handle it
    return value;
};

// --- Schema for Creating a Product ---
const createProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'Product name is required.', 'string.min': 'Name needs 2+ chars.', 'string.max': 'Name max 100 chars.', 'any.required': 'Product name is required.'
    }),
    shortDescription: Joi.string().trim().max(250).allow('').optional().messages({
        'string.max': 'Short description max 250 chars.'
    }),
    description: Joi.string().trim().required().messages({
        'string.empty': 'Description is required.', 'any.required': 'Description is required.'
    }),
    category: Joi.string().hex().length(24).required().messages({
        'string.empty': 'Category ID is required.', 'string.hex': 'Invalid Category ID.', 'string.length': 'Invalid Category ID length.', 'any.required': 'Category ID is required.'
    }),
    // --- CORRECTED VARIANTS VALIDATION ---
    variants: Joi.alternatives()
        .try(
            // Try validating directly as an array
            Joi.array().items(variantSchema).min(1),
            // Try parsing a string first, then validating the result as an array
            Joi.string().custom(parseJsonString, 'JSON parse').message('Variants must be a valid JSON array string.')
                    .required() // Ensure the string version triggers the custom parser if present
                    .messages({'any.required': 'Variants are required.'}) // Redundant but explicit
        )
        .required()
        .messages({
            'array.min': 'Product needs at least one variant.',
            'any.required': 'Variants are required.',
            'alternatives.types': 'Variants must be a valid array or a JSON array string.',
            'any.invalid': 'Variants data invalid.' // From custom parser
        }),
    // --- END CORRECTION ---
    tags: Joi.alternatives().try(
        Joi.string().trim().allow('').optional(),
        Joi.array().items(Joi.string().trim()).optional()
    ),
    isFeatured: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid('true', 'false')
    ).optional().default(false)
});

// --- Schema for Updating a Product ---
const updateProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional().messages({
        'string.min': 'Name needs 2+ chars.', 'string.max': 'Name max 100 chars.'
    }),
    shortDescription: Joi.string().trim().max(250).allow('').optional().messages({
        'string.max': 'Short description max 250 chars.'
    }),
    description: Joi.string().trim().allow('').optional(),
    category: Joi.string().hex().length(24).optional().messages({
        'string.hex': 'Invalid Category ID.', 'string.length': 'Invalid Category ID length.'
    }),
    // --- CORRECTED VARIANTS VALIDATION ---
    variants: Joi.alternatives()
        .try(
            Joi.array().items(variantSchema).min(1),
            Joi.string().custom(parseJsonString, 'JSON parse').message('Variants must be a valid JSON array string.')
        )
        .optional() // Optional overall for updates
        .messages({
            'array.min': 'Product needs at least one variant if provided.',
            'alternatives.types': 'Variants must be a valid array or a JSON array string.',
            'any.invalid': 'Variants data invalid.'
        }),
    // --- END CORRECTION ---
    tags: Joi.alternatives().try(
        Joi.string().trim().allow(''),
        Joi.array().items(Joi.string().trim())
    ).optional(),
    isFeatured: Joi.alternatives().try(
        Joi.boolean(),
        Joi.string().valid('true', 'false')
    ).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update.'
});

module.exports = { createProductSchema, updateProductSchema };