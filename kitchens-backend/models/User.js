const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true },
  role: { type: String, enum: ['customer', 'chef', 'admin'], default: 'customer' },
  savedAddresses: [{
    label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    address: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    isDefault: { type: Boolean, default: false }
  }],
  push_token: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);