import { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserSettings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [previewSource, setPreviewSource] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    monthlyIncome: "",
    currency: "NGN",
    financialGoal: "",
    profilePic: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/profile/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("monthlyIncome", formData.monthlyIncome);
      data.append("currency", formData.currency);
      data.append("financialGoal", formData.financialGoal);

      if (formData.profilePic && formData.profilePic instanceof File) {
        data.append("profilePic", formData.profilePic);
      }

      await API.put("/api/profile/settings", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      navigate("/Profile");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            User Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {previewSource ? (
                <img
                  src={previewSource}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover mb-3 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-3xl font-semibold text-gray-400">
                    {formData.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <input
                type="file"
                name="profilePic"
                className="text-sm text-gray-600"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, profilePic: file });
                  previewFile(file);
                }}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Income
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            {/* Financial Goal */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Financial Goal
              </label>
              <input
                type="text"
                name="financialGoal"
                value={formData.financialGoal || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
