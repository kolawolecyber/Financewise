import { useEffect, useState } from "react";
import API from "../services/api";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconTrash = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
         01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
         00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconEdit = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
         002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
         15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconCheck = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconX = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconPlus = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconText = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
);
const IconWallet = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10h18M3 6h18M3 14h18M3 18h18" />
  </svg>
);
const IconCalendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0
         00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconTag = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0
         010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0
         013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconEmpty = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
         002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
         002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

/* ── Mini progress bar ──────────────────────────────────────────────── */
const ProgressBar = ({ pct, color, danger }) => (
  <div style={{
    width: "100%", height: "7px", borderRadius: "9999px",
    background: "var(--border,#e2e8f0)", overflow: "hidden",
  }}>
    <div style={{
      width: `${Math.min(pct, 100)}%`, height: "100%",
      borderRadius: "9999px",
      background: danger ? "linear-gradient(90deg,#ef4444,#dc2626)"
                         : color || "linear-gradient(90deg,#6366f1,#8b5cf6)",
      boxShadow: danger
        ? "0 0 8px rgba(239,68,68,0.35)"
        : "0 0 8px rgba(99,102,241,0.30)",
      transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
      animation: "bc-bar 0.8s cubic-bezier(0.16,1,0.3,1) both",
    }} />
  </div>
);

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "14px", radius = "6px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "bc-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ══════════════════════════════════════════════════════════════════════
   BUDGET CARD WITH EXPENSES
══════════════════════════════════════════════════════════════════════ */
const BudgetCardWithExpenses = ({ budget, token, onDeleteBudget }) => {

  const [expenses,    setExpenses]    = useState([]);
  const [loadingExp,  setLoadingExp]  = useState(true);
  const [editingId,   setEditingId]   = useState(null);
  const [editForm,    setEditForm]    = useState({ title:"", amount:"" });
  const [form,        setForm]        = useState({ title:"", amount:"" });
  const [submitting,  setSubmitting]  = useState(false);
  const [deletingExp, setDeletingExp] = useState(null);
  const [deletingBud, setDeletingBud] = useState(false);
  const [savingId,    setSavingId]    = useState(null);
  const [focused,     setFocused]     = useState("");
  const [collapsed,   setCollapsed]   = useState(false);

  const totalSpent = budget.totalSpent  || 0;
  const remaining  = budget.remaining   || 0;
  const pct        = budget.amount > 0
    ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;
  const isOver     = totalSpent > budget.amount;
  const isWarn     = pct >= 80 && !isOver;

  /* colour logic */
  const barColor   = isOver  ? undefined
                   : isWarn  ? "linear-gradient(90deg,#f59e0b,#d97706)"
                   :           "linear-gradient(90deg,#6366f1,#8b5cf6)";
  const pctColor   = isOver  ? "#dc2626"
                   : isWarn  ? "#b45309"
                   : pct >= 50 ? "#6366f1"
                   :            "#22c55e";

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoadingExp(true);
      try {
        const res = await API.get(`/api/expenses/${budget.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setLoadingExp(false);
      }
    };
    fetchExpenses();
  }, [budget.id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/api/expenses", {
        description: form.title,
        amount:      form.amount,
        category:    budget.category,
        date:        new Date().toISOString(),
        userId:      budget.userId,
        budgetId:    budget.id,
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data?.id) {
        setExpenses(prev => [...prev, res.data]);
        setForm({ title:"", amount:"" });
      }
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Error adding expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setDeletingExp(expenseId);
    try {
      await API.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setDeletingExp(null);
    }
  };

  const handleUpdateExpense = async (expenseId) => {
    setSavingId(expenseId);
    try {
      const res = await API.put(`/api/expenses/${expenseId}`, {
        description: editForm.title,
        amount:      editForm.amount,
        date:        new Date().toISOString(),
        category:    budget.category,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setExpenses(prev => prev.map(e => e.id === expenseId ? res.data : e));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Update failed");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteBudget = async () => {
    setDeletingBud(true);
    try {
      await API.delete(`/api/budgets/${budget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDeleteBudget) onDeleteBudget(budget.id);
    } catch (err) {
      console.error("Failed to delete budget:", err);
      alert("Failed to delete budget.");
    } finally {
      setDeletingBud(false);
    }
  };

  /* field wrapper */
  const fw = (id) => ({
    style: {
      display:"flex", alignItems:"center", gap:"10px",
      borderRadius:"12px", padding:"10px 14px",
      background: "var(--surface-raised,#f8fafc)",
      border: `1.5px solid ${focused===id ? "#6366f1" : "var(--border,#e2e8f0)"}`,
      boxShadow: focused===id ? "0 0 0 3px rgba(99,102,241,0.16)" : "none",
      transition:"border-color 0.2s ease, box-shadow 0.2s ease",
    }
  });

  return (
    <>
      <style>{`
        @keyframes bc-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes bc-fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes bc-scale-in {
          from { opacity:0; transform:scale(0.95); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes bc-slide-down {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes bc-bar { from { width:0; } }
        @keyframes bc-spin { to { transform:rotate(360deg); } }

        .bc-fade-up   { animation: bc-fade-up   0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .bc-scale-in  { animation: bc-scale-in  0.3s  cubic-bezier(0.34,1.56,0.64,1) both; }
        .bc-slide-down{ animation: bc-slide-down 0.3s  cubic-bezier(0.16,1,0.3,1) both; }
        .bc-spin      { animation: bc-spin 0.9s linear infinite; }

        .bc-input {
          outline:none; background:transparent; width:100%;
          font-size:0.875rem; caret-color:#6366f1;
          color: var(--text-primary,#0f172a);
          border: none;
        }
        .bc-input::placeholder { color:#94a3b8; }

        .bc-submit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .bc-submit-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(99,102,241,0.50);
        }
        .bc-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .bc-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .bc-save-btn {
          transition: all 0.18s ease;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          box-shadow: 0 2px 8px rgba(34,197,94,0.28);
        }
        .bc-save-btn:hover:not(:disabled) {
          transform:translateY(-1px);
          box-shadow:0 4px 14px rgba(34,197,94,0.42);
        }
        .bc-save-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .bc-delete-budget-btn {
          transition: all 0.18s ease;
        }
        .bc-delete-budget-btn:hover:not(:disabled) {
          background: rgba(239,68,68,0.10) !important;
          color: #ef4444 !important;
          border-color: rgba(239,68,68,0.25) !important;
        }
        .bc-delete-budget-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .bc-exp-row {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .bc-exp-row:hover { background: rgba(99,102,241,0.03) !important; }

        .bc-icon-btn {
          transition: all 0.15s ease; opacity:0.5;
        }
        .bc-exp-row:hover .bc-icon-btn { opacity:1; }
        .bc-icon-btn:hover {
          transform: scale(1.08);
          background: rgba(99,102,241,0.10) !important;
          color: #6366f1 !important;
        }
        .bc-icon-btn-danger:hover {
          background: rgba(239,68,68,0.10) !important;
          color: #ef4444 !important;
        }

        .bc-collapse-btn { transition: transform 0.25s ease; }
      `}</style>

      <div className="bc-fade-up rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface,#fff)",
          border: isOver
            ? "1px solid rgba(239,68,68,0.30)"
            : isWarn
            ? "1px solid rgba(245,158,11,0.30)"
            : "1px solid var(--border,#e2e8f0)",
          boxShadow: isOver
            ? "0 2px 16px rgba(239,68,68,0.08)"
            : "0 2px 16px rgba(99,102,241,0.07)",
        }}>

        {/* ── Status accent bar ─────────────────────── */}
        <div style={{
          height: "4px",
          background: isOver ? "linear-gradient(90deg,#ef4444,#dc2626)"
                     : isWarn ? "linear-gradient(90deg,#f59e0b,#d97706)"
                     :          "linear-gradient(90deg,#6366f1,#8b5cf6)",
        }} />

        {/* ── Card header ───────────────────────────── */}
        <div style={{ padding:"20px 20px 0" }}>
          <div style={{ display:"flex", alignItems:"flex-start",
                        justifyContent:"space-between", gap:"12px" }}>

            {/* Title + meta */}
            <div style={{ flex:1, minWidth:0 }}>
              <h2 style={{
                fontSize:"1rem", fontWeight:700, margin:0,
                color:"var(--text-primary,#0f172a)",
                letterSpacing:"-0.01em",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
              }}>
                {budget.title}
              </h2>

              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"8px" }}>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:"4px",
                  fontSize:"0.7rem", fontWeight:600,
                  padding:"2px 8px", borderRadius:"9999px",
                  background:"rgba(99,102,241,0.08)", color:"#6366f1",
                }}>
                  <IconTag style={{ width:"10px", height:"10px", color:"#6366f1" }} />
                  {budget.category}
                </span>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:"4px",
                  fontSize:"0.7rem", fontWeight:600,
                  padding:"2px 8px", borderRadius:"9999px",
                  background:"rgba(6,182,212,0.08)", color:"#0891b2",
                }}>
                  <IconCalendar style={{ width:"10px", height:"10px", color:"#0891b2" }} />
                  {budget.month}
                </span>
                {isOver && (
                  <span style={{
                    fontSize:"0.7rem", fontWeight:700,
                    padding:"2px 8px", borderRadius:"9999px",
                    background:"rgba(239,68,68,0.10)", color:"#dc2626",
                    border:"1px solid rgba(239,68,68,0.20)",
                  }}>
                    ⚠ Over budget
                  </span>
                )}
                {isWarn && (
                  <span style={{
                    fontSize:"0.7rem", fontWeight:700,
                    padding:"2px 8px", borderRadius:"9999px",
                    background:"rgba(245,158,11,0.10)", color:"#b45309",
                    border:"1px solid rgba(245,158,11,0.20)",
                  }}>
                    ⚡ 80%+ used
                  </span>
                )}
              </div>
            </div>

            {/* Delete budget btn */}
            <button onClick={handleDeleteBudget} disabled={deletingBud}
              className="bc-delete-budget-btn"
              style={{
                display:"flex", alignItems:"center", gap:"5px",
                padding:"6px 12px", borderRadius:"10px",
                fontSize:"0.75rem", fontWeight:600,
                color:"var(--text-muted,#94a3b8)",
                border:"1px solid var(--border,#e2e8f0)",
                background:"transparent", cursor:"pointer", shrink:0,
              }}>
              {deletingBud
                ? <svg className="bc-spin" fill="none" viewBox="0 0 24 24"
                       style={{ width:"12px", height:"12px" }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                : <IconTrash style={{ width:"12px", height:"12px" }} />}
              Delete
            </button>
          </div>

          {/* ── Budget stats ──────────────────────────── */}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:"10px", margin:"16px 0",
          }}>
            {[
              {
                label:"Budget",  value:`₦${Number(budget.amount).toLocaleString()}`,
                color:"#6366f1", bg:"rgba(99,102,241,0.08)",
                icon:<IconWallet style={{ width:"14px", height:"14px", color:"#6366f1" }} />,
              },
              {
                label:"Spent",   value:`₦${Number(totalSpent).toLocaleString()}`,
                color: isOver ? "#dc2626" : "#f59e0b",
                bg: isOver ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
                icon:<IconTrash style={{ width:"14px", height:"14px",
                                         color: isOver ? "#dc2626" : "#f59e0b" }} />,
              },
              {
                label:"Left",    value:`₦${Number(remaining).toLocaleString()}`,
                color: remaining < 0 ? "#dc2626" : "#22c55e",
                bg: remaining < 0 ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                icon:<IconCheck style={{ width:"14px", height:"14px",
                                          color: remaining < 0 ? "#dc2626" : "#22c55e" }} />,
              },
            ].map(s => (
              <div key={s.label} style={{
                padding:"10px 12px", borderRadius:"12px",
                background: s.bg, textAlign:"center",
              }}>
                <div style={{ display:"flex", justifyContent:"center",
                              marginBottom:"4px" }}>
                  {s.icon}
                </div>
                <p style={{ fontSize:"0.65rem", fontWeight:600, margin:0,
                            color:"var(--text-muted,#94a3b8)",
                            textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {s.label}
                </p>
                <p style={{ fontSize:"0.875rem", fontWeight:800, margin:0,
                            color:s.color, fontFamily:"monospace" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom:"20px" }}>
            <ProgressBar pct={pct} color={barColor} danger={isOver} />
            <div style={{ display:"flex", justifyContent:"space-between",
                          marginTop:"5px" }}>
              <span style={{ fontSize:"0.7rem",
                             color:"var(--text-muted,#94a3b8)" }}>
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize:"0.7rem", fontWeight:700,
                             color: pctColor }}>
                {pct.toFixed(1)}% used
              </span>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────── */}
        <div style={{ height:"1px", background:"var(--border,#e2e8f0)",
                      margin:"0 0 0 0" }} />

        {/* ── Add expense form ──────────────────────── */}
        <div style={{ padding:"16px 20px" }}>
          <p style={{ fontSize:"0.7rem", fontWeight:700,
                      textTransform:"uppercase", letterSpacing:"0.06em",
                      color:"var(--text-muted,#94a3b8)", margin:"0 0 10px" }}>
            Add Expense
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              <div {...fw("title")}>
                <IconText style={{ width:"14px", height:"14px", shrink:0,
                                   color: focused==="title"?"#6366f1":"#94a3b8" }} />
                <input type="text" name="title" value={form.title}
                  placeholder="Expense description"
                  onChange={handleChange}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused("")}
                  className="bc-input" required />
              </div>

              <div style={{ display:"flex", gap:"8px" }}>
                <div style={{ flex:1, ...fw("amount").style }}>
                  <span style={{ fontSize:"0.8rem", fontWeight:700,
                                 color:"#6366f1", flexShrink:0 }}>₦</span>
                  <input type="number" name="amount" value={form.amount}
                    placeholder="0.00"
                    onChange={handleChange}
                    onFocus={() => setFocused("amount")}
                    onBlur={() => setFocused("")}
                    className="bc-input"
                    style={{ fontFamily:"monospace" }} required />
                </div>

                <button type="submit" disabled={submitting}
                  className="bc-submit-btn flex items-center justify-center gap-1.5
                             text-white text-xs font-semibold rounded-xl px-4 shrink-0"
                  style={{ minWidth:"80px" }}>
                  {submitting
                    ? <svg className="bc-spin" fill="none" viewBox="0 0 24 24"
                           style={{ width:"14px", height:"14px" }}>
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    : <IconPlus style={{ width:"14px", height:"14px",
                                        color:"#fff" }} />}
                  {submitting ? "Adding…" : "Add"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Divider ───────────────────────────────── */}
        <div style={{ height:"1px", background:"var(--border,#e2e8f0)" }} />

        {/* ── Expense list ──────────────────────────── */}
        <div style={{ padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center",
                        justifyContent:"space-between", marginBottom:"10px" }}>
            <p style={{ fontSize:"0.7rem", fontWeight:700,
                        textTransform:"uppercase", letterSpacing:"0.06em",
                        color:"var(--text-muted,#94a3b8)", margin:0 }}>
              Expenses
            </p>
            <button onClick={() => setCollapsed(c => !c)}
              style={{
                display:"flex", alignItems:"center", gap:"4px",
                fontSize:"0.7rem", fontWeight:600,
                color:"var(--text-muted,#94a3b8)",
                background:"transparent", border:"none", cursor:"pointer",
              }}>
              <svg className="bc-collapse-btn" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}
                   style={{
                     width:"14px", height:"14px",
                     transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                   }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {collapsed ? "Show" : "Hide"}
            </button>
          </div>

          {!collapsed && (
            <div className="bc-slide-down">
              {loadingExp ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {[1,2].map(i => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:"10px",
                      padding:"10px 12px", borderRadius:"10px",
                      background:"var(--surface-raised,#f8fafc)",
                    }}>
                      <Skeleton w="32px" h="32px" radius="8px" />
                      <div style={{ flex:1, display:"flex",
                                    flexDirection:"column", gap:"5px" }}>
                        <Skeleton w="55%" h="12px" />
                        <Skeleton w="35%" h="10px" />
                      </div>
                      <Skeleton w="60px" h="12px" />
                    </div>
                  ))}
                </div>

              ) : expenses.length === 0 ? (
                <div style={{
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  padding:"24px 0", gap:"8px",
                }}>
                  <div style={{
                    width:"36px", height:"36px", borderRadius:"10px",
                    background:"rgba(99,102,241,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <IconEmpty style={{ width:"18px", height:"18px",
                                       color:"#6366f1" }} />
                  </div>
                  <p style={{ fontSize:"0.8rem", fontWeight:600, margin:0,
                              color:"var(--text-primary,#0f172a)" }}>
                    No expenses yet
                  </p>
                  <p style={{ fontSize:"0.7rem", margin:0,
                              color:"var(--text-muted,#94a3b8)" }}>
                    Add your first expense above
                  </p>
                </div>

              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                  {expenses.map((expense, i) => (
                    <div key={expense.id}
                      className="bc-exp-row bc-fade-up"
                      style={{
                        borderRadius:"12px",
                        background:"transparent",
                        animationDelay:`${i*40}ms`,
                      }}>

                      {editingId === expense.id ? (
                        /* ── Edit mode ────────────────────────── */
                        <div className="bc-scale-in" style={{
                          padding:"12px",
                          background:"var(--surface-raised,#f8fafc)",
                          borderRadius:"12px",
                          border:"1px solid var(--border,#e2e8f0)",
                        }}>
                          <div style={{ display:"flex", flexDirection:"column",
                                        gap:"8px", marginBottom:"8px" }}>
                            <div style={{
                              display:"flex", alignItems:"center", gap:"8px",
                              padding:"8px 12px", borderRadius:"10px",
                              background:"var(--surface,#fff)",
                              border:"1.5px solid var(--border,#e2e8f0)",
                            }}>
                              <IconText style={{ width:"13px", height:"13px",
                                                color:"#94a3b8" }} />
                              <input type="text" value={editForm.title}
                                onChange={e => setEditForm(
                                  { ...editForm, title: e.target.value }
                                )}
                                className="bc-input"
                                style={{ fontSize:"0.8125rem" }}
                                placeholder="Description" />
                            </div>
                            <div style={{
                              display:"flex", alignItems:"center", gap:"8px",
                              padding:"8px 12px", borderRadius:"10px",
                              background:"var(--surface,#fff)",
                              border:"1.5px solid var(--border,#e2e8f0)",
                            }}>
                              <span style={{ fontSize:"0.8rem", fontWeight:700,
                                             color:"#6366f1", flexShrink:0 }}>₦</span>
                              <input type="number" value={editForm.amount}
                                onChange={e => setEditForm(
                                  { ...editForm, amount: e.target.value }
                                )}
                                className="bc-input"
                                style={{ fontSize:"0.8125rem",
                                         fontFamily:"monospace" }}
                                placeholder="Amount" />
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:"8px" }}>
                            <button onClick={() => handleUpdateExpense(expense.id)}
                              disabled={savingId === expense.id}
                              className="bc-save-btn"
                              style={{
                                flex:1, display:"flex", alignItems:"center",
                                justifyContent:"center", gap:"6px",
                                padding:"8px", borderRadius:"10px",
                                color:"#fff", fontSize:"0.8rem", fontWeight:600,
                                border:"none", cursor:"pointer",
                              }}>
                              {savingId === expense.id
                                ? <svg className="bc-spin" fill="none"
                                       viewBox="0 0 24 24"
                                       style={{ width:"13px", height:"13px" }}>
                                    <circle className="opacity-25" cx="12" cy="12"
                                            r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                : <IconCheck style={{ width:"13px", height:"13px",
                                                     color:"#fff" }} />}
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)}
                              style={{
                                padding:"8px 16px", borderRadius:"10px",
                                fontSize:"0.8rem", fontWeight:600,
                                color:"var(--text-secondary,#64748b)",
                                background:"var(--surface,#fff)",
                                border:"1px solid var(--border,#e2e8f0)",
                                cursor:"pointer",
                              }}>
                              Cancel
                            </button>
                          </div>
                        </div>

                      ) : (
                        /* ── View mode ────────────────────────── */
                        <div style={{
                          display:"flex", alignItems:"center", gap:"12px",
                          padding:"10px 12px",
                        }}>
                          {/* Initial bubble */}
                          <div style={{
                            width:"34px", height:"34px", borderRadius:"10px",
                            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display:"flex", alignItems:"center",
                            justifyContent:"center", flexShrink:0,
                            color:"#fff", fontSize:"0.75rem", fontWeight:700,
                            boxShadow:"0 2px 6px rgba(99,102,241,0.28)",
                          }}>
                            {expense.description?.charAt(0)?.toUpperCase() || "E"}
                          </div>

                          {/* Description */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{
                              fontSize:"0.8125rem", fontWeight:600, margin:0,
                              color:"var(--text-primary,#0f172a)",
                              whiteSpace:"nowrap", overflow:"hidden",
                              textOverflow:"ellipsis",
                            }}>
                              {expense.description}
                            </p>
                            <p style={{
                              fontSize:"0.7rem", margin:0,
                              color:"var(--text-muted,#94a3b8)",
                            }}>
                              {expense.date
                                ? new Date(expense.date).toLocaleDateString(
                                    "en-GB", { day:"numeric", month:"short", year:"2-digit" }
                                  )
                                : "—"}
                            </p>
                          </div>

                          {/* Amount */}
                          <span style={{
                            fontSize:"0.875rem", fontWeight:700,
                            color:"#dc2626", fontFamily:"monospace", flexShrink:0,
                          }}>
                            −₦{Number(expense.amount).toLocaleString()}
                          </span>

                          {/* Action buttons */}
                          <div style={{ display:"flex", gap:"4px", flexShrink:0 }}>
                            <button
                              onClick={() => {
                                setEditingId(expense.id);
                                setEditForm({
                                  title: expense.description,
                                  amount: expense.amount,
                                });
                              }}
                              className="bc-icon-btn"
                              style={{
                                width:"28px", height:"28px", borderRadius:"8px",
                                display:"flex", alignItems:"center",
                                justifyContent:"center",
                                color:"var(--text-muted,#94a3b8)",
                                background:"transparent",
                                border:"1px solid var(--border,#e2e8f0)",
                                cursor:"pointer",
                              }}>
                              <IconEdit style={{ width:"12px", height:"12px" }} />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              disabled={deletingExp === expense.id}
                              className="bc-icon-btn bc-icon-btn-danger"
                              style={{
                                width:"28px", height:"28px", borderRadius:"8px",
                                display:"flex", alignItems:"center",
                                justifyContent:"center",
                                color:"var(--text-muted,#94a3b8)",
                                background:"transparent",
                                border:"1px solid var(--border,#e2e8f0)",
                                cursor:"pointer",
                              }}>
                              {deletingExp === expense.id
                                ? <svg className="bc-spin" fill="none"
                                       viewBox="0 0 24 24"
                                       style={{ width:"11px", height:"11px" }}>
                                    <circle className="opacity-25" cx="12" cy="12"
                                            r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                : <IconTrash style={{ width:"12px", height:"12px" }} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BudgetCardWithExpenses;