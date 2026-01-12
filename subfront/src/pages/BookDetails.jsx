import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rentalDuration, setRentalDuration] = useState(7);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // Fetch book details
  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`, config);
      // Load comments from localStorage
      const localComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
      setBook({ ...res.data, comments: [...(res.data.comments || []), ...localComments] });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (!book) return <div className="text-center mt-10 text-white">Loading...</div>;

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const isLiked = book.likedBy?.includes(userId);
  const userRental = book.rentedBy === userId;
  const isUnavailable = book.status === "rented";

  // Toggle like
  const handleLike = async () => {
    if (!token) return alert("Login to like");
    try {
      await axios.put(`http://localhost:5000/api/books/like/${book._id}`, {}, config);
      fetchBook();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Rent book
  const handleRent = async () => {
    if (!token) return alert("Login to rent");
    try {
      await axios.post(
        `http://localhost:5000/api/books/rent/${book._id}`,
        { duration: rentalDuration },
        config
      );
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error renting book");
    }
  };

  // Return book
  const handleReturn = async () => {
    if (!token) return alert("Login to return");
    try {
      await axios.post(`http://localhost:5000/api/books/return/${book._id}`, {}, config);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  // ------------------- COMMENTS (LocalStorage) -------------------

  // Add comment
  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      _id: Date.now().toString(),
      userId,
      text: comment,
      date: new Date(),
    };

    // Save in localStorage
    const existing = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    localStorage.setItem(`comments_${id}`, JSON.stringify([...existing, newComment]));

    // Update UI
    setBook(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setComment("");
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    // Remove from localStorage
    const existing = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    localStorage.setItem(
      `comments_${id}`,
      JSON.stringify(existing.filter(c => c._id !== commentId))
    );

    // Update UI
    setBook(prev => ({
      ...prev,
      comments: (prev.comments || []).filter(c => c._id !== commentId),
    }));
  };

  // Share book
  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this book: ${book.title} by ${book.author}`);
    alert("Book link copied!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex justify-center items-center py-12 px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fadeIn">
        <div className="flex flex-col lg:flex-row">
          {/* Book Image */}
          <div className="lg:w-2/5 h-96 lg:h-auto overflow-hidden">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* Book Details */}
          <div className="lg:w-3/5 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-200 mb-2">by {book.author}</p>
            <p className="text-gray-200 mb-4">ISBN: {book.ISBN || "-"}</p>

            {/* Rental Status */}
            <div className="mb-6">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${
                  userRental || isUnavailable
                    ? "bg-red-500/30 border border-red-400"
                    : "bg-emerald-500/30 border border-emerald-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    userRental || isUnavailable ? "bg-red-400" : "bg-emerald-400"
                  }`}
                ></span>
                <span className="font-semibold">
                  {userRental
                    ? `Rented by you`
                    : isUnavailable
                    ? "Currently Unavailable"
                    : "Available for Rent"}
                </span>
              </div>
            </div>

            {/* Rental Duration */}
            {!userRental && !isUnavailable && (
              <div className="mb-6">
                <label className="block text-gray-200 mb-2">Rental Duration</label>
                <div className="flex gap-2">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setRentalDuration(days)}
                      className={`px-4 py-2 rounded-lg ${
                        rentalDuration === days
                          ? "bg-emerald-600 text-white"
                          : "bg-white/20 text-gray-200 hover:bg-white/30"
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                <span>{isLiked ? "❤️" : "🤍"}</span>
                {isLiked ? "Liked" : "Like"}
              </button>

              {userRental && (
                <button
                  onClick={handleReturn}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
                >
                  Return Book
                </button>
              )}

              {!userRental && !isUnavailable && (
                <button
                  onClick={handleRent}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
                >
                  Rent Book ({rentalDuration} days)
                </button>
              )}

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                🔗 Share
              </button>
            </div>

            {/* Comments */}
            <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
              <h4 className="font-semibold mb-2 text-white">Comments</h4>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold transition"
                >
                  Post
                </button>
              </div>
              {(book.comments || []).map((c) => (
                <div
                  key={c._id}
                  className="p-2 bg-white/10 rounded-lg border border-white/20 text-white text-sm flex justify-between items-center"
                >
                  <span>{c.text}</span>
                  {c.userId === userId && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-red-500 hover:text-red-600 ml-2"
                    >
                      delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
