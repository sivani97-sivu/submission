import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rentals");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <nav className="bg-black/50 backdrop-blur-md fixed w-full z-50 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-emerald-400">
          BookStore
        </Link>

        <div className="hidden md:flex gap-6 items-center text-white font-semibold">
          {user?.role === "user" && (
            <>
              <Link to="/home" className="hover:text-emerald-400">Home</Link>
              <Link to="/books" className="hover:text-emerald-400">Books</Link>
              <Link to="/profile" className="hover:text-emerald-400">Profile</Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="hover:text-emerald-400">Dashboard</Link>
          )}

          {/* Search Bar on the right */}
          <div className="ml-4">
            <div className="bg-[#f8f1e7] border border-[#d6c7b2] rounded-xl shadow-lg px-3 py-1 w-64">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg ml-4"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg ml-4"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
