import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Category = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "expense", color: "#6366f1" });
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/categories", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", type: "expense", color: "#6366f1" });
      fetchCategories();
    } catch (err) {
      console.error("Error creating category", err);
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">📂 Manage Categories</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={form.name}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-16 h-12 rounded-lg border border-gray-300 p-1 cursor-pointer"
            />
          </div>

          <button className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition">
            + Create Category
          </button>
        </form>

        {/* Categories List */}
        <ul className="space-y-3">
          {loading ? (
            <p className="text-gray-500 text-center">📊 Fetching categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center">No categories yet.</p>
          ) : (
            categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-center">
                  <span
                    className="inline-block w-5 h-5 mr-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#ccc" }}
                  ></span>
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">{cat.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 font-medium hover:underline"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Category;
