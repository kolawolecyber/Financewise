import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // icons
import logo from "../assets/financewise.png"

const Navbar = () => {
  const { token,  logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                          
        {/* Home */}
       <Link className="font-bold text-lg flex items-center gap-2" to="/">
  <img
    src={logo}
    alt="Logo"
    className="nav-logo  rounded-full flex-shrink-0"
  />
  Financewise
</Link>
</div>
</div>

        {/* Desktop links */}
        <div className="flex items-center space-x-6">
                        <div className="hidden md:block text-right">
        <div className="hidden md:flex gap-6 items-center">
          <Link className="hover:underline" to="/">Home</Link>
          <Link className="hover:underline" to="/goals">Manage Goals</Link>
          <Link className="hover:underline" to="/goal-dashboard">Goal Overview</Link>
          <Link className="hover:underline" to="/category">Category</Link>
          <Link className="hover:underline" to="/transactions">Transactions</Link>
          <Link className="hover:underline" to="/profile">Profile</Link>
</div>
          {token && (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
 </div>
                </div>
            
        {/* Hamburger for mobile */}
        <button
          className="block md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col mt-4 gap-4 md:hidden">
          <Link className="hover:underline" to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link className="hover:underline" to="/goals" onClick={() => setIsOpen(false)}>Manage Goals</Link>
          <Link className="hover:underline" to="/goal-dashboard" onClick={() => setIsOpen(false)}>Goal Overview</Link>
          <Link className="hover:underline" to="/category" onClick={() => setIsOpen(false)}>Category</Link>
          <Link className="hover:underline" to="/transactions" onClick={() => setIsOpen(false)}>Transactions</Link>
          <Link className="hover:underline" to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>

          {token && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
