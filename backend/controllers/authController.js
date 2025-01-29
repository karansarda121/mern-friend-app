const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, password,interests } = req.body;
    const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
      const salt = await bcrypt.genSalt(10);  // Generate a salt with 10 rounds
     const hashedPassword = await bcrypt.hash(password, salt);  // 10 is the salt rounds


    const newUser = new User({ username, password:hashedPassword, interests: interests || [] });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful",
      user: {
        id: user._id,
      },token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
