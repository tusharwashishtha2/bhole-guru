const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, getWishlist, addToWishlist, removeFromWishlist, deleteUser, getUserById, updateUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/wishlist').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/wishlist/:id').delete(protect, removeFromWishlist);
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
