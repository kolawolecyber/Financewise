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

/* ─── Server Wake Screen ──────────────────────────────────────────── */
function ServerWakeScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() =>
      setDots(d => d.length >= 3 ? '' : d + '.'), 500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes sw-spin { to { transform:rotate(360deg); } }
        @keyframes sw-bar {
          0%  { width:0%;  }
          30% { width:45%; }
          65% { width:72%; }
          85% { width:88%; }
          100%{ width:95%; }
        }
        @keyframes sw-fade-in {
          from { opacity:0; transform:scale(0.94) translateY(12px); }
          to   { opacity:1; transform:scale(1)    translateY(0);     }
        }
        @keyframes sw-dot {
          0%,80%,100% { transform:scale(0); opacity:0.3; }
          40%         { transform:scale(1); opacity:1;   }
        }
        .sw-card   { animation: sw-fade-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .sw-bar    { animation: sw-bar 3s cubic-bezier(0.4,0,0.2,1) both; }
        .sw-spin   { animation: sw-spin 0.9s linear infinite; }
        .sw-dot1   { animation: sw-dot 1.4s ease-in-out 0.0s infinite; }
        .sw-dot2   { animation: sw-dot 1.4s ease-in-out 0.2s infinite; }
        .sw-dot3   { animation: sw-dot 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      <div style={{
        minHeight:"100vh", width:"100%",
        display:"flex", alignItems:"center", justifyContent:"center",
        background:"#f0f2ff", padding:"20px",
        position:"relative", overflow:"hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{
          position:"absolute", top:"-80px", left:"-80px",
          width:"400px", height:"400px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", bottom:"-80px", right:"-80px",
          width:"350px", height:"350px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)",
          pointerEvents:"none",
        }}/>

        {/* Card */}
        <div className="sw-card" style={{
          background:"#fff",
          borderRadius:"24px",
          border:"1px solid rgba(99,102,241,0.14)",
          boxShadow:"0 20px 60px rgba(99,102,241,0.13), 0 4px 16px rgba(0,0,0,0.05)",
          padding:"40px 32px",
          width:"100%", maxWidth:"340px",
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:"0",
          textAlign:"center",
        }}>

          {/* Icon + spinner */}
          <div style={{ position:"relative", width:"64px", height:"64px",
                        marginBottom:"22px", flexShrink:0 }}>
            <svg className="sw-spin" style={{
              position:"absolute", inset:0,
              width:"100%", height:"100%",
            }} viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28"
                stroke="url(#sw-g)" strokeWidth="3"
                strokeLinecap="round" strokeDasharray="120 56" />
              <defs>
                <linearGradient id="sw-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position:"absolute", inset:"8px", borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 14px rgba(99,102,241,0.38)",
            }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.8}
                   style={{ width:"22px", height:"22px" }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3
                     2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12
                     8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1
                     M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 style={{
            fontSize:"1.0625rem", fontWeight:800, margin:"0 0 6px",
            color:"#0f172a", letterSpacing:"-0.02em",
          }}>
            FinanceWise
          </h1>

          <p style={{
            fontSize:"0.8125rem", color:"#64748b",
            margin:"0 0 18px", fontWeight:500,
          }}>
            Waking up server{dots}
          </p>

          {/* Dots */}
          <div style={{ display:"flex", gap:"5px", marginBottom:"20px" }}>
            {["sw-dot1","sw-dot2","sw-dot3"].map(c => (
              <div key={c} className={c} style={{
                width:"7px", height:"7px", borderRadius:"50%",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              }}/>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{
            width:"100%", height:"5px", borderRadius:"9999px",
            background:"#e2e8f0", overflow:"hidden", marginBottom:"14px",
          }}>
            <div className="sw-bar" style={{
              height:"100%", borderRadius:"9999px",
              background:"linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)",
              boxShadow:"0 0 8px rgba(99,102,241,0.40)",
            }}/>
          </div>

          <p style={{ fontSize:"0.72rem", color:"#94a3b8", margin:0 }}>
            This may take up to 30 seconds on first load
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── App ─────────────────────────────────────────────────────────── */
function App() {
  const [serverAwake, setServerAwake] = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    pingBackend().then(ok => {
      setServerAwake(ok);
      setLoading(false);
    });
  }, []);

  if (loading) return <ServerWakeScreen />;

  return (
    <AuthProvider>
      <Router>
        <GlobalLoader />
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