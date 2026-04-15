const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;
    let userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      savedAddresses: location ? [{ label: 'Home', address: location.address, latitude: location.latitude, longitude: location.longitude, isDefault: true }] : []
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { _id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role } });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, push_token } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (push_token) updateData.push_token = push_token;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { label, address } = req.body;
    const user = await User.findById(req.user.id);
    user.savedAddresses.push({ label, address });
    await user.save();
    res.json(user.savedAddresses);
  } catch (err) {
    res.status(500).json({ message: "Address add failed" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAddresses = user.savedAddresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.savedAddresses);
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};