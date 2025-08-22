import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Goals from './pages/Goals';
import GoalDashboard from "./pages/GoalDashboard";
import Transaction from './pages/Transaction';
import Category from './pages/Category';
import Profile from './pages/Profile';
import UserSettings from './pages/UserSettings';



function App() {
 
   return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/goal-dashboard" element={<GoalDashboard />} />
         <Route path="/category" element={<Category/>} />
          <Route path="/transactions" element={<Transaction/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/usersettings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App
