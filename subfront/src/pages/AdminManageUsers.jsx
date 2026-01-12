import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Users ---------------- */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/users`);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  /* ---------------- User Actions ---------------- */
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        await axios.delete(`${BASE_URL}/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const blockUser = async (user) => {
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/users/${user._id}/block`, {
        blocked: !user.blocked,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-900 mb-4">Manage Users</h1>

      {loading && <p className="mb-4 text-gray-700">Loading...</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{user.name}</p>
                <p>Email: {user.email}</p>
                <p>Status: {user.blocked ? "Blocked" : "Active"}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => blockUser(user)}
                  disabled={loading}
                  className={`px-3 py-1 rounded text-white ${
                    user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;   