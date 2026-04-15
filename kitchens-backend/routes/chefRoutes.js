const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');
const FoodItem = require('../models/FoodItem');
const upload = require('../middleware/upload');

router.get('/active', async (req, res) => {
  try {
    const chefs = await Chef.find({ status: 'active' }).populate('user', 'name email');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food', upload.single('image'), async (req, res) => {
  try {
    const foodData = {
      ...req.body,
      image_url: req.file ? req.file.path : 'https://via.placeholder.com/150'
    };
    const newItem = new FoodItem(foodData);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/menu/:chefId', async (req, res) => {
  try {
    const items = await FoodItem.find({ chef: req.params.chefId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/food/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image_url = req.file.path;
    }
    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/food/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Dish deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;