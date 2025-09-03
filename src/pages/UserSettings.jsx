import { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const UserSettings = () => {
  const { token } = useAuth();
  const [previewSource, setPreviewSource] = useState('');
    const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
    const data = new FormData();
    data.append("name", formData.name);
    data.append("monthlyIncome", formData.monthlyIncome);
    data.append("currency", formData.currency);
    data.append("financialGoal", formData.financialGoal);

    if (formData.profilePic && formData.profilePic instanceof File) {
      data.append("profilePic", formData.profilePic); // key must match multer field name
   
    }
    

      await API.put("/api/profile/settings", data, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "multipart/form-data",
      });
      alert("Profile updated successfully!");
navigate("/Profile")
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    }
  };

  const previewFile = (data)=>{
const reader = new FileReader();
reader.readAsDataURL(data);
reader.onloadend=()=>{
  setPreviewSource(reader.result);
}
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">User Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-lg p-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              value={formData.email}
              disabled
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
              className="w-full border rounded-lg p-2"
              value={formData.monthlyIncome || ""}
              onChange={handleChange}
            />
          </div>

          {/* Currency though you will just choose, im yet to make the currency effective in the whole page */}
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              name="currency"
              className="w-full border rounded-lg p-2"
              value={formData.currency}
              onChange={handleChange}
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
              className="w-full border rounded-lg p-2"
              value={formData.financialGoal || ""}
              onChange={handleChange}
            />
          </div>

          {/* Profile Picture, just or name of the picture, will later add storage for files */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture (URL)
            </label>
           <input
    type="file"
    name="profilePic"
    className="w-full border rounded-lg p-2"
    onChange={(e) =>
     { const file= e.target.files[0];
      setFormData({ ...formData, profilePic:file  });
      previewFile(file)
    }}
  />
  
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
        {previewSource &&  (<img
      src={previewSource}
      alt="Profile"
      className="w-10 h-10 rounded-full mt-2 object-cover"
    />
  )}
      </div>
    </div>
  );
};

export default UserSettings;
