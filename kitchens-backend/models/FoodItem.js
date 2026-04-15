const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  category: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: String,
    default: '20-30 mins'
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', FoodItemSchema);