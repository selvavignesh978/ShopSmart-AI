const express = require('express');
const { cloudinary, upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary credentials are missing in environment variables'
      });
    }

    // Stream the memory buffer directly to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'shopsmart_products',
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    return res.status(200).json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error('Cloudinary Upload Route Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
});

module.exports = router;