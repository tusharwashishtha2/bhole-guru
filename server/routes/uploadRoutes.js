const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Public (Protected by Admin check in frontend for now, should be protected middleware later)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

module.exports = router;
