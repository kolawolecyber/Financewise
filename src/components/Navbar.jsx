import React, { useState, createContext, useContext } from "react";
import { Menu, X, Home, Target, PieChart, Tag, CreditCard, User, LogOut } from "lucide-react";

// --- MOCK AUTH CONTEXT (Internalized to fix resolution error) ---
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("mock-token");
  const logout = () => {
    console.log("Logging out...");
    setToken(null);
  };
  return (
    <AuthContext.Provider value={{ token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- NAVIGATION COMPONENT ---
const NavbarContent = () => {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mocking location and navigate for the single-file environment
  const [currentPath, setCurrentPath] = useState("/");

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Manage Goals", path: "/goals", icon: <Target size={18} /> },
    { name: "Goal Overview", path: "/goal-dashboard", icon: <PieChart size={18} /> },
    { name: "Category", path: "/category", icon: <Tag size={18} /> },
    { name: "Transactions", path: "/transactions", icon: <CreditCard size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const isActive = (path) => currentPath === path;

  // Inline SVG Logo to replace external file
  const LogoIcon = () => (
    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 group transition-transform hover:scale-105 cursor-pointer" 
          onClick={() => setCurrentPath("/")}
        >
          <LogoIcon />
          <span className="font-black text-xl tracking-tight text-gray-900">
            Finance<span className="text-indigo-600">wise</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-1 items-center">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                setCurrentPath(link.path);
                setIsOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                isActive(link.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${
                  isActive(link.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setCurrentPath(link.path);
                  setIsOpen(false);
                }}
              >
                <span className={isActive(link.path) ? "text-indigo-600" : "text-gray-400"}>
                  {link.icon}
                </span>
                {link.name}
              </button>
            ))}

            {token && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 mt-2 transition-all text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Main App component to provide the AuthContext
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <NavbarContent />
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-black text-gray-900">Dashboard Content</h1>
            <p className="text-gray-500 font-medium">Navbar is now fixed and functional.</p>
        </div>
      </div>
    </AuthProvider>
  );
}