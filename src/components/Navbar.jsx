import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/goals", label: "Goals" },
    { to: "/goal-dashboard", label: "Overview" },
    { to: "/category", label: "Categories" },
    { to: "/transactions", label: "Transactions" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo - Glowy & Cute */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>
                  <path d="M10 2v4"/>
                  <path d="M14 2v4"/>
                  <path d="M7 7h4v4H7z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FinanceFlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-xl rounded-full px-2 py-2 shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-5 py-3 rounded-full font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                </Link>
              ))}

              {token && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl bg-white/60 backdrop-blur hover:bg-white/80 transition-all"
            >
              {isOpen ? <X size={28} className="text-purple-600" /> : <Menu size={28} className="text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide In */}
        <div className={`fixed inset-x-0 top-20 md:hidden transition-all duration-500 ease-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
          <div className="mx-4 mt-4 backdrop-blur-2xl bg-white/90 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-4 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}

              {token && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Optional: Add padding to body so content isn't hidden under navbar */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default Navbar;