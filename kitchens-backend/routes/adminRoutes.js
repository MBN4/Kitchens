const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');

router.get('/pending-chefs', async (req, res) => {
  try {
    const pending = await Chef.find({ status: 'pending' }).populate('user');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/verify-chef/:id', async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(chef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;