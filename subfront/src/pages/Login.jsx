import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const loggedInUser = JSON.parse(stored);
      setUser(loggedInUser);
      if (loggedInUser.role === "admin") navigate("/admin/dashboard");
      else navigate("/home");
    }
  }, [navigate, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const { user, token } = res.data;

      if (!user || !token) {
        setError("Invalid server response");
        return;
      }

      // ⭐ ADDED: save token separately
      localStorage.setItem("token", token);

      // existing code (unchanged)
      const userData = { ...user, token };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      window.dispatchEvent(new Event("authChanged"));

      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="bg-black/40 absolute inset-0"></div>
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-3 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};




export default Login;