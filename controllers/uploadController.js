// controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'uploads',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Cloudinary upload error',
            error: error.message
          });
        }

        res.status(200).json({
          success: true,
          message: 'Image uploaded successfully',
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage
};