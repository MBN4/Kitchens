const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');
const FoodItem = require('../models/FoodItem');

router.get('/active', async (req, res) => {
  try {
    const chefs = await Chef.find({ status: 'active' }).populate('user', 'name email');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food', async (req, res) => {
  try {
    const newItem = new FoodItem(req.body);
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

module.exports = router;