const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true },
  role: { type: String, enum: ['customer', 'chef', 'admin'], default: 'customer' },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  push_token: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);