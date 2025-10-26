const mongoose = require('mongoose');

// --- Sub-schema for Product Variants ---
const variantSchema = new mongoose.Schema({
    pack: { // e.g., "100g", "200g", "500g"
        type: String,
        required: [true, 'Variant pack size is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Variant price is required'],
        min: [0, 'Price cannot be negative'],
    },
    mrp: { // Maximum Retail Price (Optional)
        type: Number,
        min: [0, 'MRP cannot be negative'],
        // Custom validator to ensure MRP >= price
        validate: {
            validator: function(value) {
                // `this` refers to the variant document being validated
                return value >= this.price;
            },
            message: 'MRP ({VALUE}) must be greater than or equal to the selling price'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Variant stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    // Optional: SKU, barcode, etc.
});

// --- Main Product Schema ---
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
            index: true, // Index for faster searching by name
        },
        slug: {
            type: String,
            required: true, // Will be auto-generated
            unique: true,
            lowercase: true,
            index: true, // Index for faster lookups by slug
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [250, 'Short description cannot exceed 250 characters'],
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: mongoose.Schema.ObjectId, // Reference to the Category model
            ref: 'Category', // Links to the 'Category' collection
            required: [true, 'Product must belong to a category'],
            index: true, // Index for faster filtering by category
        },
        variants: {
            type: [variantSchema], // Array of variant sub-documents
            required: true,
            validate: [v => Array.isArray(v) && v.length > 0, 'Product must have at least one variant']
        },
        images: [ // Array of image objects from Cloudinary
            {
                public_id: { type: String, required: true }, // Cloudinary public ID
                url: { type: String, required: true },       // Cloudinary secure URL
            }
        ],
        tags: [String], // e.g., ['organic', 'powder', 'spicy']
        rating: { // Average rating - calculated from reviews later
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewsCount: { // Number of reviews - updated when reviews are added/removed
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        // We might calculate total stock dynamically or store it if needed frequently
        // totalStock: { type: Number, default: 0 }
    },
    {
        timestamps: true, // Adds createdAt, updatedAt
        toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
        toObject: { virtuals: true }, // Ensure virtuals are included when converting to plain objects
    }
);

// --- Middleware to generate slug before saving ---
productSchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        return next();
    }
    // Simple slug generation (replace special chars, make lowercase)
    this.slug = this.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, ''); // Remove non-alphanumeric chars except hyphen
    next();
});

// --- Middleware to update slug on name change (using findOneAndUpdate) ---
// This ensures slug updates when using methods like findByIdAndUpdate
productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = update.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

// --- Virtual for Base Price ---
// Optionally create a virtual property to easily get the lowest variant price
productSchema.virtual('basePrice').get(function() {
    if (!this.variants || this.variants.length === 0) return null;
    return Math.min(...this.variants.map(v => v.price));
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;