const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// GET logged-in user's profile
router.get("/me", auth, async (req, res) => {
  try {
    // req.user is already the FULL user object from middleware
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("likedBooks")
      .populate("rentedBooks"); // ✅ FIX: Populate rented books here

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE logged-in user's profile
router.put("/me", auth, async (req, res) => {
  try {
    const updates = { ...req.body };

    // ❌ Never allow email update
    delete updates.email;
    delete updates.password;
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    )
      .select("-password")
      .populate("likedBooks")
      .populate("rentedBooks"); // ✅ FIX: Also populate here

    res.json(updatedUser);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
