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

  // Get category count by type
  const expenseCount = categories.filter(c => c.type === 'expense').length;
  const incomeCount = categories.filter(c => c.type === 'income').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1A] via-[#1a0f2e] to-[#0F0A1A] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Categories
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Organize your finances with custom categories 🏷️
              </p>
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">
                {expenseCount} Expense {expenseCount !== 1 ? 'Categories' : 'Category'}
              </span>
            </div>
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">
                {incomeCount} Income {incomeCount !== 1 ? 'Categories' : 'Category'}
              </span>
            </div>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Create Category</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Name Input */}
              <div className="lg:col-span-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span>📝</span>
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Transportation"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Type Select */}
              <div className="lg:col-span-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span>🔖</span>
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="expense" className="bg-gray-800">💸 Expense</option>
                  <option value="income" className="bg-gray-800">💰 Income</option>
                </select>
              </div>

              {/* Color Picker */}
              <div className="lg:col-span-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <span>🎨</span>
                  Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:scale-105 transition-transform duration-300"
                  />
                  <div 
                    className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg"
                    style={{ backgroundColor: form.color }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Category
              </span>
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Categories</h2>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold">
              {categories.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 text-lg animate-pulse">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No categories yet</h3>
              <p className="text-gray-500">Create your first category to start organizing expenses</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Color stripe */}
                  <div 
                    className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                    style={{ backgroundColor: cat.color || "#6366f1" }}
                  ></div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Color indicator */}
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: cat.color || "#6366f1" }}
                        ></div>
                        <div 
                          className="absolute inset-0 rounded-xl blur-md opacity-50"
                          style={{ backgroundColor: cat.color || "#6366f1" }}
                        ></div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1">{cat.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            cat.type === 'expense' 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {cat.type === 'expense' ? '💸 Expense' : '💰 Income'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-110 active:scale-95"
                      title="Delete category"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;