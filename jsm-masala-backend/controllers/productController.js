const Product = require('../models/Product');
const Category = require('../models/Category'); // Needed to validate category
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const mongoose = require('mongoose'); // Needed for ObjectId validation

// --- Helper: Upload Images to Cloudinary ---
// Takes files from multer (req.files) and uploads them
const uploadImagesToCloudinary = async (files) => {
    const uploadedImages = [];
    if (!files || files.length === 0) return uploadedImages;

    // Use Promise.all for efficient parallel uploads
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            // Use upload_stream to upload from buffer (since we used memoryStorage)
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'jsm-masala/products', // Organize uploads in Cloudinary
                    // Optional: Add transformations (resize, optimize)
                    // transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }]
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error('Cloudinary upload result is undefined'));
                    }
                    // Return the data we need for the database
                    resolve({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                }
            );
            // Pipe the file buffer from multer into the upload stream
            uploadStream.end(file.buffer);
        });
    });

    try {
        // Wait for all upload promises to resolve
        const results = await Promise.all(uploadPromises);
        return results; // Returns array of { public_id, url }
    } catch (error) {
        console.error("Error uploading one or more images:", error);
        // If an upload fails, we throw an error to stop the product creation
        throw new Error('Image upload failed');
    }
};

// --- Helper: Delete Images from Cloudinary ---
const deleteImagesFromCloudinary = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) return;
    try {
        // Use destroy method for multiple deletions
        const result = await cloudinary.api.delete_resources(publicIds);
        console.log('Cloudinary Delete Result:', result);
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        // Don't throw error, just log it. Product deletion should proceed.
    }
};


// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    // Note: This expects multipart/form-data because of images
    // uploadMiddleware runs first, attaches files to req.files
    // validationMiddleware runs second, checks req.body
    
    const { name, description, category, variants, tags, isFeatured, shortDescription } = req.body;
    const files = req.files; // Files from multer

    // Check if files were uploaded
    if (!files || files.length === 0) {
        res.status(400);
        return next(new Error('At least one product image is required.'));
    }
    
    // --- Validation (already handled by Joi, but good to double check) ---
    // Validate Category ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
        res.status(400);
        return next(new Error(`Invalid category ID: ${category}`));
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(400);
        return next(new Error(`Category not found with ID: ${category}`));
    }
    // --- End Validation ---

    try {
        // 1. Upload images to Cloudinary
        const uploadedImages = await uploadImagesToCloudinary(files);

        // 2. Handle data parsing (from form-data)
        // Joi validation already parsed variants, but we re-parse or use as is
        let parsedVariants;
        try {
            parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        } catch (e) {
             res.status(400);
             return next(new Error('Invalid variants JSON format.'));
        }
        
        const parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || []);
        const parsedIsFeatured = isFeatured === 'true' || isFeatured === true;

        // 3. Create product in DB
        const product = await Product.create({
            name,
            description,
            shortDescription,
            category,
            variants: parsedVariants,
            images: uploadedImages, // Save Cloudinary { public_id, url } array
            tags: parsedTags,
            isFeatured: parsedIsFeatured,
        });

        res.status(201).json(product);

    } catch (error) {
        // If DB creation fails *after* image upload, we should delete the uploaded images
        // This is complex rollback logic. For now, we pass the error.
        // A more robust solution involves a queue or transaction pattern.
        console.error("Product creation failed:", error);
        next(error);
    }
};

// @desc    Get all products (paginated, filterable, searchable)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 12; // Default 12 products per page
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // --- Build Query Object ---
        const query = {};

        // Filter by Category (can be slug or ID)
        if (req.query.category) {
            const category = await Category.findOne({
                 $or: [
                    { slug: req.query.category.toLowerCase() }, 
                    { _id: mongoose.Types.ObjectId.isValid(req.query.category) ? req.query.category : null }
                ]
             });
            if (category) {
                 query.category = category._id;
            } else {
                 // Category not found, return no products
                 return res.json({ data: [], meta: { page, limit, total: 0, totalPages: 0 } });
            }
        }
        
        // Filter by Featured
        if (req.query.featured) {
            query.isFeatured = true;
        }

        // Search by Keyword (name, description, tags)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // 'i' for case-insensitive
            query.$or = [
                { name: searchRegex },
                { shortDescription: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } }, // Search if tag matches regex
            ];
        }
         
        // Filter by Price Range (checks if *any* variant price is in range)
         if (req.query.price) {
            const [minStr, maxStr] = req.query.price.split('-'); // e.g., "100-500"
            const minPrice = parseInt(minStr, 10);
            const maxPrice = parseInt(maxStr, 10);
            
            if (!isNaN(minPrice) || !isNaN(maxPrice)) {
                query['variants.price'] = {};
                if (!isNaN(minPrice)) {
                    query['variants.price'].$gte = minPrice;
                }
                if (!isNaN(maxPrice)) {
                    query['variants.price'].$lte = maxPrice;
                }
            }
        }
        // --- End Query Build ---


        // --- Execute Query ---
        const productsQuery = Product.find(query)
            .populate('category', 'name slug') // Populate category info
            .skip(skip)
            .limit(limit);

        // --- Sorting ---
        const sortBy = req.query.sort;
        if (sortBy === 'price-asc') {
            productsQuery.sort({ 'variants.0.price': 1 }); // Approx sort by first variant price
        } else if (sortBy === 'price-desc') {
            productsQuery.sort({ 'variants.0.price': -1 }); // Approx sort
        } else if (sortBy === 'rating-desc') {
             productsQuery.sort({ rating: -1 });
        } else if (sortBy === 'newest-desc') {
             productsQuery.sort({ createdAt: -1 });
        } else {
             productsQuery.sort({ createdAt: -1 }); // Default: newest first
        }

        // Get total count for pagination metadata
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Execute the main query
        const products = await productsQuery;

        res.json({
            data: products,
            meta: { page, limit, total: totalProducts, totalPages },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductByIdOrSlug = async (req, res, next) => {
    try {
        const idOrSlug = req.params.idOrSlug;
        let product;

        // Try finding by slug first
        product = await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug');

        // If not found by slug, try finding by ID (if it's a valid ID)
        if (!product && mongoose.Types.ObjectId.isValid(idOrSlug)) {
            product = await Product.findById(idOrSlug).populate('category', 'name slug');
        }

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            return next(new Error('Product not found'));
        }
    } catch (error) {
        next(error);
    }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    const productId = req.params.id;
    const { name, description, category, variants, tags, isFeatured, shortDescription } = req.body;
    const files = req.files; // New images (optional)

     if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        return next(new Error('Invalid product ID format'));
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        // --- Handle Image Updates ---
        let updatedImages = product.images; // Start with existing images
        
        // Check if new images are being uploaded
        if (files && files.length > 0) {
            // 1. Delete old images from Cloudinary
            const oldPublicIds = product.images.map(img => img.public_id);
            await deleteImagesFromCloudinary(oldPublicIds);

            // 2. Upload new images
            const newUploadedImages = await uploadImagesToCloudinary(files);
            updatedImages = newUploadedImages; // Replace old images with new ones
        }
        // TODO: Add logic for *selectively* deleting images if needed
        // (e.g., req.body.imagesToDelete = ['public_id_1'])
        // --- End Image Updates ---


        // --- Update other fields ---
        product.name = name || product.name;
        product.description = description || product.description;
        product.shortDescription = shortDescription || product.shortDescription;
        product.isFeatured = (isFeatured === 'true' || isFeatured === true) ?? product.isFeatured;

         // Update Category if provided and valid
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                 res.status(400); return next(new Error('Invalid category ID format'));
            }
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(400); return next(new Error('Category not found'));
            }
            product.category = category;
        }

        // Update Variants if provided
        if (variants) {
             try {
                const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
                 if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) throw new Error();
                 product.variants = parsedVariants;
            } catch (e) {
                res.status(400); return next(new Error('Invalid variants format'));
            }
        }

        // Update Tags if provided (check for undefined to allow clearing tags)
        if (tags !== undefined) { 
             product.tags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || []);
        }

        product.images = updatedImages; // Assign the (potentially new) images array
        // --- End Field Updates ---

        const updatedProduct = await product.save(); // Triggers pre-save hooks (like slug update)
        res.json(updatedProduct);

    } catch (error) {
        console.error("Product update failed:", error);
        next(error);
    }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
     const productId = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        return next(new Error('Invalid product ID format'));
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        // 1. Delete product images from Cloudinary
        const publicIds = product.images.map(img => img.public_id);
        await deleteImagesFromCloudinary(publicIds);

        // 2. Delete product from DB
        await product.deleteOne();

        res.json({ message: 'Product removed successfully' });

    } catch (error) {
        console.error("Product deletion failed:", error);
        next(error);
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductByIdOrSlug,
    updateProduct,
    deleteProduct,
};