const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  console.log("SIGNUP ATTEMPT:", req.body);
  try {
    const { name, email, password, phone, role, location } = req.body;

    if (!name || !email || !password) {
      console.log("VALIDATION FAILED: Missing fields");
      return res.status(400).json({ message: "Name, Email, and Password are required" });
    }

    let userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log("SIGNUP FAILED: User exists", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      location
    });

    const savedUser = await newUser.save();
    console.log("USER SAVED TO DB:", savedUser._id);

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role } 
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ message: "Database Error", error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("LOGIN ATTEMPT:", req.body.email);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log("LOGIN FAILED: User not found", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("LOGIN FAILED: Wrong password", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("LOGIN SUCCESSFUL:", user.email);

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Server Error during login" });
  }
};