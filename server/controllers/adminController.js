const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Sales (Sum of all paid orders)
        const orders = await Order.find({ isPaid: true });
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // 2. Total Orders
        const totalOrders = await Order.countDocuments();

        // 3. Total Users
        const totalUsers = await User.countDocuments();

        // 4. Total Products
        const totalProducts = await Product.countDocuments();

        // 5. Recent Orders (Last 5)
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        res.json({
            totalSales,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
