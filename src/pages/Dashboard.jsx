import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchBudgets, createBudget, fetchExpenses } from "../utils/Api";
import BudgetCardWithExpenses from "../components/BudgetCardWithExpense";
import BudgetChart from "../components/BudgetChart";
import Navbar from "../components/Navbar";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconPlus = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2.5} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconX = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2.5} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconCheck = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={2.5} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconWallet = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"22px", height:"22px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10h18M3 6h18M3 14h18M3 18h18" />
  </svg>
);
const IconTrend = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"22px", height:"22px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconShield = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"22px", height:"22px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
         11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
         10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconText = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
);
const IconTag = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0
         010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0
         013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconCalendar = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0
         00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconEmpty = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.5} style={{ width:"32px", height:"32px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1
         1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconChart = ({ style }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
       strokeWidth={1.8} style={{ width:"16px", height:"16px", ...style }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "16px", radius = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "db-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ── Overall progress bar ───────────────────────────────────────────── */
const SpendBar = ({ pct, isOver }) => (
  <div style={{
    width:"100%", height:"6px", borderRadius:"9999px",
    background:"var(--border,#e2e8f0)", overflow:"hidden",
  }}>
    <div style={{
      width:`${Math.min(pct,100)}%`, height:"100%", borderRadius:"9999px",
      background: isOver
        ? "linear-gradient(90deg,#ef4444,#dc2626)"
        : pct >= 80
        ? "linear-gradient(90deg,#f59e0b,#d97706)"
        : "linear-gradient(90deg,#6366f1,#8b5cf6)",
      transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)",
      animation:"db-bar 0.9s cubic-bezier(0.16,1,0.3,1) both",
      boxShadow: isOver
        ? "0 0 8px rgba(239,68,68,0.40)"
        : "0 0 8px rgba(99,102,241,0.35)",
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { token }  = useAuth();
  const navigate   = useNavigate();

  const [budgets,          setBudgets]          = useState([]);
  const [expenses,         setExpenses]         = useState([]);
  const [loadingBudgets,   setLoadingBudgets]   = useState(true);
  const [loadingExpenses,  setLoadingExpenses]  = useState(true);
  const [showForm,         setShowForm]         = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [focused,          setFocused]          = useState("");
  const [form, setForm] = useState({
    title:"", amount:"", category:"", month:"",
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    setLoadingBudgets(true);
    setLoadingExpenses(true);
    fetchBudgets(token)
      .then(data => setBudgets(data))
      .finally(() => setLoadingBudgets(false));
    fetchExpenses(token)
      .then(data => setExpenses(data))
      .finally(() => setLoadingExpenses(false));
  }, [token, navigate]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createBudget(token, {
        ...form, amount: parseFloat(form.amount),
      });
      if (data?.id) {
        setBudgets(prev => [...prev, data]);
        setForm({ title:"", amount:"", category:"", month:"" });
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Derived stats ──────────────────────────────────────────────── */
  const expensesByBudget = {};
  budgets.forEach(b => {
    expensesByBudget[b.id] = expenses
      .filter(e => Number(e.budgetId) === Number(b.id))
      .reduce((s, e) => s + Number(e.amount), 0);
  });

  const totalBudget  = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpent   = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const remaining    = totalBudget - totalSpent;
  const spendPct     = totalBudget > 0
    ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isOver       = totalSpent > totalBudget;

  /* ── Form fields config ─────────────────────────────────────────── */
  const FIELDS = [
    { name:"title",    label:"Budget Title",  type:"text",   Icon:IconText,
      placeholder:"e.g. Monthly Groceries" },
    { name:"amount",   label:"Amount (₦)",    type:"number", Icon:IconWallet,
      placeholder:"0.00", mono:true },
    { name:"category", label:"Category",      type:"text",   Icon:IconTag,
      placeholder:"e.g. Food & Dining" },
    { name:"month",    label:"Month",         type:"text",   Icon:IconCalendar,
      placeholder:"e.g. January 2025" },
  ];

  return (
    <>
      <style>{`
        @keyframes db-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes db-fade-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes db-scale-in {
          from { opacity:0; transform:scale(0.94); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes db-slide-down {
          from { opacity:0; transform:translateY(-14px); max-height:0; }
          to   { opacity:1; transform:translateY(0);     max-height:900px; }
        }
        @keyframes db-bar  { from { width:0; } }
        @keyframes db-spin { to { transform:rotate(360deg); } }

        .db-fade-up   { animation: db-fade-up   0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .db-scale-in  { animation: db-scale-in  0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .db-slide-down{ animation: db-slide-down 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .db-spin      { animation: db-spin 0.9s linear infinite; }

        .db-stat-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .db-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(99,102,241,0.13) !important;
        }

        .db-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border,#e2e8f0);
        }
        .db-field:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }
        .db-input {
          outline:none; background:transparent; width:100%;
          font-size:0.875rem; caret-color:#6366f1;
          color:var(--text-primary,#0f172a); border:none;
        }
        .db-input::placeholder { color:#94a3b8; }

        .db-new-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
        }
        .db-new-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.50);
        }
        .db-new-btn:active { transform:translateY(0); }

        .db-cancel-btn {
          transition: all 0.18s ease;
        }
        .db-cancel-btn:hover {
          background: rgba(239,68,68,0.08) !important;
          border-color: rgba(239,68,68,0.25) !important;
          color: #ef4444 !important;
        }

        .db-submit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          box-shadow: 0 4px 14px rgba(34,197,94,0.32);
        }
        .db-submit-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow: 0 8px 24px rgba(34,197,94,0.46);
        }
        .db-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .db-getstarted-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          box-shadow: 0 4px 14px rgba(99,102,241,0.30);
        }
        .db-getstarted-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.45);
        }

        /* stagger */
        .db-s1 { animation-delay:  60ms; }
        .db-s2 { animation-delay: 120ms; }
        .db-s3 { animation-delay: 180ms; }
        .db-s4 { animation-delay: 240ms; }
        .db-s5 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen pb-24"
           style={{ background:"var(--bg,#f0f2ff)" }}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

          {/* ── Page header ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center
                          justify-between gap-4 mb-8 db-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color:"var(--text-primary,#0f172a)" }}>
                Financial Dashboard
              </h1>
              <p className="text-sm mt-1"
                 style={{ color:"var(--text-secondary,#64748b)" }}>
                Monitor your budgets and spending in real time
              </p>
            </div>

            <div className="flex items-center gap-3">
              {showForm && (
                <button onClick={() => setShowForm(false)}
                  className="db-cancel-btn flex items-center gap-2
                             px-4 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{
                    color:"var(--text-secondary,#64748b)",
                    borderColor:"var(--border,#e2e8f0)",
                    background:"var(--surface,#fff)",
                  }}>
                  <IconX />
                  Cancel
                </button>
              )}
              <button onClick={() => setShowForm(o => !o)}
                className="db-new-btn flex items-center gap-2
                           px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                <IconPlus style={{ color:"#fff" }} />
                {showForm ? "Close form" : "New Budget"}
              </button>
            </div>
          </div>

          {/* ── Stat strip ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                label:"Total Budget", value: totalBudget,
                icon: IconWallet,
                iconBg:"rgba(99,102,241,0.12)", iconColor:"#6366f1",
                valueColor:"#6366f1",
                border:"rgba(99,102,241,0.20)",
                glow:"0 4px 20px rgba(99,102,241,0.10)",
                delay:"db-s1",
              },
              {
                label:"Total Spent", value: totalSpent,
                icon: IconTrend,
                iconBg: isOver ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                iconColor: isOver ? "#ef4444" : "#f59e0b",
                valueColor: isOver ? "#dc2626" : "#b45309",
                border: isOver ? "rgba(239,68,68,0.22)" : "rgba(245,158,11,0.22)",
                glow: isOver
                  ? "0 4px 20px rgba(239,68,68,0.10)"
                  : "0 4px 20px rgba(245,158,11,0.10)",
                delay:"db-s2",
              },
              {
                label: remaining >= 0 ? "Remaining" : "Over Budget",
                value: Math.abs(remaining),
                icon: IconShield,
                iconBg: remaining >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                iconColor: remaining >= 0 ? "#22c55e" : "#ef4444",
                valueColor: remaining >= 0 ? "#16a34a" : "#dc2626",
                border: remaining >= 0 ? "rgba(34,197,94,0.22)" : "rgba(239,68,68,0.22)",
                glow: remaining >= 0
                  ? "0 4px 20px rgba(34,197,94,0.10)"
                  : "0 4px 20px rgba(239,68,68,0.10)",
                delay:"db-s3",
              },
            ].map(s => (
              <div key={s.label}
                className={`db-stat-card db-fade-up ${s.delay} rounded-2xl p-5`}
                style={{
                  background:"var(--surface,#fff)",
                  border:`1px solid ${s.border}`,
                  boxShadow: s.glow,
                }}>
                <div style={{ display:"flex", alignItems:"center",
                              justifyContent:"space-between", marginBottom:"12px" }}>
                  <div style={{
                    width:"44px", height:"44px", borderRadius:"14px",
                    background:s.iconBg,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <s.icon style={{ color:s.iconColor }} />
                  </div>
                  <span style={{
                    fontSize:"0.7rem", fontWeight:700, padding:"3px 10px",
                    borderRadius:"9999px",
                    background:s.iconBg, color:s.iconColor,
                  }}>
                    {s.label}
                  </span>
                </div>
                <p style={{
                  fontSize:"1.625rem", fontWeight:800, margin:0,
                  color:s.valueColor, fontFamily:"monospace",
                  letterSpacing:"-0.02em",
                }}>
                  ₦{s.value.toLocaleString()}
                </p>

                {/* overall spend bar only on "spent" card */}
                {s.label === "Total Spent" && totalBudget > 0 && (
                  <div style={{ marginTop:"10px" }}>
                    <SpendBar pct={spendPct} isOver={isOver} />
                    <p style={{
                      fontSize:"0.7rem", marginTop:"4px", textAlign:"right",
                      color: isOver ? "#dc2626"
                           : spendPct >= 80 ? "#b45309"
                           : "#6366f1",
                      fontWeight:600,
                    }}>
                      {spendPct.toFixed(1)}% of budget used
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Create budget form ──────────────────────── */}
          {showForm && (
            <div className="db-slide-down mb-8">
              <div className="rounded-2xl p-6"
                style={{
                  background:"var(--surface,#fff)",
                  border:"1px solid var(--border,#e2e8f0)",
                  boxShadow:"0 4px 24px rgba(99,102,241,0.09)",
                }}>

                <div style={{ display:"flex", alignItems:"center",
                              gap:"12px", marginBottom:"20px" }}>
                  <div style={{
                    width:"32px", height:"32px", borderRadius:"10px",
                    background:"rgba(99,102,241,0.10)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <IconPlus style={{ color:"#6366f1" }} />
                  </div>
                  <h2 style={{
                    fontSize:"1rem", fontWeight:700, margin:0,
                    color:"var(--text-primary,#0f172a)",
                  }}>
                    Create New Budget
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {FIELDS.map(f => (
                      <div key={f.name}>
                        <label style={{
                          fontSize:"0.7rem", fontWeight:700,
                          textTransform:"uppercase", letterSpacing:"0.07em",
                          color:"var(--text-muted,#94a3b8)",
                          display:"block", marginBottom:"6px",
                        }}>
                          {f.label}
                        </label>
                        <div className="db-field"
                          style={{
                            display:"flex", alignItems:"center", gap:"10px",
                            borderRadius:"12px", padding:"10px 14px",
                            background:"var(--surface-raised,#f8fafc)",
                          }}>
                          <f.Icon style={{
                            color: focused===f.name ? "#6366f1" : "#94a3b8",
                            flexShrink:0,
                          }} />
                          <input
                            type={f.type}
                            name={f.name}
                            value={form[f.name]}
                            placeholder={f.placeholder}
                            onChange={handleChange}
                            onFocus={() => setFocused(f.name)}
                            onBlur={() => setFocused("")}
                            className="db-input"
                            style={f.mono ? { fontFamily:"monospace" } : {}}
                            required
                            step={f.type==="number" ? "0.01" : undefined}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={submitting}
                    className="db-submit-btn flex items-center justify-center
                               gap-2 w-full py-3.5 rounded-xl text-white
                               text-sm font-semibold">
                    {submitting ? (
                      <>
                        <svg className="db-spin" fill="none" viewBox="0 0 24 24"
                             style={{ width:"16px", height:"16px" }}>
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                                  stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating budget…
                      </>
                    ) : (
                      <>
                        <IconCheck style={{ color:"#fff" }} />
                        Create Budget
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── Budget cards section ─────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 db-fade-up db-s3">
              <h2 style={{
                fontSize:"1rem", fontWeight:700, margin:0,
                color:"var(--text-primary,#0f172a)",
              }}>
                Your Budgets
              </h2>
              <span style={{
                padding:"2px 10px", borderRadius:"9999px",
                fontSize:"0.75rem", fontWeight:700,
                background:"rgba(99,102,241,0.10)", color:"#6366f1",
              }}>
                {budgets.length}
              </span>
            </div>

            {/* Loading skeletons */}
            {loadingBudgets ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden"
                    style={{
                      background:"var(--surface,#fff)",
                      border:"1px solid var(--border,#e2e8f0)",
                    }}>
                    <div style={{ height:"4px", background:"#e2e8f0" }} />
                    <div style={{ padding:"20px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                                    marginBottom:"14px" }}>
                        <div style={{ display:"flex", flexDirection:"column",
                                      gap:"6px", flex:1 }}>
                          <Skeleton w="55%" h="15px" />
                          <Skeleton w="35%" h="11px" />
                        </div>
                        <Skeleton w="60px" h="28px" radius="8px" />
                      </div>
                      <div className="grid grid-cols-3 gap-2" style={{ marginBottom:"14px" }}>
                        {[1,2,3].map(j => (
                          <Skeleton key={j} h="56px" radius="12px" />
                        ))}
                      </div>
                      <Skeleton h="7px" radius="9999px" />
                    </div>
                  </div>
                ))}
              </div>

            /* Empty state */
            ) : budgets.length === 0 ? (
              <div className="db-scale-in flex flex-col items-center
                              justify-center py-20 rounded-2xl gap-4"
                style={{
                  background:"var(--surface,#fff)",
                  border:"1px dashed var(--border,#e2e8f0)",
                }}>
                <div style={{
                  width:"60px", height:"60px", borderRadius:"18px",
                  background:"rgba(99,102,241,0.08)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <IconEmpty style={{ color:"#6366f1" }} />
                </div>
                <div style={{ textAlign:"center" }}>
                  <p style={{
                    fontSize:"0.9375rem", fontWeight:700, margin:0,
                    color:"var(--text-primary,#0f172a)",
                  }}>
                    No budgets yet
                  </p>
                  <p style={{
                    fontSize:"0.8rem", marginTop:"4px",
                    color:"var(--text-muted,#94a3b8)",
                  }}>
                    Create your first budget to start tracking expenses
                  </p>
                </div>
                <button onClick={() => setShowForm(true)}
                  className="db-getstarted-btn flex items-center gap-2
                             px-5 py-2.5 rounded-xl text-white text-sm font-semibold">
                  <IconPlus style={{ color:"#fff" }} />
                  Get Started
                </button>
              </div>

            /* Budget grid */
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {budgets.map((budget, i) => (
                  <div key={budget.id}
                    className="db-fade-up"
                    style={{ animationDelay:`${i * 70}ms` }}>
                    <BudgetCardWithExpenses
                      budget={budget}
                      token={token}
                      onDeleteBudget={deletedId =>
                        setBudgets(prev => prev.filter(b => b.id !== deletedId))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Chart section ───────────────────────────── */}
          <div className="db-fade-up db-s5 mb-6">
            <div style={{ display:"flex", alignItems:"center",
                          gap:"10px", marginBottom:"16px" }}>
              <div style={{
                width:"28px", height:"28px", borderRadius:"8px",
                background:"rgba(99,102,241,0.10)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <IconChart style={{ color:"#6366f1" }} />
              </div>
              <h2 style={{
                fontSize:"1rem", fontWeight:700, margin:0,
                color:"var(--text-primary,#0f172a)",
              }}>
                Spending Analytics
              </h2>
            </div>

            {loadingExpenses ? (
              <div className="rounded-2xl p-6"
                style={{
                  background:"var(--surface,#fff)",
                  border:"1px solid var(--border,#e2e8f0)",
                }}>
                <div style={{ display:"flex", flexDirection:"column",
                              alignItems:"center", gap:"12px", padding:"32px 0" }}>
                  <svg className="db-spin" fill="none" viewBox="0 0 24 24"
                       style={{ width:"28px", height:"28px", color:"#6366f1" }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p style={{ fontSize:"0.875rem", fontWeight:500, margin:0,
                              color:"var(--text-muted,#94a3b8)" }}>
                    Loading analytics…
                  </p>
                </div>
              </div>
            ) : (
              <BudgetChart
                budgets={budgets}
                expensesByBudget={expensesByBudget}
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;