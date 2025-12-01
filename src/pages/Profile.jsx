import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!token) return;

      try {
        const res = await API.get("/api/profile/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, setUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 pt-10 pb-20">
        <div className="bg-white shadow-xl rounded-3xl p-8 text-center border border-gray-100">

          {/* Profile Picture */}
          <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center shadow-inner overflow-hidden mb-4">
            {loading ? (
              <p className="text-gray-500 text-sm">📊 Loading...</p>
            ) : formData?.profilePic ? (
              <img
                src={formData.profilePic}
                alt={formData?.name}
                className="h-50 w-50 object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-gray-600">
                {formData?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          {/* Name + Email */}
          <h2 className="text-2xl font-bold text-gray-800">
            {formData?.name || "User"}
          </h2>
          <p className="text-gray-500 mt-1">{formData?.email}</p>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-200"></div>

          {/* Extra Info */}
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Monthly Income:</span>
              <span className="text-gray-800">{formData?.monthlyIncome || "Not set"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Currency:</span>
              <span className="text-gray-800">{formData?.currency || "NGN"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Financial Goal:</span>
              <span className="text-gray-800">{formData?.financialGoal || "Not set"}</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/usersettings")}
            className="mt-8 w-full py-3 px-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
