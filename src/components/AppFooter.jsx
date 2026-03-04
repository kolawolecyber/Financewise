// src/components/AppFooter.jsx

const AppFooter = () => {
  const year = new Date().getFullYear();

  const SOCIALS = [
    {
      label: "GitHub",
      href: "https://github.com/kolawolecyber",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24"
             style={{ width:"16px", height:"16px" }}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865
            8.18 6.839 9.504.5.092.682-.217.682-.483
            0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
            1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341
            1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
            0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
            0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004
            1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546
            1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688
            0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
            0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019
            10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/abdulafeez-abdulakeem-133901146",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24"
             style={{ width:"16px", height:"16px" }}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
            0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
            1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
            7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063
            2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225
            0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24
            1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24
            .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: "https://x.com/abdulakeem55",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24"
             style={{ width:"16px", height:"16px" }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
            6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.632
            5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: "mailto:abdulakeemabdulafez@gmail.com",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
             strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2
               0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0
               002 2z" />
        </svg>
      ),
    },
  ];

  const LINKS = [
    { label:"Portfolio",   href:"https://kolawolecyber.vercel.app" },
    { label:"GitHub",      href:"https://github.com/kolawolecyber" },
    { label:"Budgenix",    href:"https://budgenix.vercel.app"      },
  ];

  return (
    <>
      <style>{`
        @keyframes ft-fade-in {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .ft-root { animation: ft-fade-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        .ft-social {
          transition: background 0.18s ease, color 0.18s ease,
                      transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ft-social:hover {
          background: rgba(99,102,241,0.12) !important;
          color: #6366f1 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.20) !important;
        }

        .ft-link {
          transition: color 0.18s ease;
        }
        .ft-link:hover { color: #6366f1 !important; }
      `}</style>

      <footer className="ft-root" style={{
        borderTop: "1px solid var(--border,#e2e8f0)",
        background: "var(--surface,#fff)",
        padding: "24px 20px 20px",
        marginTop: "auto",
        /* never appear behind sidebar — inherits layout flow */
      }}>

        {/* ── Main row ──────────────────────────────────────────── */}
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
        }}>

          {/* Brand blurb */}
          <div style={{ flex:"1 1 220px", minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center",
                          gap:"8px", marginBottom:"8px" }}>
              {/* Mini finance icon */}
              <div style={{
                width:"28px", height:"28px", borderRadius:"8px",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
                boxShadow:"0 2px 6px rgba(99,102,241,0.30)",
              }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#fff"
                     strokeWidth={1.8} style={{ width:"14px", height:"14px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3
                       2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12
                       8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1
                       M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span style={{
                fontWeight:800, fontSize:"0.875rem", letterSpacing:"-0.02em",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                FinanceWise
              </span>
            </div>
            <p style={{
              fontSize:"0.72rem", lineHeight:1.6, margin:0,
              color:"var(--text-muted,#94a3b8)", maxWidth:"240px",
            }}>
              Smart budgeting and expense tracking with real-time analytics
              and financial insights — built for clarity.
            </p>
          </div>

          {/* Quick links */}
          <div style={{ flex:"0 0 auto" }}>
            <p style={{
              fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.1em",
              textTransform:"uppercase", color:"var(--text-muted,#94a3b8)",
              margin:"0 0 8px",
            }}>
              Links
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
              {LINKS.map(l => (
                <a key={l.label} href={l.href}
                   target="_blank" rel="noopener noreferrer"
                   className="ft-link"
                   style={{
                     fontSize:"0.78rem", fontWeight:600,
                     color:"var(--text-secondary,#64748b)",
                     textDecoration:"none",
                   }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Developer card */}
          <div style={{ flex:"0 0 auto" }}>
            <p style={{
              fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.1em",
              textTransform:"uppercase", color:"var(--text-muted,#94a3b8)",
              margin:"0 0 8px",
            }}>
              Developer
            </p>
            <div style={{
              padding:"10px 14px", borderRadius:"12px",
              background:"rgba(99,102,241,0.05)",
              border:"1px solid rgba(99,102,241,0.14)",
            }}>
              <p style={{
                fontSize:"0.8rem", fontWeight:700, margin:"0 0 2px",
                color:"var(--text-primary,#0f172a)",
              }}>
                Abdulafeez Abdulakeem
              </p>
              <p style={{
                fontSize:"0.7rem", margin:"0 0 8px",
                color:"var(--text-muted,#94a3b8)",
              }}>
                Full-Stack Developer · Cyberkon
              </p>
              {/* Social icons */}
              <div style={{ display:"flex", gap:"6px" }}>
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href}
                     target="_blank" rel="noopener noreferrer"
                     title={s.label}
                     className="ft-social"
                     style={{
                       width:"28px", height:"28px", borderRadius:"8px",
                       display:"flex", alignItems:"center", justifyContent:"center",
                       background:"var(--surface-raised,#f8fafc)",
                       border:"1px solid var(--border,#e2e8f0)",
                       color:"var(--text-secondary,#64748b)",
                       textDecoration:"none",
                     }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div style={{
          maxWidth:"1200px", margin:"16px auto 0",
          paddingTop:"14px",
          borderTop:"1px solid var(--border,#e2e8f0)",
          display:"flex", flexWrap:"wrap",
          alignItems:"center", justifyContent:"space-between",
          gap:"8px",
        }}>
          <p style={{
            fontSize:"0.7rem", margin:0,
            color:"var(--text-muted,#94a3b8)",
          }}>
            © {year} FinanceWise by{" "}
            <a href="https://kolawolecyber.vercel.app"
               target="_blank" rel="noopener noreferrer"
               className="ft-link"
               style={{
                 fontWeight:700, color:"#6366f1",
                 textDecoration:"none",
               }}>
              Cyberkon
            </a>
            . All rights reserved.
          </p>

          <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{
              width:"6px", height:"6px", borderRadius:"50%",
              background:"#22c55e",
              boxShadow:"0 0 4px rgba(34,197,94,0.60)",
            }} />
            <span style={{
              fontSize:"0.68rem", fontWeight:600,
              color:"var(--text-muted,#94a3b8)",
            }}>
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AppFooter;