import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
    <nav className="flex gap-8 p-4 bg-gray-100">
      <Link className="hover:underline" to="/goals">Manage Goals</Link>
      <Link className="hover:underline" to="/goal-dashboard">Goal Overview</Link>
      <Link className="hover:underline" to="/category">Category</Link>
      <Link className="hover:underline" to="/transaction">Transactions</Link>
      <Link className="hover:underline" to="/profile">Profile</Link>

      {token && (
        <button onClick={handleLogout} style={{ marginLeft: "1rem", color: "red" }}>
          Logout
        </button>
      )}
      </nav>
    </>
  );
};

export default Navbar;
