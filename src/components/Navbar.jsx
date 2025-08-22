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
    <div className="flex gap-6">
      <Link to="/goals">Manage Goals</Link>
      <Link to="/goal-dashboard">Goal Overview</Link>
      <Link to="/category">Category</Link>
      <Link to="/transaction">Transactions</Link>
      <Link to="/profile">Profile</Link>
</div>
      {token && (
        <button onClick={handleLogout} style={{ marginLeft: "1rem", color: "red" }}>
          Logout
        </button>
      )}
    </>
  );
};

export default Navbar;
