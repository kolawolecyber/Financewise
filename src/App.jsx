import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
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

/* ─── Server Wake Screen ───────────────────────────────────────────────── */
function ServerWakeScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() =>
      setDots(d => d.length >= 3 ? '' : d + '.'), 500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-page overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
                        bg-primary-200 opacity-20 blur-[120px] dark:bg-primary-800 dark:opacity-10" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full
                        bg-accent-light opacity-30 blur-[100px]" />
      </div>

      {/* Card */}
      <div className="relative card animate-scale-in px-10 py-12 flex flex-col items-center gap-6
                      max-w-sm w-full mx-4 text-center">

        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center
                        shadow-brand">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-primary tracking-tight">
            Finance Tracker
          </h1>
          <p className="text-sm text-secondary">
            Waking up server{dots}
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-full h-1 rounded-full bg-surface-raised overflow-hidden">
          <div className="h-full rounded-full bg-gradient-primary animate-[shimmer_1.8s_ease-in-out_infinite]
                          bg-[length:200%_100%]" style={{ width: '60%' }} />
        </div>

        <p className="text-xs text-muted">
          This may take up to 30 seconds on first load
        </p>
      </div>
    </div>
  );
}

/* ─── App ──────────────────────────────────────────────────────────────── */
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

  if (loading) return <ServerWakeScreen />;

  return (
    <AuthProvider>
      <Router>
        <GlobalLoader loading={loading} />
        <Routes>
          <Route path="/"               element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/goals"          element={<AppLayout><Goals /></AppLayout>} />
          <Route path="/goal-dashboard" element={<AppLayout><GoalDashboard /></AppLayout>} />
          <Route path="/category"       element={<AppLayout><Category /></AppLayout>} />
          <Route path="/transactions"   element={<AppLayout><Transaction /></AppLayout>} />
          <Route path="/profile"        element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/usersettings"   element={<AppLayout><UserSettings /></AppLayout>} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;