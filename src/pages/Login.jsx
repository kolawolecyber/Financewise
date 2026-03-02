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
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
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
      setMessage(result.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 transition-colors duration-500">

      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-premium p-8 fade-in">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            FinTrackr
          </h1>
          <p className="text-textSecondary text-sm mt-2">
            Welcome back. Please sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

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
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent 
                         focus:ring-2 focus:ring-primary focus:outline-none 
                         transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {message && (
            <div className="text-sm text-danger bg-red-50 dark:bg-red-900/30 
                            border border-red-200 dark:border-red-700 
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
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-textSecondary">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-textSecondary">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;