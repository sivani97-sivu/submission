const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  education: { type: String, required: true },
  contactDetails: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  blocked: { type: Boolean, default: false },

  likedBooks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ],

  // 🔥 FIXED: store rented books dynamically instead of count
  rentedBooks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
  ]
});

module.exports = mongoose.model("User", userSchema);
