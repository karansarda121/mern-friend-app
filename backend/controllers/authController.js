const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, password, interests } = req.body;

    // Ensure username and password are not empty
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      interests: interests || [],  // Default to an empty array if no interests are provided
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;
     console.log(req.body); // Log the incoming request to check the data
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
      },token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
