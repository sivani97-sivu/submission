const express = require("express");
const router = express.Router();
const Book = require("../models/Books");
const User = require("../models/User");
const Rental = require("../models/Rental");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const mongoose = require("mongoose");

// ------------------- CREATE BOOK (Admin) -------------------
router.post("/", auth, admin, async (req, res) => {
  try {
    const { title, author, publicationYear, genre, ISBN, image } = req.body;

    const existing = await Book.findOne({ ISBN });
    if (existing) return res.status(400).json({ message: "Book already exists" });

    const book = new Book({
      title,
      author,
      publicationYear,
      genre,
      ISBN,
      image,
      status: "available",
      likedBy: [],
      comments: [],
    });

    await book.save();
    res.status(201).json({ message: "Book added", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- GET ALL BOOKS -------------------
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- GET SINGLE BOOK -------------------
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPDATE BOOK (Admin) -------------------
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- DELETE BOOK (Admin) -------------------
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await Rental.deleteMany({ bookId: book._id });
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- RENT BOOK -------------------
router.post("/rent/:id", auth, async (req, res) => {
  try {
    const { duration } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === "rented") return res.status(400).json({ message: "Book already rented" });

    // Update book
    book.status = "rented";
    book.rentedBy = req.user._id;
    await book.save();

    // Add book to user's rented list (fix)
    const user = await User.findById(req.user._id);
    if (!user.rentedBooks) user.rentedBooks = [];
    user.rentedBooks.push(book._id);
    await user.save();

    // Create rental record
    const rental = new Rental({
      bookId: book._id,
      userId: req.user._id,
      duration: duration || 7,
      dateRented: new Date(),
      status: "rented",
    });
    await rental.save();

    res.json({ message: "Book rented successfully", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- RETURN BOOK -------------------
router.post("/return/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === "available") return res.status(400).json({ message: "Book is not rented" });

    if (book.rentedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot return this book" });
    }

    // Update book
    book.status = "available";
    book.rentedBy = null;
    await book.save();

    // Remove from user's rented list (fix)
    const user = await User.findById(req.user._id);
    if (user.rentedBooks) {
      user.rentedBooks = user.rentedBooks.filter(
        (id) => id.toString() !== book._id.toString()
      );
      await user.save();
    }

    // Update rental record
    const rental = await Rental.findOne({
      bookId: book._id,
      userId: req.user._id,
      status: "rented",
    });

    if (rental) {
      rental.status = "returned";
      rental.returnDate = new Date();
      await rental.save();
    }

    res.json({ message: "Book returned successfully", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- TOGGLE LIKE -------------------
router.put("/like/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user._id.toString();
    if (!book.likedBy) book.likedBy = [];

    if (book.likedBy.includes(userId)) {
      book.likedBy = book.likedBy.filter((id) => id.toString() !== userId);
    } else {
      book.likedBy.push(userId);
    }

    await book.save();
    res.json({ message: "Like toggled", likedBy: book.likedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- ADD COMMENT -------------------
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      userId: req.user._id,
      text,
      date: new Date(),
    };

    book.comments = book.comments || [];
    book.comments.push(comment);
    await book.save();

    res.json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- DELETE COMMENT -------------------
router.delete("/comment/:id/:commentId", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const comment = book.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot delete this comment" });
    }

    book.comments = book.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    await book.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- GET USER RENTED BOOKS (NEW) -------------------
router.get("/my/rented", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("rentedBooks");
    res.json(user.rentedBooks || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
