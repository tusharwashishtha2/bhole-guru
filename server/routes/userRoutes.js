const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/wishlist').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/wishlist/:id').delete(protect, removeFromWishlist);
router.route('/').get(protect, admin, getAllUsers);

module.exports = router;
