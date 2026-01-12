const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- Serve static files ----------------
app.use("/public", express.static(path.join(__dirname, "public")));

// ---------------- Routes ----------------
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const adminRoute = require("./routes/adminroute"); // path to adminroute.js
app.use("/api/admin", adminRoute);

const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ---------------- Test route ----------------
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ---------------- Connect to MongoDB ----------------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

// ---------------- Start server ----------------
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});