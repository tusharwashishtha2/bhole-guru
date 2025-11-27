const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, seedProducts, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.post('/', protect, admin, createProduct);
router.post('/seed', seedProducts); // Temporary for setup

module.exports = router;
