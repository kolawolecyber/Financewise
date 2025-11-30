import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // icons
import logo from "../assets/financewise.png"

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 p-4 shadow-md ">
      <div className="flex items-center justify-between ">
        {/* Home */}
        <Link className="font-bold text-lg" to="/">
       <img src={logo} alt="Logo" className="h-2 w-2" />
          FinanceWise
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link className="hover:underline" to="/">Home</Link>
          <Link className="hover:underline" to="/goals">Manage Goals</Link>
          <Link className="hover:underline" to="/goal-dashboard">Goal Overview</Link>
          <Link className="hover:underline" to="/category">Category</Link>
          <Link className="hover:underline" to="/transactions">Transactions</Link>
          <Link className="hover:underline" to="/profile">Profile</Link>

          {token && (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
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
