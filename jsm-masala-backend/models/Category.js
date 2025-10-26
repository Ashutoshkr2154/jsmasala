const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true, // Ensure category names are unique
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: { // URL-friendly identifier
      type: String,
      unique: true,
      lowercase: true,
      index: true, // Index for faster lookups by slug
    },
    // Optional: Add description or image URL if needed later
    // description: String,
    // image: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Middleware: Automatically create/update the 'slug' based on the 'name' before saving
categorySchema.pre('save', function (next) {
  // Only update slug if name is modified (or is new)
  if (!this.isModified('name')) {
    return next();
  }
  // Simple slug generation: lowercase, replace spaces with hyphens, remove special chars
  this.slug = this.name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, ''); // Remove non-alphanumeric chars except hyphens
  next();
});

// Middleware for findOneAndUpdate (important for updating slugs correctly when name changes)
categorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = update.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;