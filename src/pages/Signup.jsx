import { useState } from "react";
import { signup } from "../utils/Api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const { email, password, confirmPassword } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      setLoading(false);
      return;
    }

    const result = await signup(form);
    setLoading(false);

    if (result.token) {
      setMessage("Signup successful!");
      setTimeout(() => navigate("/login"), 500);
    } else {
      setMessage(result.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create Account 🌸
        </h2>

        {/* Name */}
        <label className="text-sm text-gray-600">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
          required
          className="w-full mt-1 mb-3 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />

        {/* Email */}
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          required
          className="w-full mt-1 mb-3 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        {/* Password */}
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter a password"
          onChange={handleChange}
          required
          className="w-full mt-1 mb-3 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />

        {/* Confirm Password */}
        <label className="text-sm text-gray-600">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          onChange={handleChange}
          required
          className="w-full mt-1 mb-4 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-semibold shadow-md hover:scale-105 transition transform"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        {/* Messages */}
        <p className="text-sm text-red-500 mt-3 text-center">{message}</p>
        {errors && (
          <p className="text-sm text-red-500 mt-1 text-center">{errors}</p>
        )}

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
