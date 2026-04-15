const Chef = require('../models/Chef');
const User = require('../models/User');
const Order = require('../models/Order');

exports.getPendingChefs = async (req, res) => {
  try {
    const pending = await Chef.find({ status: 'pending' }).populate('user', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyChef = async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(chef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const activeChefs = await Chef.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const orders = await Order.find({ status: 'delivered' });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = await Order.countDocuments();

    res.json({
      activeChefs,
      totalUsers,
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};