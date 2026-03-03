import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../assets/financewise.png";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconDashboard = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
         2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0
         011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconSwap = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);
const IconTarget = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
         2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
         m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2
         2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconChart = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
const IconTag = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0
         010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0
         013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconUser = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconSettings = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724
         1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724
         1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724
         1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724
         1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724
         1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724
         1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724
         1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608
         2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconWallet = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10h18M3 6h18M3 14h18M3 18h18" />
  </svg>
);
const IconLogout = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"18px", height:"18px", flexShrink:0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3
         3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconSun = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707
         M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343
         6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconMoon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0
         0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const IconMenu = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"20px", height:"20px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconX = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"20px", height:"20px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ── Nav items config ───────────────────────────────────────────────── */
const NAV_ITEMS = [
  { path: "/",              label: "Dashboard",     Icon: IconDashboard, section: "main"  },
  { path: "/transactions",  label: "Transactions",  Icon: IconSwap,      section: "main"  },
  { path: "/goals",         label: "Goals",         Icon: IconTarget,    section: "main"  },
  { path: "/goal-dashboard",label: "Goal Overview", Icon: IconChart,     section: "main"  },
  { path: "/category",      label: "Categories",    Icon: IconTag,       section: "main"  },
  { path: "/budgets",       label: "Budgets",       Icon: IconWallet,    section: "main"  },
  { path: "/profile",       label: "Profile",       Icon: IconUser,      section: "account"},
  { path: "/usersettings",  label: "Settings",      Icon: IconSettings,  section: "account"},
];

/* ══════════════════════════════════════════════════════════════════════
   APP LAYOUT
══════════════════════════════════════════════════════════════════════ */
export default function AppLayout({ children }) {
  const location              = useLocation();
  const navigate              = useNavigate();
  const { token, logout }     = useAuth();

  const [collapsed,   setCollapsed]   = useState(false);
  const [darkMode,    setDarkMode]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  /* ── Theme init ──────────────────────────────────────────────────── */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  /* close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  /* pretty-print the current page name for topbar */
  const pageName = (() => {
    const match = NAV_ITEMS.find(n => isActive(n.path));
    return match?.label ?? "Dashboard";
  })();

  /* ── Shared nav link renderer ───────────────────────────────────── */
  const NavLink = ({ path, label, Icon, mini }) => {
    const active = isActive(path);
    return (
      <Link to={path}
        style={{
          display: "flex",
          alignItems: "center",
          gap: mini ? "0" : "12px",
          justifyContent: mini ? "center" : "flex-start",
          padding: mini ? "10px" : "10px 12px",
          borderRadius: "12px",
          textDecoration: "none",
          fontSize: "0.8125rem",
          fontWeight: 600,
          background: active ? "rgba(99,102,241,0.12)" : "transparent",
          color: active
            ? "#6366f1"
            : "var(--text-secondary,#64748b)",
          boxShadow: active
            ? "inset 0 0 0 1px rgba(99,102,241,0.20)" : "none",
          transition: "background 0.18s ease, color 0.18s ease, transform 0.18s ease",
          position: "relative",
        }}
        className="al-nav-link"
        title={mini ? label : undefined}>

        {/* Active indicator bar */}
        {active && !mini && (
          <div style={{
            position: "absolute", left: 0, top: "20%",
            width: "3px", height: "60%",
            borderRadius: "0 3px 3px 0",
            background: "#6366f1",
          }} />
        )}

        <div style={{
          width: mini ? "auto" : "28px",
          height: mini ? "auto" : "28px",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          background: active
            ? "rgba(99,102,241,0.15)"
            : "transparent",
          transition: "background 0.18s ease",
        }}>
          <Icon />
        </div>

        {!mini && <span style={{ flex: 1 }}>{label}</span>}
      </Link>
    );
  };

  /* ── Section label ──────────────────────────────────────────────── */
  const SectionLabel = ({ label, mini }) => mini ? (
    <div style={{
      height:"1px", background:"var(--border,#e2e8f0)",
      margin:"8px 12px",
    }} />
  ) : (
    <p style={{
      fontSize:"0.65rem", fontWeight:700,
      textTransform:"uppercase", letterSpacing:"0.08em",
      color:"var(--text-muted,#94a3b8)",
      padding:"0 12px", margin:"16px 0 4px",
    }}>
      {label}
    </p>
  );

  /* ── Sidebar content (shared between desktop + mobile) ─────────── */
  const SidebarContent = ({ mini = false }) => (
    <div style={{
      display:"flex", flexDirection:"column", height:"100%",
    }}>

      {/* Logo */}
      <div style={{
        display:"flex", alignItems:"center",
        gap:"10px", padding: mini ? "20px 0 20px" : "20px 16px 20px",
        justifyContent: mini ? "center" : "flex-start",
        borderBottom: "1px solid var(--border,#e2e8f0)",
        marginBottom: "8px",
      }}>
        <div style={{
          width:"32px", height:"32px", borderRadius:"10px",
          overflow:"hidden", flexShrink:0,
          boxShadow:"0 2px 8px rgba(99,102,241,0.28)",
          border:"1.5px solid rgba(99,102,241,0.20)",
        }}>
          <img src={logo} alt="Logo"
               style={{ width:"5%", height:"5%", objectFit:"cover" }} />
        </div>
        {!mini && (
          <span style={{
            fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
            FinanceWise
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"0 8px" }}>
        <SectionLabel label="Main" mini={mini} />
        <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
          {NAV_ITEMS.filter(n => n.section === "main").map(n => (
            <NavLink key={n.path} {...n} mini={mini} />
          ))}
        </div>

        <SectionLabel label="Account" mini={mini} />
        <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
          {NAV_ITEMS.filter(n => n.section === "account").map(n => (
            <NavLink key={n.path} {...n} mini={mini} />
          ))}
        </div>
      </nav>

      {/* Bottom actions */}
      <div style={{
        padding: mini ? "12px 8px" : "12px 16px",
        borderTop:"1px solid var(--border,#e2e8f0)",
        display:"flex", flexDirection:"column", gap:"6px",
      }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="al-nav-link"
          style={{
            display:"flex", alignItems:"center",
            gap: mini ? "0" : "10px",
            justifyContent: mini ? "center" : "flex-start",
            padding: mini ? "10px" : "10px 12px",
            borderRadius:"12px",
            fontSize:"0.8rem", fontWeight:600,
            color:"var(--text-secondary,#64748b)",
            background:"transparent", border:"none", cursor:"pointer",
            width:"100%",
            transition:"background 0.18s ease, color 0.18s ease",
          }}>
          {darkMode ? <IconSun /> : <IconMoon />}
          {!mini && (
            <span>{darkMode ? "Light mode" : "Dark mode"}</span>
          )}
        </button>

        {/* Logout */}
        {token && (
          <button onClick={handleLogout}
            className="al-logout-btn"
            style={{
              display:"flex", alignItems:"center",
              gap: mini ? "0" : "10px",
              justifyContent: mini ? "center" : "flex-start",
              padding: mini ? "10px" : "10px 12px",
              borderRadius:"12px",
              fontSize:"0.8rem", fontWeight:600,
              color:"#dc2626",
              background:"rgba(239,68,68,0.06)",
              border:"none", cursor:"pointer",
              width:"100%",
              transition:"background 0.18s ease",
            }}>
            <IconLogout />
            {!mini && <span>Logout</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes al-slide-in {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0);     }
        }
        @keyframes al-fade-in {
          from { opacity:0; }
          to   { opacity:1; }
        }

        .al-nav-link:hover {
          background: rgba(99,102,241,0.07) !important;
          color: #6366f1 !important;
          transform: translateX(2px);
        }
        .al-logout-btn:hover {
          background: rgba(239,68,68,0.12) !important;
        }
        .al-collapse-btn {
          transition: all 0.18s ease;
        }
        .al-collapse-btn:hover {
          background: rgba(99,102,241,0.08) !important;
          color: #6366f1 !important;
        }
        .al-mobile-overlay {
          animation: al-fade-in 0.2s ease both;
        }
        .al-mobile-drawer {
          animation: al-slide-in 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      <div style={{
        display:"flex", minHeight:"100vh",
        background:"var(--bg,#f0f2ff)",
        color:"var(--text-primary,#0f172a)",
      }}>

        {/* ── Desktop sidebar ─────────────────────────── */}
        <aside
          style={{
            width: collapsed ? "72px" : "240px",
            flexShrink: 0,
            background:"var(--surface,#fff)",
            borderRight:"1px solid var(--border,#e2e8f0)",
            boxShadow:"2px 0 12px rgba(99,102,241,0.05)",
            transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)",
            display:"flex", flexDirection:"column",
            position:"sticky", top:0, height:"100vh",
            overflow:"hidden",
          }}
          className="hidden md:flex">

          <SidebarContent mini={collapsed} />
        </aside>

        {/* ── Collapse toggle (desktop) ────────────────── */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="al-collapse-btn hidden md:flex"
          style={{
            position:"fixed",
            top:"50%",
            left: collapsed ? "60px" : "228px",
            transform:"translateY(-50%)",
            zIndex:40,
            width:"20px", height:"32px",
            borderRadius:"0 8px 8px 0",
            background:"var(--surface,#fff)",
            border:"1px solid var(--border,#e2e8f0)",
            borderLeft:"none",
            alignItems:"center", justifyContent:"center",
            cursor:"pointer",
            color:"var(--text-muted,#94a3b8)",
            boxShadow:"2px 0 8px rgba(99,102,241,0.08)",
            transition:"left 0.3s cubic-bezier(0.16,1,0.3,1), background 0.18s ease",
          }}>
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>

        {/* ── Mobile overlay ──────────────────────────── */}
        {mobileOpen && (
          <div className="al-mobile-overlay md:hidden"
            onClick={() => setMobileOpen(false)}
            style={{
              position:"fixed", inset:0, zIndex:40,
              background:"rgba(0,0,0,0.40)",
              backdropFilter:"blur(4px)",
            }} />
        )}

        {/* ── Mobile drawer ───────────────────────────── */}
        {mobileOpen && (
          <div className="al-mobile-drawer md:hidden"
            style={{
              position:"fixed", top:0, left:0, bottom:0,
              width:"272px", zIndex:50,
              background:"var(--surface,#fff)",
              borderRight:"1px solid var(--border,#e2e8f0)",
              boxShadow:"4px 0 24px rgba(99,102,241,0.12)",
              overflowY:"auto",
            }}>
            <SidebarContent mini={false} />
          </div>
        )}

        {/* ── Main content ────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column",
                      minWidth:0, overflow:"hidden" }}>

          {/* Topbar */}
          <header style={{
            height:"60px",
            background:"rgba(255,255,255,0.88)",
            backdropFilter:"blur(16px)",
            WebkitBackdropFilter:"blur(16px)",
            borderBottom:"1px solid var(--border,#e2e8f0)",
            display:"flex", alignItems:"center",
            justifyContent:"space-between",
            padding:"0 20px",
            position:"sticky", top:0, zIndex:30,
            boxShadow:"0 1px 8px rgba(99,102,241,0.06)",
            gap:"12px",
          }}>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="al-collapse-btn md:hidden"
              style={{
                width:"36px", height:"36px", borderRadius:"10px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"var(--surface-raised,#f8fafc)",
                border:"1px solid var(--border,#e2e8f0)",
                cursor:"pointer", flexShrink:0,
                color:"var(--text-secondary,#64748b)",
              }}>
              {mobileOpen ? <IconX /> : <IconMenu />}
            </button>

            {/* Page title */}
            <div style={{ flex:1 }}>
              <h2 style={{
                fontSize:"0.9375rem", fontWeight:700, margin:0,
                color:"var(--text-primary,#0f172a)",
                letterSpacing:"-0.01em",
              }}>
                {pageName}
              </h2>
              <p style={{
                fontSize:"0.7rem", margin:0,
                color:"var(--text-muted,#94a3b8)",
              }}>
                {new Date().toLocaleDateString("en-GB", {
                  weekday:"long", day:"numeric",
                  month:"long", year:"numeric",
                })}
              </p>
            </div>

            {/* Right actions */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>

              {/* Theme toggle (topbar, mobile) */}
              <button onClick={toggleTheme}
                className="al-collapse-btn"
                style={{
                  width:"36px", height:"36px", borderRadius:"10px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:"var(--surface-raised,#f8fafc)",
                  border:"1px solid var(--border,#e2e8f0)",
                  cursor:"pointer",
                  color:"var(--text-secondary,#64748b)",
                }}>
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>

              {/* Profile avatar */}
              <Link to="/profile"
                style={{
                  width:"36px", height:"36px", borderRadius:"10px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow:"0 2px 8px rgba(99,102,241,0.30)",
                  flexShrink:0, textDecoration:"none",
                }}>
                <IconUser />
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main style={{
            flex:1, padding:"24px 20px",
            overflowY:"auto",
          }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}