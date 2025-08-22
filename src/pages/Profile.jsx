import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user } = useAuth(); // user info from context
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-10">
        <Navbar/>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center space-y-4">
        {/* Profile Picture */}
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-gray-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name + Email */}
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>

        {/* Extra Info */}
        <div className="w-full mt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>Monthly Income:</strong> {user?.monthlyIncome || "Not set"}
          </p>
          <p>
            <strong>Currency:</strong> {user?.currency || "NGN"}
          </p>
          <p>
            <strong>Financial Goal:</strong> {user?.financialGoal || "Not set"}
          </p>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => navigate("/usersettings")}
          className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
