import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Goals from './pages/Goals';
import GoalDashboard from "./pages/GoalDashboard";
import Transaction from './pages/Transaction';
import Category from './pages/Category';
import Profile from './pages/Profile';
import UserSettings from './pages/UserSettings';
import { AuthProvider } from './context/AuthContext';
import GlobalLoader from './components/GlobalLoader';
import { useEffect, useState } from "react";
import { pingBackend } from "./utils/PingBackend";

function App() {
  const [serverAwake, setServerAwake] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wakeServer = async () => {
      const ok = await pingBackend();
      setServerAwake(ok);
      setLoading(false);
    };

    wakeServer();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse">
          Waking up server... please wait ⏳
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <GlobalLoader loading={loading} />
        <Routes>
  <Route
    path="/"
    element={
      <AppLayout>
        <Dashboard />
      </AppLayout>
    }
  />
  <Route
    path="/goals"
    element={
      <AppLayout>
        <Goals />
      </AppLayout>
    }
  />
  <Route
    path="/goal-dashboard"
    element={
      <AppLayout>
        <GoalDashboard />
      </AppLayout>
    }
  />
  <Route
    path="/category"
    element={
      <AppLayout>
        <Category />
      </AppLayout>
    }
  />
  <Route
    path="/transactions"
    element={
      <AppLayout>
        <Transaction />
      </AppLayout>
    }
  />
  <Route
    path="/profile"
    element={
      <AppLayout>
        <Profile />
      </AppLayout>
    }
  />
  <Route
    path="/usersettings"
    element={
      <AppLayout>
        <UserSettings />
      </AppLayout>
    }
  />

  {/* Auth pages remain clean */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
