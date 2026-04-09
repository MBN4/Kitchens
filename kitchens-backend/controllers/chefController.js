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

exports.addFoodItem = async (req, res) => {
  try {
    const { chef, name, description, price, image_url, category } = req.body;
    const newItem = new FoodItem({ chef, name, description, price, image_url, category });
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