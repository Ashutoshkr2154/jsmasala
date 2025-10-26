const multer = require('multer');

// Configure multer for memory storage (process buffer before uploading to cloud)
const storage = multer.memoryStorage();

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept
  } else {
    // Reject file with a specific error message
    cb(new Error('Invalid file type. Please upload only images.'), false);
  }
};

// Set up multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Middleware function generator for multiple images
// fieldName: Matches the 'name' attribute of the file input in the form
// maxCount: Maximum number of files allowed for this field
const uploadMultipleImages = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

module.exports = {
    // Export only the multiple image uploader for now, as products need it
    uploadMultipleImages,
};