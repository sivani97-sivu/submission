const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Book = require("../models/Books"); // your Book model
const router = express.Router();

// Middleware to check admin JWT
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.admin = decoded; // store admin info in request
    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------- ADMIN REGISTER -------------------
router.post("/register", async (req, res) => {
  try {
    const { name, place, age, email, education, contactDetails, phone, password } = req.body;

    if (!name || !place || !age || !email || !education || !contactDetails || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      place,
      age,
      email,
      education,
      contactDetails,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ------------------- ADMIN LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Admin not found or invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Admin not found or invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Admin login successful",
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        place: admin.place,
        age: admin.age,
        education: admin.education,
        contactDetails: admin.contactDetails,
        phone: admin.phone,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ------------------- GET ALL USERS -------------------
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ------------------- GET ALL BOOKS -------------------
router.get("/books", verifyAdmin, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ------------------- DELETE USER -------------------
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ------------------- DELETE BOOK -------------------
router.delete("/books/:id", verifyAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});
// ------------------- BLOCK / UNBLOCK USER -------------------
router.patch("/users/:id/block", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked; // toggle
    await user.save();

    res.json({ message: "User block status updated", blocked: user.blocked });
  } catch (err) {
    console.error("BLOCK USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;