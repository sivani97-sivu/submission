import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar"; // import Navbar

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [books, setBooks] = useState([]);

  // 🔹 Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.isBlocked) {
      alert("Your account is blocked by admin.");
      localStorage.clear();
      navigate("/login");
      return;
    }
    fetchBooks();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-xl">No user logged in</p>
      </div>
    );
  }

  const isRentedByUser = (book) => {
    return book.status === "rented" && book.rentedBy === user._id;
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="relative pt-24">
        {/* HERO */}
        <section className="relative h-96 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome, {user.name}!
            </h1>
            <p className="text-lg text-gray-200">
              Browse our collection of trending books
            </p>
          </div>
        </section>

        {/* BOOKS GRID */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">
            Explore Books
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => {
              const rentedByUser = isRentedByUser(book);

              return (
                <div
                  key={book._id}
                  className="bg-white/90 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden"
                >
                  <div className="h-64 w-full overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-gray-600">{book.author}</p>

                    <p
                      className={`mt-2 font-bold ${
                        book.status === "available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {book.status === "available"
                        ? "Available"
                        : rentedByUser
                        ? "You Rented"
                        : "Rented"}
                    </p>

                    <div className="mt-4">
                      <Link
                        to={`/books/${book._id}`}
                        className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <p className="text-center text-white mt-10 text-lg">
              No books found.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
