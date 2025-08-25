import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Category = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "expense", color: "" });
const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false); // 👈 stop loading
    }
    
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/categories", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", type: "expense", color: "" });
      fetchCategories();
    } catch (err) {
      console.error("Error creating category", err);
    }
  };
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
    <div className="max-w-xl mx-auto p-6">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="color"
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>

     <ul className="space-y-2">
      {loading ? ( // 👈 show loading instead of "No categories"
          <p className="text-gray-500 text-sm"> 📊Fetching categories...</p>
        ) :
  categories.length === 0 ? (
    <p className="text-gray-500 text-sm">No categories yet.</p>
  ) : (
    categories.map((cat) => (
      <li
        key={cat.id}
        className="p-3 border rounded flex justify-between items-center"
      >
        <div>
          <span
            className="inline-block w-4 h-4 mr-2 rounded-full"
            style={{ backgroundColor: cat.color || "#ccc" }}
          ></span>
          {cat.name} ({cat.type})
        </div>
        <button
          onClick={() => handleDelete(cat.id)}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </li>
    ))
  )}
</ul>
    </div>
  );
};

export default Category;
