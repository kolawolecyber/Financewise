import { useState } from "react";
import { login } from "../utils/Api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if (result.token) {
      authLogin(result.token);
      localStorage.setItem("token", result.token);
      setMessage("Successful");
      setTimeout(() => navigate("/"), 200);
    } else {
      setMessage(result.message || "Signup Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl border border-gray-100 transform transition-all"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">
          Welcome Back ✨
        </h2>

        {/* Email */}
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          className="w-full mt-1 mb-4 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        {/* Password */}
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className="w-full mt-1 mb-4 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold shadow-md hover:scale-105 transition transform"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Message */}
        <p className="text-sm text-red-500 text-center mt-3">{message}</p>

        {/* Signup link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
