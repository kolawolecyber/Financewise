import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/financewise.png";

/* ── Icons ─────────────────────────────────────────────────────────── */
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
const IconHome = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
         2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0
         011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconTarget = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
         2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
         m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2
         2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconChart = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
const IconTag = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0
         010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0
         013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconSwap = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);
const IconUser = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconLogout = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3
         3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/* ── Nav links config ───────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/",               label: "Home",         Icon: IconHome   },
  { to: "/goals",          label: "Goals",        Icon: IconTarget },
  { to: "/goal-dashboard", label: "Overview",     Icon: IconChart  },
  { to: "/category",       label: "Categories",   Icon: IconTag    },
  { to: "/transactions",   label: "Transactions", Icon: IconSwap   },
  { to: "/profile",        label: "Profile",      Icon: IconUser   },
];

/* ══════════════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const mobileRef = useRef(null);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  /* close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <style>{`
        @keyframes nb-slide-down {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes nb-fade-in {
          from { opacity:0; }
          to   { opacity:1; }
        }

        .nb-mobile-menu {
          animation: nb-slide-down 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nb-link {
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          position: relative;
        }
        .nb-link:hover {
          background: rgba(99,102,241,0.08) !important;
          color: #6366f1 !important;
          transform: translateY(-1px);
        }

        .nb-logout {
          transition: all 0.18s ease;
        }
        .nb-logout:hover {
          background: rgba(239,68,68,0.08) !important;
          color: #ef4444 !important;
        }

        .nb-hamburger {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .nb-hamburger:hover {
          background: rgba(99,102,241,0.08) !important;
          transform: scale(1.05);
        }
        .nb-hamburger:active { transform: scale(0.95); }

        .nb-mobile-link {
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        .nb-mobile-link:hover {
          background: rgba(99,102,241,0.06) !important;
          color: #6366f1 !important;
          transform: translateX(3px);
        }
      `}</style>

      <nav style={{
        background: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border,#e2e8f0)",
        boxShadow: scrolled
          ? "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)"
          : "none",
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "box-shadow 0.3s ease, background 0.3s ease",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6"
             style={{ height: "64px", display:"flex", alignItems:"center",
                      justifyContent:"space-between" }}>

          {/* ── Logo ──────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0"
            style={{ textDecoration:"none" }}>
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0"
              style={{
                boxShadow: "0 2px 8px rgba(99,102,241,0.30)",
                border: "1.5px solid rgba(99,102,241,0.20)",
              }}>
              <img src={logo} alt="FinanceWise logo"
                   className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:block"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              FinanceWise
            </span>
          </Link>

          {/* ── Desktop links ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to}
                className="nb-link flex items-center gap-1.5 px-3 py-2
                           rounded-lg text-xs font-semibold"
                style={{
                  textDecoration: "none",
                  background: isActive(to)
                    ? "rgba(99,102,241,0.10)" : "transparent",
                  color: isActive(to)
                    ? "#6366f1"
                    : "var(--text-secondary,#64748b)",
                  boxShadow: isActive(to)
                    ? "inset 0 0 0 1px rgba(99,102,241,0.18)" : "none",
                }}>
                <Icon />
                {label}
              </Link>
            ))}

            {/* Divider */}
            {token && (
              <div style={{
                width:"1px", height:"20px",
                background: "var(--border,#e2e8f0)",
                margin: "0 4px",
              }} />
            )}

            {token && (
              <button onClick={handleLogout}
                className="nb-logout flex items-center gap-1.5 px-3 py-2
                           rounded-lg text-xs font-semibold"
                style={{
                  background: "transparent",
                  color: "var(--text-secondary,#64748b)",
                  border: "none", cursor: "pointer",
                }}>
                <IconLogout />
                Logout
              </button>
            )}
          </div>

          {/* ── Hamburger ─────────────────────────────── */}
          <button onClick={() => setIsOpen(o => !o)}
            className="nb-hamburger flex md:hidden items-center justify-center
                       w-9 h-9 rounded-xl border"
            style={{
              background: isOpen ? "rgba(99,102,241,0.08)" : "var(--surface,#fff)",
              borderColor: "var(--border,#e2e8f0)",
              color: isOpen ? "#6366f1" : "var(--text-secondary,#64748b)",
            }}
            aria-label="Toggle menu">
            {isOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* ── Mobile menu ───────────────────────────────── */}
        {isOpen && (
          <div ref={mobileRef} className="nb-mobile-menu md:hidden px-4 pb-5 pt-2"
            style={{
              borderTop: "1px solid var(--border,#e2e8f0)",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(16px)",
            }}>

            {/* Links */}
            <div className="space-y-1">
              {NAV_LINKS.map(({ to, label, Icon }) => (
                <Link key={to} to={to}
                  onClick={() => setIsOpen(false)}
                  className="nb-mobile-link flex items-center gap-3
                             px-3 py-3 rounded-xl"
                  style={{
                    textDecoration: "none",
                    background: isActive(to)
                      ? "rgba(99,102,241,0.08)" : "transparent",
                    color: isActive(to)
                      ? "#6366f1"
                      : "var(--text-secondary,#64748b)",
                  }}>
                  {/* Icon bubble */}
                  <div className="w-8 h-8 rounded-lg flex items-center
                                  justify-center shrink-0"
                    style={{
                      background: isActive(to)
                        ? "rgba(99,102,241,0.12)"
                        : "var(--surface-raised,#f8fafc)",
                      border: "1px solid var(--border,#e2e8f0)",
                    }}>
                    <Icon />
                  </div>
                  <span className="text-sm font-semibold">{label}</span>

                  {/* Active dot */}
                  {isActive(to) && (
                    <div className="ml-auto w-2 h-2 rounded-full"
                         style={{ background: "#6366f1" }} />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            {token && (
              <div style={{
                height:"1px",
                background: "var(--border,#e2e8f0)",
                margin: "12px 0",
              }} />
            )}

            {/* Logout */}
            {token && (
              <button onClick={handleLogout}
                className="nb-mobile-link w-full flex items-center gap-3
                           px-3 py-3 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "none", cursor:"pointer",
                  color: "#dc2626",
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center
                                justify-center shrink-0"
                  style={{
                    background: "rgba(239,68,68,0.10)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}>
                  <IconLogout />
                </div>
                <span className="text-sm font-semibold">Logout</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;