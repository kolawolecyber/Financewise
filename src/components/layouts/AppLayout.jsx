import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AppFooter from "../../components/AppFooter"
import logo from "../../assets/financewise.png";

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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0
         002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2
         2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2
         2 0 01-2-2z" />
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
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010
         2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0
         002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0
         001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
         00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0
         00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0
         00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0
         00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
         001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07
         2.572-1.065z" />
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
         01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconSun = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343
         17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707
         M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconMoon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003
         9.003 0 008.354-5.646z" />
  </svg>
);
const IconMenu = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"20px", height:"20px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconXMark = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2} style={{ width:"20px", height:"20px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconChevronLeft = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2.5} style={{ width:"12px", height:"12px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2.5} style={{ width:"12px", height:"12px" }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ── Nav config ─────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { path:"/",              label:"Dashboard",    Icon:IconDashboard, section:"main"    },
  { path:"/transactions",  label:"Transactions", Icon:IconSwap,      section:"main"    },
  { path:"/goals",         label:"Goals",        Icon:IconTarget,    section:"main"    },
  { path:"/goal-dashboard",label:"Goal Overview",Icon:IconChart,     section:"main"    },
  { path:"/category",      label:"Categories",   Icon:IconTag,       section:"main"    },
  { path:"/profile",       label:"Profile",      Icon:IconUser,      section:"account" },
  { path:"/usersettings",  label:"Settings",     Icon:IconSettings,  section:"account" },
  { path:"/",       label:"Budgets",      Icon:IconWallet,    section:"main"    },
];

/* ══════════════════════════════════════════════════════════════════════
   APP LAYOUT
══════════════════════════════════════════════════════════════════════ */
export default function AppLayout({ children }) {
  const location          = useLocation();
  const navigate          = useNavigate();
  const { token, logout } = useAuth();

  const [collapsed,  setCollapsed]  = useState(false);
  const [darkMode,   setDarkMode]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* theme init */
  useEffect(() => {
    const saved  = localStorage.getItem("theme");
    const prefer = window.matchMedia("(prefers-color-scheme:dark)").matches;
    const isDark = saved === "dark" || (!saved && prefer);
    if (isDark) { document.documentElement.classList.add("dark"); setDarkMode(true); }
  }, []);

  /* CRITICAL: close drawer when route changes */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* CRITICAL: lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const pageName = NAV_ITEMS.find(n => isActive(n.path))?.label ?? "Dashboard";

  /* ── Single nav link ─────────────────────────────────────────────── */
  const NavLink = ({ path, label, Icon, mini }) => {
    const active = isActive(path);
    return (
      <Link to={path}
        title={mini ? label : undefined}
        className="al-navlink"
        style={{
          display: "flex",
          alignItems: "center",
          /* KEY FIX: when mini, hide overflow so text truly disappears */
          gap: mini ? 0 : "10px",
          justifyContent: mini ? "center" : "flex-start",
          padding: mini ? "10px 0" : "9px 12px",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: active ? "#6366f1" : "var(--text-secondary,#64748b)",
          background: active ? "rgba(99,102,241,0.10)" : "transparent",
          position: "relative",
          /* overflow hidden ensures label text clips when width shrinks */
          overflow: "hidden",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}>

        {/* Active left bar */}
        {active && !mini && (
          <span style={{
            position:"absolute", left:0, top:"18%",
            width:"3px", height:"64%",
            borderRadius:"0 3px 3px 0", background:"#6366f1",
            flexShrink: 0,
          }} />
        )}

        {/* Icon bubble — always shown */}
        <span style={{
          width: "28px", height: "28px",
          borderRadius: "8px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: active ? "rgba(99,102,241,0.14)" : "transparent",
          transition: "background 0.18s ease",
          /* ensure icon never shrinks */
          minWidth: "28px",
        }}>
          <Icon />
        </span>

        {/* Label — only rendered when NOT mini so it truly unmounts */}
        {!mini && (
          <span style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {label}
          </span>
        )}
      </Link>
    );
  };

  /* ── Section label ───────────────────────────────────────────────── */
  const SectionLabel = ({ label, mini }) => mini
    ? <div style={{ height:"1px", background:"var(--border,#e2e8f0)", margin:"6px 8px" }} />
    : <p style={{
        fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.1em",
        textTransform:"uppercase", color:"var(--text-muted,#94a3b8)",
        margin:"14px 0 4px 12px", padding:0,
      }}>{label}</p>;

  /* ── Sidebar content — used by BOTH desktop aside & mobile drawer ── */
  const SidebarContent = ({ mini = false }) => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* Logo row */}
      <div style={{
        display:"flex", alignItems:"center",
        gap: mini ? 0 : "10px",
        justifyContent: mini ? "center" : "flex-start",
        padding: mini ? "18px 0" : "18px 16px",
        borderBottom:"1px solid var(--border,#e2e8f0)",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <div style={{
          width:"32px", height:"32px", borderRadius:"10px",
          overflow:"hidden", flexShrink:0,
          boxShadow:"0 2px 8px rgba(99,102,241,0.28)",
          border:"1.5px solid rgba(99,102,241,0.18)",
          minWidth:"32px",
        }}>
          <img src={logo} alt="logo"
               style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </div>
        {/* Label only renders when not mini — no CSS hide, actual unmount */}
        {!mini && (
          <span style={{
            fontWeight:800, fontSize:"0.9375rem", letterSpacing:"-0.02em",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            whiteSpace:"nowrap", overflow:"hidden",
          }}>
            FinanceWise
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"8px" }}>
        <SectionLabel label="Main" mini={mini} />
        <div style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
          {NAV_ITEMS.filter(n => n.section === "main").map(n => (
            <NavLink key={n.path} {...n} mini={mini} />
          ))}
        </div>

        <SectionLabel label="Account" mini={mini} />
        <div style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
          {NAV_ITEMS.filter(n => n.section === "account").map(n => (
            <NavLink key={n.path} {...n} mini={mini} />
          ))}
        </div>
      </nav>

      {/* Bottom: theme + logout */}
      <div style={{
        padding: mini ? "10px 8px" : "10px 12px",
        borderTop:"1px solid var(--border,#e2e8f0)",
        display:"flex", flexDirection:"column", gap:"4px",
        flexShrink:0,
      }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          title={mini ? (darkMode ? "Light mode" : "Dark mode") : undefined}
          className="al-navlink"
          style={{
            display:"flex", alignItems:"center",
            gap: mini ? 0 : "10px",
            justifyContent: mini ? "center" : "flex-start",
            padding: mini ? "10px 0" : "9px 12px",
            borderRadius:"10px", width:"100%",
            fontSize:"0.8rem", fontWeight:600,
            color:"var(--text-secondary,#64748b)",
            background:"transparent", border:"none", cursor:"pointer",
            overflow:"hidden", whiteSpace:"nowrap",
          }}>
          <span style={{
            width:"28px", height:"28px", borderRadius:"8px",
            flexShrink:0, minWidth:"28px",
            display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(99,102,241,0.08)",
          }}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </span>
          {!mini && (
            <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>
              {darkMode ? "Light mode" : "Dark mode"}
            </span>
          )}
        </button>

        {/* Logout */}
        {token && (
          <button onClick={handleLogout}
            title={mini ? "Logout" : undefined}
            className="al-logout"
            style={{
              display:"flex", alignItems:"center",
              gap: mini ? 0 : "10px",
              justifyContent: mini ? "center" : "flex-start",
              padding: mini ? "10px 0" : "9px 12px",
              borderRadius:"10px", width:"100%",
              fontSize:"0.8rem", fontWeight:600, color:"#dc2626",
              background:"rgba(239,68,68,0.06)",
              border:"none", cursor:"pointer",
              overflow:"hidden", whiteSpace:"nowrap",
            }}>
            <span style={{
              width:"28px", height:"28px", borderRadius:"8px",
              flexShrink:0, minWidth:"28px",
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(239,68,68,0.10)",
            }}>
              <IconLogout />
            </span>
            {!mini && (
              <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>
                Logout
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        /* Animations */
        @keyframes al-slide-in {
          from { opacity:0; transform:translateX(-100%); }
          to   { opacity:1; transform:translateX(0);      }
        }
        @keyframes al-fade {
          from { opacity:0; } to { opacity:1; }
        }

        /* Nav links */
        .al-navlink {
          transition: background 0.18s ease, color 0.18s ease;
        }
        .al-navlink:hover {
          background: rgba(99,102,241,0.08) !important;
          color: #6366f1 !important;
        }
        .al-logout { transition: background 0.18s ease; }
        .al-logout:hover { background: rgba(239,68,68,0.12) !important; }

        /* Topbar buttons */
        .al-topbtn {
          transition: background 0.18s ease, color 0.18s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .al-topbtn:hover {
          background: rgba(99,102,241,0.10) !important;
          color: #6366f1 !important;
        }

        /* Sidebar width transition — KEY for collapse animation */
        .al-sidebar {
          transition: width 0.28s cubic-bezier(0.16,1,0.3,1);
        }

        /* Mobile drawer */
        .al-drawer  { animation: al-slide-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
        .al-overlay { animation: al-fade 0.2s ease both; }
      `}</style>

      <div style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg,#f0f2ff)",
        color: "var(--text-primary,#0f172a)",
      }}>

        {/* ════════════════════════════════════════════════════════════
            DESKTOP SIDEBAR
            Hidden on mobile via media query below
        ════════════════════════════════════════════════════════════ */}
        <aside
          className="al-sidebar"
          style={{
            /* width drives collapse — labels unmount via {!mini && ...} */
            width: collapsed ? "68px" : "240px",
            flexShrink: 0,
            background: "var(--surface,#fff)",
            borderRight: "1px solid var(--border,#e2e8f0)",
            boxShadow: "2px 0 16px rgba(99,102,241,0.06)",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
          <SidebarContent mini={collapsed} />
        </aside>

        {/* Collapse toggle — floats on sidebar edge, desktop only */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="al-topbtn"
          aria-label="Toggle sidebar"
          style={{
            position: "fixed",
            top: "50%",
            left: collapsed ? "56px" : "228px",
            transform: "translateY(-50%)",
            zIndex: 40,
            width: "20px", height: "36px",
            borderRadius: "0 8px 8px 0",
            background: "var(--surface,#fff)",
            border: "1px solid var(--border,#e2e8f0)",
            borderLeft: "none",
            cursor: "pointer",
            color: "var(--text-muted,#94a3b8)",
            boxShadow: "3px 0 10px rgba(99,102,241,0.10)",
            transition: "left 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
          /* Hide on mobile via CSS below */
          id="al-collapse-btn"
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>

        {/* ════════════════════════════════════════════════════════════
            MOBILE OVERLAY (tap to close)
        ════════════════════════════════════════════════════════════ */}
        {mobileOpen && (
          <div
            className="al-overlay"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              background: "rgba(0,0,0,0.50)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />
        )}

        {/* ════════════════════════════════════════════════════════════
            MOBILE DRAWER
            Full SidebarContent, always mini=false so text shows
        ════════════════════════════════════════════════════════════ */}
        {mobileOpen && (
          <div
            className="al-drawer"
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: "272px", zIndex: 70,
              background: "var(--surface,#fff)",
              borderRight: "1px solid var(--border,#e2e8f0)",
              boxShadow: "8px 0 32px rgba(99,102,241,0.16)",
              overflowY: "auto", overflowX: "hidden",
              display: "flex", flexDirection: "column",
            }}>
            {/* Close button inside drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="al-topbtn"
              style={{
                position: "absolute", top: "14px", right: "14px",
                width: "32px", height: "32px", borderRadius: "8px",
                background: "var(--surface-raised,#f8fafc)",
                border: "1px solid var(--border,#e2e8f0)",
                cursor: "pointer", zIndex: 1,
                color: "var(--text-secondary,#64748b)",
                flexShrink: 0,
              }}>
              <IconXMark />
            </button>
            {/* Always full (mini=false) so all labels show */}
            <SidebarContent mini={false} />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            MAIN AREA
        ════════════════════════════════════════════════════════════ */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          minWidth: 0, overflow: "hidden",
        }}>

          {/* Topbar */}
          <header style={{
            height: "58px", flexShrink: 0,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border,#e2e8f0)",
            boxShadow: "0 1px 10px rgba(99,102,241,0.07)",
            display: "flex", alignItems: "center",
            padding: "0 16px", gap: "12px",
            position: "sticky", top: 0, zIndex: 30,
          }}>

            {/* Hamburger — mobile only, shown via CSS */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="al-topbtn al-hamburger"
              aria-label="Open menu"
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "var(--surface-raised,#f8fafc)",
                border: "1px solid var(--border,#e2e8f0)",
                cursor: "pointer", flexShrink: 0,
                color: mobileOpen ? "#6366f1" : "var(--text-secondary,#64748b)",
              }}>
              {mobileOpen ? <IconXMark /> : <IconMenu />}
            </button>

            {/* Page title + date */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontSize: "0.9375rem", fontWeight: 700, margin: 0,
                color: "var(--text-primary,#0f172a)", letterSpacing: "-0.01em",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {pageName}
              </h2>
              <p style={{ fontSize: "0.68rem", margin: 0, color: "var(--text-muted,#94a3b8)" }}>
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric",
                  month: "long", year: "numeric",
                })}
              </p>
            </div>

            {/* Right: theme + profile */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
              <button onClick={toggleTheme}
                className="al-topbtn"
                style={{
                  width:"36px", height:"36px", borderRadius:"10px",
                  background:"var(--surface-raised,#f8fafc)",
                  border:"1px solid var(--border,#e2e8f0)",
                  cursor:"pointer",
                  color:"var(--text-secondary,#64748b)",
                }}>
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>

              <Link to="/profile" style={{
                width:"36px", height:"36px", borderRadius:"10px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow:"0 2px 8px rgba(99,102,241,0.32)",
                flexShrink:0, textDecoration:"none", color:"#fff",
              }}>
                <IconUser />
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex:1, overflowY:"auto", padding:"20px 16px 40px" }}>
            {children}
             <AppFooter />
          </main>
        </div>
      </div>

      {/* ── Global responsive CSS ─────────────────────────────────────
          Pure media queries — no JS window.innerWidth needed.
          Mobile  (< 768px): hide desktop sidebar + collapse toggle,
                              show hamburger button.
          Desktop (≥ 768px): show desktop sidebar + collapse toggle,
                              hide hamburger button.
      ─────────────────────────────────────────────────────────────── */}
      <style>{`
        /* Mobile default */
        .al-sidebar    { display: none   !important; }
        #al-collapse-btn { display: none !important; }
        .al-hamburger  { display: flex   !important; }

        /* Desktop override */
        @media (min-width: 768px) {
          .al-sidebar      { display: flex  !important; }
          #al-collapse-btn { display: flex  !important; }
          .al-hamburger    { display: none  !important; }
        }
      `}</style>
    </>
  );
}