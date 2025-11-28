router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/verify').post(protect, verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
