const Chef = require('../models/Chef');
const FoodItem = require('../models/FoodItem');

exports.getVerifiedChefs = async (req, res) => {
  try {
    const chefs = await Chef.find({ status: 'active' }).populate('user', 'full_name');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChefProfileByUserId = async (req, res) => {
  try {
    const chef = await Chef.findOne({ user: req.params.userId });
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFoodItem = async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({ chef: req.params.chefId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};