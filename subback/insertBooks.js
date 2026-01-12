// insertBooks.js
const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./models/Books"); // make sure path is correct

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const booksData = [
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    description: "Paul Atreides, a young nobleman, navigates politics and survival on the desert planet Arrakis. He discovers his destiny as a prophesied leader. Epic battles and intrigue shape his journey.",
    publicationYear: 1965,
    ISBN: "9780441013593",
    image: "https://covers.openlibrary.org/b/id/8101356-L.jpg",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    description: "Tara grows up in a strict and abusive household with no formal education. She takes the bold step to educate herself. Her journey is one of courage, resilience, and self-discovery.",
    publicationYear: 2018,
    ISBN: "9780399590504",
    image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Ironflame",
    author: "Taran Matharu",
    genre: "Fantasy",
    description: "Heroes battle in a magical world threatened by war and dark powers. Alliances and betrayals test their courage. Every choice can change the fate of kingdoms.",
    publicationYear: 2023,
    ISBN: "9780000000001",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "It Ends With Us",
    author: "Colleen Hoover",
    genre: "Romance",
    description: "Lily navigates a complex relationship and difficult choices. She learns the strength to break destructive patterns. Love, heartbreak, and hope define her journey.",
    publicationYear: 2016,
    ISBN: "9781501110368",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "ACOTAR",
    author: "Sarah J. Maas",
    genre: "Fantasy",
    description: "Feyre discovers a hidden magical world and powerful enemies. She must navigate alliances and dangers. Her courage will shape her destiny and the fate of others.",
    publicationYear: 2015,
    ISBN: "9781619634442",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help",
    description: "James Clear explains how small changes create remarkable results. He teaches methods to build good habits and break bad ones. This book empowers readers to transform their daily routines.",
    publicationYear: 2018,
    ISBN: "9780735211292",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Coward",
    author: "Travis Thrasher",
    genre: "Thriller",
    description: "A suspenseful story about fear, courage, and choices. Secrets unravel as danger approaches. The protagonist must face inner and outer battles to survive.",
    publicationYear: 2022,
    ISBN: "9780000000002",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Divergent",
    author: "Veronica Roth",
    genre: "Science Fiction",
    description: "In a divided society, Tris must choose her path carefully. Her courage leads to rebellion and self-discovery. Friendships and love are tested along the way.",
    publicationYear: 2011,
    ISBN: "9780062024039",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Romance",
    description: "An aging Hollywood icon recounts her secret life. Love, fame, and scandal shape her journey. Evelyn’s story reveals courage, ambition, and heartbreak.",
    publicationYear: 2017,
    ISBN: "9781982145218",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  },
  {
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    genre: "Fantasy",
    description: "A kingdom faces danger from mystical creatures. Warriors train to defend and lead. Each character discovers strength and destiny through trials.",
    publicationYear: 2023,
    ISBN: "9780000000003",
    image: "https://via.placeholder.com/150",
    status: "available",
    likedBy: [],
    rentedBy: null
  }
  // Add more books here following the same structure...
];

async function insertBooks() {
  for (let book of booksData) {
    await Book.updateOne(
      { title: book.title },
      { $set: book },
      { upsert: true }
    );
    console.log(`Inserted/Updated: ${book.title}`);
  }
  console.log("All books added!");
  mongoose.disconnect();
}

insertBooks();