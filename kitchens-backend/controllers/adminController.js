const Chef = require('../models/Chef');

exports.getPendingChefs = async (req, res) => {
  try {
    const pending = await Chef.find({ status: 'pending' }).populate('user', 'full_name email');
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