const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create new order (Razorpay)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            // Check stock availability
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.name}`);
                }
                if (product.stock < item.qty) {
                    res.status(400);
                    throw new Error(`Insufficient stock for ${item.name}`);
                }
            }

            // Create Razorpay Order
            const options = {
                amount: Math.round(totalPrice * 100), // Amount in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            };

            const razorpayOrder = await razorpay.orders.create(options);

            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentResult: {
                    id: razorpayOrder.id,
                    status: razorpayOrder.status,
                    update_time: new Date().toISOString(),
                    email_address: req.user.email
                }
            });

            const createdOrder = await order.save();

            // Decrement stock
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock -= item.qty;
                    await product.save();
                }
            }

            // Send Order Confirmation Email
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: `Order Confirmed - #${createdOrder._id}`,
                    message: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h1 style="color: #800000;">Order Confirmed!</h1>
                            <p>Namaste <strong>${req.user.name}</strong>,</p>
                            <p>Your order has been successfully placed.</p>
                            <p><strong>Order ID:</strong> ${createdOrder._id}</p>
                            <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                            <br>
                            <h3>Items:</h3>
                            <ul>
                                ${orderItems.map(item => `<li>${item.name} x ${item.qty}</li>`).join('')}
                            </ul>
                            <br>
                            <p>You can track your order status in your profile.</p>
                            <p>With Gratitude,</p>
                            <p><strong>Bhole Guru Team</strong></p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Failed to send order email:", emailError);
            }

            res.status(201).json({
                order: createdOrder,
                razorpayOrderId: razorpayOrder.id,
                amount: options.amount,
                currency: options.currency,
                key: process.env.RAZORPAY_KEY_ID
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findById(orderId);

            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'paid',
                    update_time: new Date().toISOString(),
                    email_address: req.user.email
                };

                const updatedOrder = await order.save();
                res.json(updatedOrder);
            } else {
                res.status(404);
                throw new Error('Order not found');
            }
        } else {
            res.status(400);
            throw new Error('Invalid signature');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
            if (req.body.trackingNumber) {
                order.trackingNumber = req.body.trackingNumber;
            }
            if (req.body.courierName) {
                order.courierName = req.body.courierName;
            }
            if (req.body.driverDetails) {
                order.driverDetails = req.body.driverDetails;
            }
            const updatedOrder = await order.save();

            // Send Status Update Email
            try {
                const user = await User.findById(order.user);
                if (user) {
                    const message = `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h1 style="color: #800000;">Order Status Update</h1>
                            <p>Namaste ${user.name},</p>
                            <p>Your order <strong>#${order._id}</strong> has been updated to: <span style="color: #800000; font-weight: bold;">${order.status}</span>.</p>
                            <p>Track your order here: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track-order" style="color: #800000;">Track Order</a></p>
                            <br>
                            <p>Thank you for choosing Bhole Guru.</p>
                        </div>
                    `;

                    await sendEmail({
                        email: user.email,
                        subject: `Order Update: ${order.status} - Bhole Guru`,
                        message
                    });
                }
            } catch (error) {
                console.error('Error sending status update email:', error);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error('Not authorized to cancel this order');
            }

            if (order.status !== 'Processing') {
                res.status(400);
                throw new Error('Cannot cancel order that is already ' + order.status);
            }

            order.status = 'Cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
