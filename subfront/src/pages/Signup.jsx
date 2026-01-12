import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the terms and conditions!");
      return;
    }

    try {
      // Register user
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        place,
        age,
        email,
        education,
        contactDetails,
        phone,
        password,
      });

      const { token } = res.data;

      // Save token
      localStorage.setItem("token", token);

      // Fetch user profile after registration
      const profile = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(profile.data));

      // Trigger auth change event
      window.dispatchEvent(new Event("authChanged"));

      alert("Signup successful! Redirecting to home...");

      // Redirect to home
      navigate("/home");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 flex justify-center items-center w-full h-full px-4">
        <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
          <h1 className="text-4xl font-extrabold text-center text-white mb-2">
            📚 Book Haven
          </h1>
          <p className="text-center text-gray-300 mb-6">
            Create your library account
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="text"
              placeholder="Education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="text"
              placeholder="Contact Details"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              className="inputStyle"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="inputStyle"
              required
            />

            <label className="flex items-start gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 accent-emerald-500"
                required
              />
              <span>
                I agree to the terms and conditions. If a book is damaged or
                not returned, a fine will be charged.
              </span>
            </label>

            <button
              type="submit"
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1"
            >
              Create Account
            </button>
          </form>

          <p className="text-gray-300 mt-5 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .inputStyle {
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
        }
        .inputStyle::placeholder { color: #cbd5e1; }
        .inputStyle:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.5); }
      `}</style>
    </div>
  );
};

export default Signup;
