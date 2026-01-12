import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ ADDED IMPORT

const BASE_URL = "http://localhost:5000/api";

const DEFAULT_BOOK_STATE = {
  title: "",
  author: "",
  ISBN: "",
  genre: "",
  publicationYear: "",
  status: "available",
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState(DEFAULT_BOOK_STATE);

  // ✅ Search term for admin search
  const [searchTerm, setSearchTerm] = useState("");

  /* -------------------- Fetch Data -------------------- */
  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return token
      ? { headers: { Authorization: `Bearer ${token.trim()}` } }
      : {};
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, getAxiosConfig());
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      if (err.response?.status === 401) alert("Session expired. Please login again.");
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err.response?.data || err.message);
    }
  };

  /* -------------------- FILTER BOOKS BY SEARCH -------------------- */
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* -------------------- User Actions -------------------- */
  const toggleBlockUser = async (id) => {
    try {
      const user = users.find((u) => u._id === id);
      await axios.patch(
        `${BASE_URL}/admin/users/${id}/block`,
        { blocked: !user.blocked },
        getAxiosConfig()
      );
      fetchUsers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update user status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/users/${id}`, getAxiosConfig());
      fetchUsers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete user");
    }
  };

  /* -------------------- Book Actions -------------------- */
  const toggleRental = async (id) => {
    try {
      const book = books.find((b) => b._id === id);
      if (book.status === "available") {
        await axios.post(`${BASE_URL}/books/rent/${id}`, {}, getAxiosConfig());
      } else {
        await axios.post(`${BASE_URL}/books/return/${id}`, {}, getAxiosConfig());
      }
      fetchBooks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to toggle book status");
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${BASE_URL}/books/${id}`, getAxiosConfig());
      fetchBooks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete book");
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.genre) {
      alert("Title, Author and Genre are required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/books`, newBook, getAxiosConfig());
      setNewBook(DEFAULT_BOOK_STATE);
      fetchBooks();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add book");
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <>
      {/* ✅ NAVBAR ADDED AND LINKED TO SEARCH */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div
        className="min-h-screen bg-cover bg-center bg-fixed p-6 pt-32" // ✅ pt-32 prevents navbar overlap
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
            📚 Admin Dashboard
          </h1>

          {/* ================= USERS ================= */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">👥 Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-400">No users found</p>
            ) : (
              <table className="w-full min-w-full text-left">
                <thead>
                  <tr className="bg-white/20 text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-white/10">
                      <td className="p-3 text-white">{u.name}</td>
                      <td className="p-3 text-white">{u.email}</td>
                      <td className="p-3 text-white">
                        {u.blocked ? "🚫 Blocked" : "✅ Active"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => toggleBlockUser(u._id)}
                          className={`px-3 py-1 rounded ${
                            u.blocked ? "bg-green-600" : "bg-yellow-500"
                          } hover:opacity-90 transition`}
                        >
                          {u.blocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ================= BOOKS (SEARCH APPLIED) ================= */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">📚 Books Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full text-left">
                <thead>
                  <tr className="bg-white/20 text-white">
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">ISBN</th>
                    <th className="p-3">Genre</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((b) => (
                    <tr key={b._id} className="border-b border-white/10">
                      <td className="p-3 text-white">{b.title}</td>
                      <td className="p-3 text-white">{b.author}</td>
                      <td className="p-3 text-white">{b.ISBN || "-"}</td>
                      <td className="p-3 text-white">{b.genre}</td>
                      <td className="p-3 text-white">{b.publicationYear || "-"}</td>
                      <td className="p-3 text-white">
                        {b.status === "rented" ? "📖 Rented" : "📚 Available"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => toggleRental(b._id)}
                          className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-white transition-colors"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => deleteBook(b._id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= ADD BOOK ================= */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">➕ Add New Book</h2>
            <form
              onSubmit={addBook}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <input
                placeholder="Title *"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
                required
              />
              <input
                placeholder="Author *"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
                required
              />
              <input
                placeholder="ISBN"
                value={newBook.ISBN}
                onChange={(e) =>
                  setNewBook({ ...newBook, ISBN: e.target.value })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
              />
              <input
                placeholder="Genre *"
                value={newBook.genre}
                onChange={(e) =>
                  setNewBook({ ...newBook, genre: e.target.value })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
                required
              />
              <input
                placeholder="Image URL"
                value={newBook.image || ""}
                onChange={(e) =>
                  setNewBook({ ...newBook, image: e.target.value })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
              />
              <input
                type="number"
                placeholder="Publication Year"
                value={newBook.publicationYear}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    publicationYear: e.target.value,
                  })
                }
                className="bg-white/20 text-white p-3 rounded placeholder-white/50"
              />

              <button
                type="submit"
                className="lg:col-span-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded transition-colors"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
