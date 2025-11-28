import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createOrder, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, verifyPayment, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/verify').post(protect, verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

export default router;
