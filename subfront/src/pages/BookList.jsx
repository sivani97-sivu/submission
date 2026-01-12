import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);

  // ✅ FETCH ALL BOOKS FROM BACKEND
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      className="min-h-screen py-10 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="bg-black/40 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl text-emerald-100 mb-6">All Books</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-lg"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">
                  <h2 className="font-bold text-lg">{book.title}</h2>
                  <p>{book.author}</p>

                  {/* ✅ ONLY VIEW BUTTON */}
                  <Link
                    to={`/books/${book._id}`}
                    className="block mt-3 font-bold text-emerald-700"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookList;
