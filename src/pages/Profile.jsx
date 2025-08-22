import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(user || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        setLoading(true);
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
    <div className="flex justify-center mt-10">
      <Navbar />
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center space-y-4">
        {loading ? (
          // Skeleton Loader
          <div className="w-full animate-pulse flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-gray-300"></div>
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="w-full mt-4 space-y-2">
              <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-300 rounded mt-6"></div>
          </div>
        ) : (
          <>
            {/* Profile Picture */}
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData?.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt={formData?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-gray-600">
                  {formData?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name + Email */}
            <h2 className="text-xl font-semibold">{formData?.name}</h2>
            <p className="text-gray-500">{formData?.email}</p>

            {/* Extra Info */}
            <div className="w-full mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Monthly Income:</strong>{" "}
                {formData?.monthlyIncome || "Not set"}
              </p>
              <p>
                <strong>Currency:</strong> {formData?.currency || "NGN"}
              </p>
              <p>
                <strong>Financial Goal:</strong>{" "}
                {formData?.financialGoal || "Not set"}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate("/usersettings")}
              className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
