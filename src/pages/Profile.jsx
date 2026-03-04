import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


/* ── Icons ─────────────────────────────────────────────────────────── */
const IconEdit = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
         m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconMoney = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3
         2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0
         1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9
         0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconGlobe = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945
         M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104
         0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064
         M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconTarget = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
         2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
         m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2
         2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconMail = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0
         002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconShield = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944
         a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0
         5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
         0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/* ── Skeleton block ─────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "16px", radius = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "pr-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ══════════════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(true);
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!token) return;
      try {
        const res = await API.get("/api/profile/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, setUser]);

  const initials = formData?.name
    ? formData.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const INFO_ROWS = [
    {
      icon: IconMoney,
      label: "Monthly Income",
      value: formData?.monthlyIncome
        ? `${formData?.currency || "NGN"} ${Number(formData.monthlyIncome).toLocaleString()}`
        : "Not set",
      accent: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
    },
    {
      icon: IconGlobe,
      label: "Currency",
      value: formData?.currency || "NGN",
      accent: "#06b6d4",
      bg: "rgba(6,182,212,0.08)",
    },
    {
      icon: IconTarget,
      label: "Financial Goal",
      value: formData?.financialGoal || "Not set",
      accent: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
    },
    {
      icon: IconMail,
      label: "Email",
      value: formData?.email || "—",
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes pr-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pr-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pr-scale-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes pr-ring-spin {
          to { transform: rotate(360deg); }
        }

        .pr-fade-up  { animation: pr-fade-up  0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .pr-scale-in { animation: pr-scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }

        .pr-card {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }

        .pr-info-row {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .pr-info-row:hover {
          background: rgba(99,102,241,0.04) !important;
          transform: translateX(3px);
        }

        .pr-edit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 18px rgba(99,102,241,0.35);
        }
        .pr-edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.50);
        }
        .pr-edit-btn:active { transform: translateY(0); }

        .pr-avatar-ring {
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);
          padding: 3px;
          border-radius: 9999px;
        }

        /* stagger */
        .pr-s1 { animation-delay: 60ms;  }
        .pr-s2 { animation-delay: 120ms; }
        .pr-s3 { animation-delay: 180ms; }
        .pr-s4 { animation-delay: 240ms; }
      `}</style>

      <div className="min-h-screen" style={{ background: "var(--bg, #f0f2ff)" }}>
        

        <div className="max-w-lg mx-auto px-4 pt-8 pb-24">

          {/* ── Page heading ─────────────────────────────── */}
          <div className="mb-6 pr-fade-up">
            <h1 className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--text-primary, #0f172a)" }}>
              My Profile
            </h1>
            <p className="text-sm mt-1"
               style={{ color: "var(--text-secondary, #64748b)" }}>
              Your personal and financial information
            </p>
          </div>

          {/* ── Main card ────────────────────────────────── */}
          <div className="pr-card pr-fade-up rounded-3xl overflow-hidden"
            style={{
              background: "var(--surface, #ffffff)",
              border: "1px solid var(--border, #e2e8f0)",
              boxShadow: "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            }}>

            {/* ── Hero banner + avatar ──────────────────── */}
            <div className="relative h-28 sm:h-32"
              style={{
                background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0891b2 100%)",
              }}>
              {/* dot grid */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />

              {/* Verified badge top-right */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5
                              px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(6px)",
                }}>
                <IconShield className="w-3 h-3" style={{ color: "#4ade80" }} />
                <span className="text-white text-xs font-medium">Verified</span>
              </div>
            </div>

            {/* Avatar — overlapping the banner */}
            <div className="flex flex-col items-center -mt-12 px-6 pb-6">
              <div className="pr-avatar-ring pr-scale-in mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden
                                flex items-center justify-center"
                  style={{ background: "var(--surface, #fff)" }}>
                  {loading ? (
                    <div className="w-full h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
                        backgroundSize: "200% 100%",
                        animation: "pr-shimmer 1.6s ease-in-out infinite",
                      }} />
                  ) : formData?.profilePic ? (
                    <img src={formData.profilePic} alt={formData?.name}
                         className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      }}>
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name + email */}
              {loading ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <Skeleton w="160px" h="24px" radius="8px" />
                  <Skeleton w="200px" h="16px" radius="6px" />
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight"
                      style={{ color: "var(--text-primary, #0f172a)" }}>
                    {formData?.name || "User"}
                  </h2>
                  <p className="text-sm mt-0.5"
                     style={{ color: "var(--text-secondary, #64748b)" }}>
                    {formData?.email}
                  </p>
                </div>
              )}

              {/* Member since pill */}
              {!loading && (
                <div className="mt-3 px-3 py-1 rounded-full text-xs font-medium pr-scale-in"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    color: "#6366f1",
                    border: "1px solid rgba(99,102,241,0.15)",
                  }}>
                  FinTrackr Member
                </div>
              )}
            </div>

            {/* ── Divider ──────────────────────────────── */}
            <div className="mx-6" style={{ height: "1px", background: "var(--border, #e2e8f0)" }} />

            {/* ── Info rows ────────────────────────────── */}
            <div className="px-4 sm:px-6 py-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-3"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Financial Details
              </p>

              {INFO_ROWS.map((row, i) => (
                <div key={row.label}
                  className={`pr-info-row flex items-center gap-4 px-3 py-3.5
                              rounded-xl pr-fade-up pr-s${i + 1}`}
                  style={{ background: "transparent" }}>

                  {/* Icon bubble */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: row.bg }}>
                    <row.icon className="w-4.5 h-4.5" style={{ color: row.accent, width: "18px", height: "18px" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5"
                       style={{ color: "var(--text-muted, #94a3b8)" }}>
                      {row.label}
                    </p>
                    {loading ? (
                      <Skeleton w="120px" h="14px" radius="4px" />
                    ) : (
                      <p className="text-sm font-semibold truncate"
                         style={{ color: "var(--text-primary, #0f172a)" }}>
                        {row.value}
                      </p>
                    )}
                  </div>

                  {/* Value badge */}
                  {!loading && (
                    <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: row.bg, color: row.accent }}>
                      {row.label === "Currency" ? row.value :
                       row.label === "Financial Goal" && row.value !== "Not set" ? "Active" :
                       row.value === "Not set" ? "—" : "Set"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Edit button ──────────────────────────── */}
            <div className="px-4 sm:px-6 pb-6">
              <button
                onClick={() => navigate("/usersettings")}
                className="pr-edit-btn w-full flex items-center justify-center gap-2
                           py-3.5 rounded-xl text-white font-semibold text-sm">
                <IconEdit className="w-4 h-4" style={{ color: "white" }} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ── Quick stats strip ───────────────────────── */}
          {!loading && (
            <div className="mt-4 grid grid-cols-3 gap-3 pr-fade-up"
                 style={{ animationDelay: "300ms" }}>
              {[
                { label: "Transactions", value: formData?.transactionCount ?? "—", color: "#6366f1", bg: "rgba(99,102,241,0.08)"  },
                { label: "Goals",        value: formData?.goalCount        ?? "—", color: "#22c55e", bg: "rgba(34,197,94,0.08)"   },
                { label: "Categories",   value: formData?.categoryCount    ?? "—", color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
              ].map(s => (
                <div key={s.label}
                  className="pr-card rounded-2xl p-4 text-center"
                  style={{
                    background: "var(--surface, #fff)",
                    border: "1px solid var(--border, #e2e8f0)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted, #94a3b8)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;