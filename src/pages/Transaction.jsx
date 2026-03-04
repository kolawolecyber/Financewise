import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import TransactionChart from "../components/TransactionChart";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconPlus = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconTrash = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
         01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
         00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconArrowUp = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
const IconArrowDown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);
const IconWallet = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 10h18M3 6h18M3 14h18M3 18h18" />
  </svg>
);
const IconTag = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7
         7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828
         0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconCalendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0
         002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconText = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0
         002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
         15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconChevronDown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "16px", radius = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "tx-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ══════════════════════════════════════════════════════════════════════
   TRANSACTION
══════════════════════════════════════════════════════════════════════ */
const Transaction = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [categories,   setCategories]   = useState([]);
  const [deletingId,   setDeletingId]   = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [focused,      setFocused]      = useState("");
  const [form, setForm] = useState({
    title: "", amount: "", type: "expense", categoryId: "", date: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchTransactions().finally(() => setLoading(false));
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dateParts    = form.date.split("-");
      const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
      await API.post("/api/transactions",
        { ...form, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ title: "", amount: "", type: "expense", categoryId: "", date: "" });
      fetchTransactions();
    } catch (err) {
      console.error("Failed to create transaction", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting transaction", err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalIncome  = transactions.filter(t => t.type === "income")
                                   .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense")
                                   .reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  /* field helper */
  const fieldWrap = (id) => ({
    className: `tx-field flex items-center gap-3 rounded-xl px-3.5 py-3 border ${focused === id ? "tx-focused" : ""}`,
    style: { background: "var(--surface-raised,#f8fafc)", borderColor: "var(--border,#e2e8f0)" },
  });

  return (
    <>
      <style>{`
        @keyframes tx-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes tx-fade-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes tx-scale-in {
          from { opacity:0; transform:scale(0.94); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes tx-spin { to { transform:rotate(360deg); } }
        @keyframes tx-slide-in {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0);     }
        }

        .tx-fade-up  { animation: tx-fade-up  0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .tx-scale-in { animation: tx-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .tx-slide-in { animation: tx-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .tx-spin     { animation: tx-spin 0.9s linear infinite; }

        .tx-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border,#e2e8f0);
        }
        .tx-focused {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }
        .tx-input, .tx-select {
          outline: none; background: transparent; width: 100%;
          color: var(--text-primary,#0f172a); font-size:0.875rem;
          caret-color: #6366f1;
        }
        .tx-input::placeholder { color:#94a3b8; }
        .tx-select { appearance:none; -webkit-appearance:none; cursor:pointer; }
        .tx-select option { background: white; color:#0f172a; }

        .tx-submit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
        }
        .tx-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.50);
        }
        .tx-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .tx-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .tx-row {
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .tx-row:hover {
          background: rgba(99,102,241,0.03) !important;
          transform: translateX(3px);
          box-shadow: 0 2px 12px rgba(99,102,241,0.08);
        }

        .tx-delete-btn {
          transition: all 0.15s ease;
          opacity: 0.55;
        }
        .tx-delete-btn:hover {
          opacity: 1;
          background: rgba(239,68,68,0.10) !important;
          color: #ef4444 !important;
          transform: scale(1.08);
        }

        .tx-stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tx-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.12) !important;
        }

        .tx-type-btn { transition: all 0.18s ease; }
        .tx-type-btn:hover { opacity: 0.88; }

        /* stagger */
        .tx-s1 { animation-delay:  50ms; }
        .tx-s2 { animation-delay: 100ms; }
        .tx-s3 { animation-delay: 150ms; }
        .tx-s4 { animation-delay: 200ms; }
        .tx-s5 { animation-delay: 250ms; }
        .tx-s6 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen pb-24" style={{ background: "var(--bg,#f0f2ff)" }}>
      

        <div className="max-w-5xl mx-auto px-4 pt-8">

          {/* ── Page header ─────────────────────────────── */}
          <div className="mb-8 tx-fade-up">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "var(--text-primary,#0f172a)" }}>
              Transactions
            </h1>
            <p className="text-sm mt-1"
               style={{ color: "var(--text-secondary,#64748b)" }}>
              Add, view, and analyze your income and expenses
            </p>
          </div>

          {/* ── Stat strip ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Income", value: totalIncome,
                icon: IconArrowUp,
                iconBg: "rgba(34,197,94,0.12)", iconColor: "#22c55e",
                valueColor: "#16a34a",
                border: "rgba(34,197,94,0.20)",
                glow: "0 4px 20px rgba(34,197,94,0.12)",
                delay: "tx-s1",
              },
              {
                label: "Total Expenses", value: totalExpense,
                icon: IconArrowDown,
                iconBg: "rgba(239,68,68,0.12)", iconColor: "#ef4444",
                valueColor: "#dc2626",
                border: "rgba(239,68,68,0.20)",
                glow: "0 4px 20px rgba(239,68,68,0.10)",
                delay: "tx-s2",
              },
              {
                label: "Balance", value: balance,
                icon: IconWallet,
                iconBg: "rgba(99,102,241,0.12)", iconColor: "#6366f1",
                valueColor: balance >= 0 ? "#6366f1" : "#dc2626",
                border: "rgba(99,102,241,0.20)",
                glow: "0 4px 20px rgba(99,102,241,0.12)",
                delay: "tx-s3",
              },
            ].map(s => (
              <div key={s.label}
                className={`tx-stat-card tx-fade-up ${s.delay} rounded-2xl p-5 flex items-center gap-4`}
                style={{
                  background: "var(--surface,#fff)",
                  border: `1px solid ${s.border}`,
                  boxShadow: s.glow,
                }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: s.iconBg }}>
                  <s.icon className="w-5 h-5" style={{ color: s.iconColor, width:"20px", height:"20px" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium mb-0.5"
                     style={{ color: "var(--text-muted,#94a3b8)" }}>{s.label}</p>
                  <p className="text-xl font-bold truncate font-mono"
                     style={{ color: s.valueColor }}>
                    ₦{s.value.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Main grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left — form + list */}
            <div className="lg:col-span-3 space-y-6">

              {/* ── Add transaction form ─────────────────── */}
              <div className="tx-fade-up tx-s2 rounded-2xl p-6"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
                }}>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.10)" }}>
                    <IconPlus className="w-4 h-4" style={{ color: "#6366f1", width:"16px", height:"16px" }} />
                  </div>
                  <h2 className="text-base font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    Add Transaction
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Type toggle */}
                  <div className="flex rounded-xl overflow-hidden p-1 gap-1"
                    style={{ background: "var(--surface-raised,#f8fafc)", border: "1px solid var(--border,#e2e8f0)" }}>
                    {["expense","income"].map(t => (
                      <button key={t} type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className="tx-type-btn flex-1 flex items-center justify-center gap-2
                                   py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: form.type === t
                            ? t === "income"
                              ? "linear-gradient(135deg,#22c55e,#16a34a)"
                              : "linear-gradient(135deg,#ef4444,#dc2626)"
                            : "transparent",
                          color: form.type === t ? "#fff" : "var(--text-muted,#94a3b8)",
                          boxShadow: form.type === t
                            ? t === "income"
                              ? "0 2px 10px rgba(34,197,94,0.30)"
                              : "0 2px 10px rgba(239,68,68,0.28)"
                            : "none",
                        }}>
                        {t === "income"
                          ? <IconArrowUp   className="w-3.5 h-3.5" style={{ width:"14px", height:"14px", color: form.type === t ? "#fff" : "#94a3b8" }} />
                          : <IconArrowDown className="w-3.5 h-3.5" style={{ width:"14px", height:"14px", color: form.type === t ? "#fff" : "#94a3b8" }} />}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>Title</label>
                    <div {...fieldWrap("title")}>
                      <IconText className="w-4 h-4 shrink-0"
                        style={{ color: focused === "title" ? "#6366f1" : "#94a3b8", width:"16px", height:"16px" }} />
                      <input type="text" name="title" placeholder="e.g. Grocery shopping"
                        value={form.title} onChange={handleChange} required
                        onFocus={() => setFocused("title")} onBlur={() => setFocused("")}
                        className="tx-input" />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>Amount</label>
                    <div {...fieldWrap("amount")}>
                      <span className="text-sm font-bold shrink-0"
                            style={{ color: "#6366f1" }}>₦</span>
                      <input type="number" name="amount" placeholder="0.00"
                        value={form.amount} onChange={handleChange} required
                        onFocus={() => setFocused("amount")} onBlur={() => setFocused("")}
                        className="tx-input font-mono" />
                    </div>
                  </div>

                  {/* Category + Date row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest"
                             style={{ color: "var(--text-muted,#94a3b8)" }}>Category</label>
                      <div {...fieldWrap("category")} style={{
                        ...fieldWrap("category").style, position: "relative" }}>
                        <IconTag className="w-4 h-4 shrink-0"
                          style={{ color: focused === "category" ? "#6366f1" : "#94a3b8", width:"16px", height:"16px" }} />
                        <select name="categoryId" value={form.categoryId}
                          onChange={handleChange}
                          onFocus={() => setFocused("category")} onBlur={() => setFocused("")}
                          className="tx-select text-sm">
                          <option value="">Select category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                          ))}
                        </select>
                        <IconChevronDown className="w-4 h-4 shrink-0 pointer-events-none"
                          style={{ color: "#94a3b8", width:"16px", height:"16px" }} />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest"
                             style={{ color: "var(--text-muted,#94a3b8)" }}>Date</label>
                      <div {...fieldWrap("date")}>
                        <IconCalendar className="w-4 h-4 shrink-0"
                          style={{ color: focused === "date" ? "#6366f1" : "#94a3b8", width:"16px", height:"16px" }} />
                        <input type="date" name="date" value={form.date}
                          onChange={handleChange}
                          onFocus={() => setFocused("date")} onBlur={() => setFocused("")}
                          className="tx-input text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={submitting}
                    className="tx-submit-btn w-full flex items-center justify-center
                               gap-2 py-3.5 rounded-xl text-white font-semibold text-sm">
                    {submitting ? (
                      <>
                        <svg className="tx-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                                  stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Adding…
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" style={{ color:"#fff", width:"16px", height:"16px" }} />
                        Add Transaction
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* ── Transaction list ─────────────────────── */}
              <div className="tx-fade-up tx-s3 rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
                }}>

                <div className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid var(--border,#e2e8f0)" }}>
                  <h2 className="text-base font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    All Transactions
                  </h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(99,102,241,0.10)", color: "#6366f1" }}>
                    {transactions.length} total
                  </span>
                </div>

                {loading ? (
                  <div className="p-5 space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "var(--surface-raised,#f8fafc)" }}>
                        <Skeleton w="44px" h="44px" radius="12px" />
                        <div className="flex-1 space-y-2">
                          <Skeleton w="140px" h="13px" />
                          <Skeleton w="100px" h="11px" />
                        </div>
                        <Skeleton w="70px" h="13px" />
                      </div>
                    ))}
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.08)" }}>
                      <IconEmpty className="w-7 h-7" style={{ color: "#6366f1", width:"28px", height:"28px" }} />
                    </div>
                    <p className="text-sm font-semibold"
                       style={{ color: "var(--text-primary,#0f172a)" }}>
                      No transactions yet
                    </p>
                    <p className="text-xs"
                       style={{ color: "var(--text-muted,#94a3b8)" }}>
                      Add your first transaction above
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--border-subtle,#f1f5f9)" }}>
                    {transactions.map((t, i) => (
                      <div key={t.id}
                        className={`tx-row flex items-center gap-4 px-5 py-4 tx-slide-in`}
                        style={{
                          background: "var(--surface,#fff)",
                          animationDelay: `${i * 40}ms`,
                        }}>

                        {/* Avatar bubble */}
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center
                                        shrink-0 text-white font-bold text-sm"
                          style={{
                            background: t.type === "income"
                              ? "linear-gradient(135deg,#22c55e,#16a34a)"
                              : "linear-gradient(135deg,#ef4444,#dc2626)",
                            boxShadow: t.type === "income"
                              ? "0 2px 8px rgba(34,197,94,0.30)"
                              : "0 2px 8px rgba(239,68,68,0.28)",
                          }}>
                          {t.title?.charAt(0)?.toUpperCase() || "T"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate"
                             style={{ color: "var(--text-primary,#0f172a)" }}>
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: t.type === "income"
                                  ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
                                color: t.type === "income" ? "#16a34a" : "#dc2626",
                              }}>
                              {t.type}
                            </span>
                            <span className="text-xs"
                                  style={{ color: "var(--text-muted,#94a3b8)" }}>
                              {t.category?.name || "No Category"} · {t.date}
                            </span>
                          </div>
                        </div>

                        {/* Amount + delete */}
                        <div className="flex items-center gap-3 shrink-0">
                          <p className="text-sm font-bold font-mono"
                            style={{ color: t.type === "income" ? "#16a34a" : "#dc2626" }}>
                            {t.type === "income" ? "+" : "−"}₦{Number(t.amount).toLocaleString()}
                          </p>
                          <button onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                            className="tx-delete-btn w-8 h-8 rounded-lg flex items-center
                                       justify-center border"
                            style={{
                              color: "var(--text-muted,#94a3b8)",
                              borderColor: "var(--border,#e2e8f0)",
                              background: "transparent",
                            }}>
                            {deletingId === t.id ? (
                              <svg className="tx-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <IconTrash className="w-3.5 h-3.5"
                                style={{ width:"14px", height:"14px" }} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right sidebar ───────────────────────────── */}
            <aside className="lg:col-span-2 space-y-5">

              {/* Summary table card */}
              <div className="tx-fade-up tx-s4 rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
                }}>
                <div className="px-5 py-4"
                  style={{ borderBottom: "1px solid var(--border,#e2e8f0)" }}>
                  <h3 className="text-sm font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    Summary
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: "Income",   value: totalIncome,  color: "#16a34a", bg: "rgba(34,197,94,0.08)",   icon: IconArrowUp   },
                    { label: "Expenses", value: totalExpense, color: "#dc2626", bg: "rgba(239,68,68,0.08)",   icon: IconArrowDown },
                    { label: "Balance",  value: balance,
                      color: balance >= 0 ? "#6366f1" : "#dc2626",
                      bg: balance >= 0 ? "rgba(99,102,241,0.08)" : "rgba(239,68,68,0.08)",
                      icon: IconWallet },
                  ].map((r, i) => (
                    <div key={r.label}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl"
                      style={{ background: r.bg }}>
                      <div className="flex items-center gap-2.5">
                        <r.icon className="w-4 h-4" style={{ color: r.color, width:"16px", height:"16px" }} />
                        <span className="text-sm font-medium"
                              style={{ color: "var(--text-secondary,#64748b)" }}>
                          {r.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold font-mono"
                            style={{ color: r.color }}>
                        ₦{r.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart card */}
              <div className="tx-fade-up tx-s5 rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
                }}>
                <div className="px-5 py-4"
                  style={{ borderBottom: "1px solid var(--border,#e2e8f0)" }}>
                  <h3 className="text-sm font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    Overview
                  </h3>
                </div>
                <div className="p-4">
                  <TransactionChart transactions={transactions} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction;