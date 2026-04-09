const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kitchenName: { type: String, required: true },
  description: String,
  bannerImage: String,
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  rating: { type: Number, default: 5.0 }
});

module.exports = mongoose.model('Chef', ChefSchema);