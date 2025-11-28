const express = require('express');
const { getContent, updateContent } = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getContent)
    .put(protect, admin, updateContent);

module.exports = router;
