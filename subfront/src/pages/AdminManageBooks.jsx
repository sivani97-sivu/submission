import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const EMPTY_BOOK = {
  title: "",
  author: "",
  publicationYear: "",
  genre: "",
  ISBN: "",
  image: "",
};

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const AdminManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState(EMPTY_BOOK);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editBook, setEditBook] = useState(EMPTY_BOOK);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await axios.get(`${BASE_URL}/books`, getAuthConfig());
    setBooks(res.data);
  };

  const addBook = async (e) => {
    e.preventDefault();
    await axios.post(`${BASE_URL}/books`, newBook, getAuthConfig());
    setNewBook(EMPTY_BOOK);
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${BASE_URL}/books/${id}`, getAuthConfig());
    fetchBooks();
  };

  const startEditBook = (index) => {
    setEditingIndex(index);
    setEditBook(books[index]);
  };

  const saveEditBook = async () => {
    const book = books[editingIndex];
    await axios.put(
      `${BASE_URL}/books/${book._id}`,
      editBook,
      getAuthConfig()
    );
    setEditingIndex(null);
    fetchBooks();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Books</h1>

      <form onSubmit={addBook} className="mb-6">
        {Object.keys(EMPTY_BOOK).map((field) => (
          <input
            key={field}
            value={newBook[field]}
            onChange={(e) =>
              setNewBook({ ...newBook, [field]: e.target.value })
            }
            placeholder={field.toUpperCase()}
            className="inputBox w-full mb-2"
          />
        ))}
        <button className="btnPrimary w-full">Add Book</button>
      </form>

      {books.map((book, index) => (
        <div key={book._id} className="border p-3 mb-2">
          {editingIndex === index ? (
            <>
              {Object.keys(EMPTY_BOOK).map((field) => (
                <input
                  key={field}
                  value={editBook[field]}
                  onChange={(e) =>
                    setEditBook({ ...editBook, [field]: e.target.value })
                  }
                  className="inputBox w-full mb-1"
                />
              ))}
              <button onClick={saveEditBook} className="btnPrimary mr-2">
                Save
              </button>
            </>
          ) : (
            <>
              <h3>{book.title}</h3>
              <button
                onClick={() => startEditBook(index)}
                className="btnSecondary mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBook(book._id)}
                className="btnDanger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminManageBooks;
