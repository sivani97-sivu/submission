const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },

    // ✅ FIX: NOT required
    publicationYear: { type: Number },

    genre: { type: String },
    ISBN: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },

    rentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    image: { type: String, default: "" },

    // ✅ FIX: Proper comments support
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
