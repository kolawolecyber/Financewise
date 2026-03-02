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
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
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
      setMessage("Account created successfully!");
      setTimeout(() => navigate("/login"), 500);
    } else {
      setMessage(result.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 transition-colors duration-500">
      
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-premium p-8 fade-in">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Create Your Account
          </h1>
          <p className="text-textSecondary text-sm mt-2">
            Start tracking your finances professionally.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent 
                         focus:ring-2 focus:ring-primary focus:outline-none 
                         transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent 
                         focus:ring-2 focus:ring-primary focus:outline-none 
                         transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent 
                         focus:ring-2 focus:ring-primary focus:outline-none 
                         transition-all duration-200"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              placeholder="Re-enter password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent 
                         focus:ring-2 focus:ring-primary focus:outline-none 
                         transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {errors && (
            <div className="text-sm text-danger bg-red-50 dark:bg-red-900/30 
                            border border-red-200 dark:border-red-700 
                            px-3 py-2 rounded-lg text-center">
              {errors}
            </div>
          )}

          {message && (
            <div className="text-sm text-success bg-green-50 dark:bg-green-900/30 
                            border border-green-200 dark:border-green-700 
                            px-3 py-2 rounded-lg text-center">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold
                       hover:opacity-90 active:scale-[0.98] 
                       transition-all duration-200 shadow-md"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-textSecondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;