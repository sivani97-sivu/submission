require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Books");

const books = [
  { title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", publicationYear: 2019, ISBN: "9781250301697", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsZ0dAIs47di2OM0pOVRa5YBPXzgazkEVSTg&s" },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-help", publicationYear: 2018, ISBN: "9780735211292", image: "https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg" },
  { title: "Educated", author: "Tara Westover", genre: "Memoir", publicationYear: 2018, ISBN: "9780399590504", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyLF5XHRmtXxn9V34FRTgYpdSOO6afkme14A&s" },
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", publicationYear: 1965, ISBN: "9780441013593", image: "https://m.media-amazon.com/images/I/81Ua99CURsL.jpg" },
  { title: "It Ends With Us", author: "Colleen Hoover", genre: "Romance", publicationYear: 2016, ISBN: "9781501110368", image: "https://m.media-amazon.com/images/I/817vqET828L._UF1000,1000_QL80_.jpg" },
  { title: "The Housemaid", author: "Freida McFadden", genre: "Thriller", publicationYear: 2022, ISBN: "9781538742566", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqFfiqs3Qvy-ps4QZ5q8wx9rd9YohHOhDovQ&s" },
  { title: "Iron Flame", author: "Rebecca Yarros", genre: "Fantasy", publicationYear: 2023, ISBN: "9781649374172", image: "https://m.media-amazon.com/images/I/91JsmiyAReL.jpg" },
  { title: "Fourth Wing", author: "Rebecca Yarros", genre: "Fantasy", publicationYear: 2023, ISBN: "9781649374042", image: "https://m.media-amazon.com/images/I/81cquiyLW8L._UF1000,1000_QL80_.jpg" },
  { title: "The Ballad of Songbirds and Snakes", author: "Suzanne Collins", genre: "Dystopian", publicationYear: 2020, ISBN: "9781338635171", image: "https://m.media-amazon.com/images/I/61xCJNYdljL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", publicationYear: 2020, ISBN: "9780525559474", image: "https://images-eu.ssl-images-amazon.com/images/I/51MtwwBz-XL._AC_UL210_SR210,210_.jpg" },
  { title: "Lessons in Chemistry", author: "Bonnie Garmus", genre: "Historical Fiction", publicationYear: 2022, ISBN: "9780385547345", image: "https://m.media-amazon.com/images/I/71iXOIpy2oL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Covenant of Water", author: "Abraham Verghese", genre: "Literary Fiction", publicationYear: 2023, ISBN: "9780802162175", image: "https://m.media-amazon.com/images/I/91b7tm523VL._AC_UF1000,1000_QL80_.jpg" },
  { title: "Happy Place", author: "Emily Henry", genre: "Romance", publicationYear: 2023, ISBN: "9780593441275", image: "https://m.media-amazon.com/images/I/71LPMYkB5rL._AC_UF1000,1000_QL80_.jpg" },
  { title: "A Court of Thorns and Roses", author: "Sarah J. Maas", genre: "Fantasy", publicationYear: 2015, ISBN: "9781619634442", image: "https://m.media-amazon.com/images/I/81k3bgJ2EhL.jpg" },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Historical Fiction", publicationYear: 2017, ISBN: "9781501161933", image: "https://m.media-amazon.com/images/I/81LscKUplaL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-help", publicationYear: 2016, ISBN: "9780062457714", image: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg" },
  { title: "The Psychology of Money", author: "Morgan Housel", genre: "Finance", publicationYear: 2020, ISBN: "9780857197689", image: "https://m.media-amazon.com/images/I/71XEsXS5RlL.jpg" },
  { title: "Verity", author: "Colleen Hoover", genre: "Thriller", publicationYear: 2018, ISBN: "9781538724739", image: "https://m.media-amazon.com/images/I/91868k2+gUL.jpg" },
  { title: "The Girl on the Train", author: "Paula Hawkins", genre: "Thriller", publicationYear: 2015, ISBN: "9781594634024", image: "https://m.media-amazon.com/images/I/71vWnStCnEL.jpg" },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophy", publicationYear: 1988, ISBN: "9780062315007", image: "https://m.media-amazon.com/images/I/617lxveUjYL.jpg" },
  { title: "The Hunger Games", author: "Suzanne Collins", genre: "Dystopian", publicationYear: 2008, ISBN: "9780439023481", image: "https://m.media-amazon.com/images/I/61I24wOsn8L._AC_UF1000,1000_QL80_.jpg" },
  { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Mystery", publicationYear: 2018, ISBN: "9780735219106", image: "https://m.media-amazon.com/images/I/81e+mSqZvnL.jpg" },
  { title: "The Fault in Our Stars", author: "John Green", genre: "Young Adult", publicationYear: 2012, ISBN: "9780525478812", image: "https://m.media-amazon.com/images/I/81xcbKh+JNL._UF1000,1000_QL80_.jpg" },
  { title: "Divergent", author: "Veronica Roth", genre: "Sci-fi", publicationYear: 2011, ISBN: "9780062024039", image: "https://m.media-amazon.com/images/I/81-DFVziuwL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The 48 Laws of Power", author: "Robert Greene", genre: "Self-help", publicationYear: 1998, ISBN: "9780140280197", image: "https://m.media-amazon.com/images/I/61J3Uu4jOLL.jpg" }
];

async function seed() {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error("MONGO_URL not found in .env");

    await mongoose.connect(uri);
    console.log("MongoDB connected ✅");

    for (const book of books) {
      const exists = await Book.findOne({ ISBN: book.ISBN });
      if (!exists) {
  await Book.create(book);
  console.log(`Inserted: ${book.title}`);
} else {
  await Book.updateOne(
    { ISBN: book.ISBN },
    { $set: book }
  );
  console.log(`Updated: ${book.title}`);
}

    }

    console.log("Seeding completed ✅");
    process.exit();
  } catch (err) {
    console.error("Seeding error ❌:", err);
    process.exit(1);
  }
}

seed();
