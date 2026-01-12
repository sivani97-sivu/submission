import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const SaveIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );

  const initialUser = {
    name: "",
    place: "",
    age: "",
    email: "",
    education: "",
    contactDetails: "",
    phone: "",
    booksRented: 0,
    rentedBooks: []
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          ...initialUser,
          ...res.data,
          booksRented: res.data.booksRented || 0,
          rentedBooks: res.data.rentedBooks || []
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser({
        ...initialUser,
        ...res.data,
        booksRented: res.data.booksRented || 0,
        rentedBooks: res.data.rentedBooks || []
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", type: "text", key: "name", placeholder: "John Doe" },
    { label: "Location", type: "text", key: "place", placeholder: "New York, USA" },
    { label: "Age", type: "number", key: "age", placeholder: "28" },
    { label: "Email", type: "email", key: "email", placeholder: "john@example.com", disabled: true },
    { label: "Education", type: "text", key: "education", placeholder: "Bachelor's Degree" },
    { label: "Contact Details", type: "text", key: "contactDetails", placeholder: "Additional contact info" },
    { label: "Phone Number", type: "tel", key: "phone", placeholder: "+91 9876543210" },
  ];

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* 🔹 Very subtle background blur */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>

      {/* 🔹 Profile Card (no blur change) */}
      <div className="relative z-10 w-full max-w-4xl bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          User Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block mb-1 text-sm font-semibold text-white">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={user[field.key] || ""}
                onChange={(e) =>
                  setUser({ ...user, [field.key]: e.target.value })
                }
                disabled={field.disabled || !isEditing}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  !isEditing
                    ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                    : "bg-white"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Rented Books */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-3">
            Rented Books
          </h3>

          {user.rentedBooks.length === 0 ? (
            <p className="text-white/80 italic">
              No books rented yet.
            </p>
          ) : (
            <div className="bg-white/20 rounded-lg p-4">
              <ul className="list-disc ml-5 space-y-1 text-white">
                {user.rentedBooks.map((book, index) => (
                  <li key={index}>{book.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-10">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              <SaveIcon />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
