const Order = require('../models/Order');
const User = require('../models/User');
const sendPushNotification = require('../utils/pushNotifications');

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getChefOrders = async (req, res) => {
  try {
    const orders = await Order.find({ chef: req.params.chefId })
      .populate('customer', 'full_name push_token')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.userId })
      .populate('chef')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('chef customer');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('customer');

    if (order && order.customer && order.customer.push_token) {
      const statusMessages = {
        preparing: "Chef is now cooking your fresh meal!",
        ready: "Your order is ready and out for delivery!",
        delivered: "Enjoy your homemade meal! It has been delivered.",
        cancelled: "Sorry, your order was cancelled by the kitchen."
      };

      const message = statusMessages[req.body.status] || `Your order is now ${req.body.status}`;
      
      await sendPushNotification(
        order.customer.push_token,
        "Order Update",
        message,
        { orderId: order._id }
      );
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};