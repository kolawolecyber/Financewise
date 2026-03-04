import { useAuth } from "../context/AuthContext";

/* ══════════════════════════════════════════════════════════════════════
   GLOBAL LOADER
══════════════════════════════════════════════════════════════════════ */
const GlobalLoader = () => {
  const { loading } = useAuth();
  if (!loading) return null;

  return (
    <>
      <style>{`
        @keyframes gl-fade-in {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes gl-scale-in {
          from { opacity:0; transform:scale(0.92) translateY(12px); }
          to   { opacity:1; transform:scale(1)    translateY(0);     }
        }
        @keyframes gl-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes gl-pulse-ring {
          0%   { transform:scale(0.85); opacity:0.6; }
          50%  { transform:scale(1.15); opacity:0.2; }
          100% { transform:scale(0.85); opacity:0.6; }
        }
        @keyframes gl-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes gl-bar {
          0%   { width: 0%;   }
          30%  { width: 40%;  }
          60%  { width: 70%;  }
          85%  { width: 88%;  }
          100% { width: 96%;  }
        }
        @keyframes gl-dot {
          0%, 80%, 100% { transform: scale(0); opacity:0.3; }
          40%           { transform: scale(1); opacity:1;   }
        }
        @keyframes gl-float {
          0%, 100% { transform: translateY(0px);  }
          50%      { transform: translateY(-6px); }
        }

        .gl-overlay {
          animation: gl-fade-in 0.25s ease both;
        }
        .gl-card {
          animation: gl-scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both;
          animation-delay: 0.05s;
        }
        .gl-spinner {
          animation: gl-spin 0.85s linear infinite;
        }
        .gl-pulse {
          animation: gl-pulse-ring 1.8s ease-in-out infinite;
        }
        .gl-bar-fill {
          animation: gl-bar 2.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        .gl-float {
          animation: gl-float 3s ease-in-out infinite;
        }
        .gl-dot-1 { animation: gl-dot 1.4s ease-in-out 0.0s infinite; }
        .gl-dot-2 { animation: gl-dot 1.4s ease-in-out 0.2s infinite; }
        .gl-dot-3 { animation: gl-dot 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      {/* ── Full-screen overlay ─────────────────────────────────── */}
      <div className="gl-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(240,242,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "20px",
        }}>

        {/* ── Ambient orbs ────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: "15%", left: "10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "10%",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Card ────────────────────────────────────────────── */}
        <div className="gl-card"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "24px",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow: "0 20px 60px rgba(99,102,241,0.14), 0 4px 16px rgba(0,0,0,0.06)",
            padding: "40px 36px 36px",
            width: "100%",
            maxWidth: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
          }}>

          {/* ── Logo / spinner stack ─────────────────────────── */}
          <div className="gl-float"
            style={{ position: "relative", width: "72px", height: "72px",
                     marginBottom: "24px" }}>

            {/* Pulse ring */}
            <div className="gl-pulse" style={{
              position: "absolute", inset: "-8px",
              borderRadius: "50%",
              border: "2px solid rgba(99,102,241,0.30)",
            }} />

            {/* Outer spinner ring */}
            <svg className="gl-spinner"
              style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
              viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="32"
                stroke="url(#gl-grad)" strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="140 62"
              />
              <defs>
                <linearGradient id="gl-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Icon bubble centre */}
            <div style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.38)",
            }}>
              {/* bar chart icon */}
              <svg fill="none" viewBox="0 0 24 24" stroke="#fff"
                   strokeWidth={1.8}
                   style={{ width: "22px", height: "22px" }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
                     2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
                     m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2
                     2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          {/* ── Text ────────────────────────────────────────────── */}
          <h2 style={{
            fontSize: "1.0625rem", fontWeight: 800, margin: "0 0 6px",
            color: "var(--text-primary,#0f172a)",
            letterSpacing: "-0.02em", textAlign: "center",
          }}>
            FinanceWise
          </h2>

          <p style={{
            fontSize: "0.8125rem", margin: "0 0 20px",
            color: "var(--text-secondary,#64748b)",
            textAlign: "center", fontWeight: 500,
          }}>
            Fetching your financial data
          </p>

          {/* ── Animated dots ────────────────────────────────── */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "5px", marginBottom: "24px",
          }}>
            {["gl-dot-1","gl-dot-2","gl-dot-3"].map(cls => (
              <div key={cls} className={cls} style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              }} />
            ))}
          </div>

          {/* ── Progress bar ─────────────────────────────────── */}
          <div style={{
            width: "100%", height: "5px", borderRadius: "9999px",
            background: "var(--border,#e2e8f0)", overflow: "hidden",
          }}>
            <div className="gl-bar-fill" style={{
              height: "100%", borderRadius: "9999px",
              background: "linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)",
              boxShadow: "0 0 8px rgba(99,102,241,0.45)",
            }} />
          </div>

          {/* ── Skeleton preview rows ────────────────────────── */}
          <div style={{
            width: "100%", marginTop: "20px",
            display: "flex", flexDirection: "column", gap: "8px",
          }}>
            {[
              { w:"70%",  delay:"0ms"   },
              { w:"55%",  delay:"150ms" },
              { w:"80%",  delay:"300ms" },
            ].map((s, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{
                  width:"24px", height:"24px", borderRadius:"7px", flexShrink:0,
                  background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
                  backgroundSize:"200% 100%",
                  animation:`gl-shimmer 1.6s ${s.delay} ease-in-out infinite`,
                }} />
                <div style={{
                  flex:1, height:"10px", borderRadius:"6px",
                  background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
                  backgroundSize:"200% 100%",
                  animation:`gl-shimmer 1.6s ${s.delay} ease-in-out infinite`,
                  maxWidth: s.w,
                }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default GlobalLoader;