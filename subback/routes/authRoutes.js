const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, place, age, email, education, contactDetails, phone, password, role } = req.body;

    // Validate required fields
    if (!name || !place || !age || !email || !education || !contactDetails || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ageNum = Number(age);
    if (isNaN(ageNum)) return res.status(400).json({ message: "Age must be a number" });

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      place: place.trim(),
      age: ageNum,
      email: email.trim().toLowerCase(),
      education: education.trim(),
      contactDetails: contactDetails.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
  { id: savedUser._id, email: savedUser.email, role: savedUser.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.status(201).json({
  message: `${savedUser.role} registered successfully`,
  token,
  user: {
    _id: savedUser._id,
    name: savedUser.name,
    place: savedUser.place,
    age: savedUser.age,
    email: savedUser.email,
    education: savedUser.education,
    contactDetails: savedUser.contactDetails,
    phone: savedUser.phone,
    role: savedUser.role,
  },
});


  } catch (error) {
    console.error("REGISTER ERROR:", error.stack); // ← prints full stack
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Check if user is blocked
    if (user.blocked) {
      return res.status(403).json({ message: "Your account is blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        place: user.place,
        age: user.age,
        email: user.email,
        education: user.education,
        contactDetails: user.contactDetails,
        phone: user.phone,
        role: user.role,
        blocked: user.blocked, // optional: send status to frontend
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.stack);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;