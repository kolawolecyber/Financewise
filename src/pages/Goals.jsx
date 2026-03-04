import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import GoalDonut from "../components/GoalDonut";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconTarget = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0
         002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2
         2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2
         2 0 01-2-2z" />
  </svg>
);
const IconPlus = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconEdit = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
         m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
const IconSave = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2
         4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0
         002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const IconTrophy = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42
         3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138
         3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42
         3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0
         00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
         3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42
         0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
const IconText = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 6h16M4 12h8m-8 6h16" />
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
    animation: "gl-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ── Progress bar ───────────────────────────────────────────────────── */
const ProgressBar = ({ pct, color }) => (
  <div className="w-full rounded-full overflow-hidden"
    style={{ height: "8px", background: "var(--border,#e2e8f0)" }}>
    <div className="h-full rounded-full gl-bar"
      style={{
        width: `${pct}%`,
        background: color,
        transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: `0 0 8px ${color}60`,
      }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   GOALS
══════════════════════════════════════════════════════════════════════ */
const Goals = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [goals,         setGoals]         = useState([]);
  const [amountsToSave, setAmountsToSave] = useState({});
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [deletingId,    setDeletingId]    = useState(null);
  const [savingId,      setSavingId]      = useState(null);
  const [editingId,     setEditingId]     = useState(null);
  const [focused,       setFocused]       = useState("");

  const [editForm, setEditForm] = useState({
    title: "", targetAmount: "", targetDate: "",
  });
  const [form, setForm] = useState({
    title: "", targetAmount: "", dueDate: "",
  });

  const activeGoals   = goals.filter(g => g.savedAmount < g.targetAmount);
  const achievedGoals = goals.filter(g => g.savedAmount >= g.targetAmount);

  useEffect(() => {
    if (!token) { navigate("/pages/login"); return; }
    setLoading(true);
    fetchGoals().finally(() => setLoading(false));
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const [year, month, day] = form.dueDate.split("-");
      const formattedDate = `${month.padStart(2,"0")}/${day.padStart(2,"0")}/${year}`;
      const goalData = {
        title: form.title,
        targetAmount: parseFloat(form.targetAmount),
        targetDate: formattedDate,
      };
      const res = await API.post("/api/goals", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(prev => [...prev, res.data]);
      setForm({ title: "", targetAmount: "", dueDate: "" });
    } catch (err) {
      console.error("Goal creation failed:", err.response?.data || err.message);
      alert("Error creating goal: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGoal = async (e, goalId) => {
    e.preventDefault();
    setEditingId(goalId);
    try {
      const [year, month, day] = editForm.targetDate.split("-");
      const formattedDate = `${month.padStart(2,"0")}/${day.padStart(2,"0")}/${year}`;
      const res = await API.put(
        `/api/goals/${goalId}`,
        { title: editForm.title, targetAmount: parseFloat(editForm.targetAmount), targetDate: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...res.data } : g));
      setEditingGoalId(null);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to edit goal");
    } finally {
      setEditingId(null);
    }
  };

  const handleAddToSavings = async (e, goalId) => {
    e.preventDefault();
    const amount = parseFloat(amountsToSave[goalId]);
    if (!amount || amount <= 0) return;
    setSavingId(goalId);
    try {
      const res = await API.put(`/api/goals/${goalId}/save`, { amount }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(prev => prev.map(g =>
        g.id === goalId ? { ...g, savedAmount: res.data.savedAmount } : g
      ));
      setAmountsToSave(prev => ({ ...prev, [goalId]: "" }));
    } catch (err) {
      console.error("Error updating savings:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await API.delete(`/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
    } finally {
      setDeletingId(null);
    }
  };

  /* field wrapper helper */
  const fw = (id) => ({
    className: `gl-field flex items-center gap-3 rounded-xl px-3.5 py-3 border${focused === id ? " gl-focused" : ""}`,
    style: { background: "var(--surface-raised,#f8fafc)", borderColor: "var(--border,#e2e8f0)" },
  });

  return (
    <>
      <style>{`
        @keyframes gl-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes gl-fade-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes gl-scale-in {
          from { opacity:0; transform:scale(0.94); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes gl-slide-down {
          from { opacity:0; transform:translateY(-10px); max-height:0; }
          to   { opacity:1; transform:translateY(0);     max-height:600px; }
        }
        @keyframes gl-spin { to { transform:rotate(360deg); } }
        @keyframes gl-bar  { from { width:0; } }
        @keyframes gl-pop  {
          0%   { transform:scale(1);    }
          50%  { transform:scale(1.06); }
          100% { transform:scale(1);    }
        }

        .gl-fade-up   { animation: gl-fade-up   0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .gl-scale-in  { animation: gl-scale-in  0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .gl-slide-down{ animation: gl-slide-down 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .gl-spin      { animation: gl-spin 0.9s linear infinite; }
        .gl-bar       { animation: gl-bar  0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .gl-pop       { animation: gl-pop  0.4s ease both; }

        .gl-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border,#e2e8f0);
        }
        .gl-focused {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }
        .gl-input, .gl-select {
          outline:none; background:transparent; width:100%;
          color: var(--text-primary,#0f172a);
          font-size:0.875rem; caret-color:#6366f1;
        }
        .gl-input::placeholder { color:#94a3b8; }
        .gl-select { appearance:none; -webkit-appearance:none; cursor:pointer; }

        .gl-submit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
        }
        .gl-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(99,102,241,0.50);
        }
        .gl-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .gl-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .gl-save-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          box-shadow: 0 2px 10px rgba(34,197,94,0.30);
        }
        .gl-save-btn:hover:not(:disabled) {
          transform:translateY(-1px);
          box-shadow: 0 4px 16px rgba(34,197,94,0.45);
        }
        .gl-save-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .gl-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .gl-card:hover {
          box-shadow: 0 8px 30px rgba(99,102,241,0.10) !important;
          transform: translateY(-2px);
        }

        .gl-delete-btn {
          transition: all 0.15s ease; opacity:0.5;
        }
        .gl-delete-btn:hover {
          opacity:1;
          background: rgba(239,68,68,0.10) !important;
          color: #ef4444 !important;
          transform: scale(1.08);
        }
        .gl-edit-btn {
          transition: all 0.15s ease; opacity:0.6;
        }
        .gl-edit-btn:hover {
          opacity:1;
          background: rgba(99,102,241,0.10) !important;
          color: #6366f1 !important;
        }

        /* stagger */
        .gl-s1 { animation-delay:  60ms; }
        .gl-s2 { animation-delay: 120ms; }
        .gl-s3 { animation-delay: 180ms; }
        .gl-s4 { animation-delay: 240ms; }
        .gl-s5 { animation-delay: 300ms; }
        .gl-s6 { animation-delay: 360ms; }
      `}</style>

      <div className="min-h-screen pb-24" style={{ background: "var(--bg,#f0f2ff)" }}>
  

        <div className="max-w-5xl mx-auto px-4 pt-8">

          {/* ── Page header ─────────────────────────────── */}
          <div className="flex items-start justify-between mb-8 gl-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary,#0f172a)" }}>
                Financial Goals
              </h1>
              <p className="text-sm mt-1"
                 style={{ color: "var(--text-secondary,#64748b)" }}>
                Track your savings and reach every milestone
              </p>
            </div>
            {/* Stats pills */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(99,102,241,0.10)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.18)" }}>
                <IconTarget className="w-3.5 h-3.5" style={{ color:"#6366f1", width:"14px", height:"14px" }} />
                {activeGoals.length} Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(34,197,94,0.10)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.18)" }}>
                <IconTrophy className="w-3.5 h-3.5" style={{ color:"#16a34a", width:"14px", height:"14px" }} />
                {achievedGoals.length} Achieved
              </div>
            </div>
          </div>

          {/* ── Main grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Add goal form (sticky sidebar) ──────── */}
            <div className="lg:col-span-1">
              <div className="gl-fade-up gl-s1 rounded-2xl p-6 lg:sticky lg:top-6"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
                }}>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.10)" }}>
                    <IconPlus className="w-4 h-4" style={{ color:"#6366f1", width:"16px", height:"16px" }} />
                  </div>
                  <h2 className="text-base font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    New Goal
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>Goal Title</label>
                    <div {...fw("title")}>
                      <IconText className="w-4 h-4 shrink-0"
                        style={{ color: focused==="title"?"#6366f1":"#94a3b8", width:"16px", height:"16px" }} />
                      <input type="text" name="title" value={form.title}
                        placeholder="e.g. Buy a laptop"
                        onChange={handleChange}
                        onFocus={() => setFocused("title")}
                        onBlur={() => setFocused("")}
                        className="gl-input" required />
                    </div>
                  </div>

                  {/* Target amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>Target Amount</label>
                    <div {...fw("amount")}>
                      <span className="text-sm font-bold shrink-0" style={{ color:"#22c55e" }}>₦</span>
                      <input type="number" name="targetAmount" value={form.targetAmount}
                        placeholder="0.00"
                        onChange={handleChange}
                        onFocus={() => setFocused("amount")}
                        onBlur={() => setFocused("")}
                        className="gl-input font-mono" required />
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>Due Date</label>
                    <div {...fw("dueDate")}>
                      <IconCalendar className="w-4 h-4 shrink-0"
                        style={{ color: focused==="dueDate"?"#6366f1":"#94a3b8", width:"16px", height:"16px" }} />
                      <input type="date" name="dueDate" value={form.dueDate}
                        onChange={handleChange}
                        onFocus={() => setFocused("dueDate")}
                        onBlur={() => setFocused("")}
                        className="gl-input text-sm" required />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="gl-submit-btn w-full flex items-center justify-center
                               gap-2 py-3.5 rounded-xl text-white font-semibold text-sm">
                    {submitting ? (
                      <>
                        <svg className="gl-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                                  stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4" style={{ color:"#fff", width:"16px", height:"16px" }} />
                        Create Goal
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Goals lists ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* ── Active Goals ─────────────────────── */}
              <section>
                <div className="flex items-center gap-3 mb-4 gl-fade-up gl-s2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.10)" }}>
                    <IconTarget className="w-3.5 h-3.5"
                      style={{ color:"#6366f1", width:"14px", height:"14px" }} />
                  </div>
                  <h2 className="text-base font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    Active Goals
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(99,102,241,0.10)", color:"#6366f1" }}>
                    {activeGoals.length}
                  </span>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1,2].map(i => (
                      <div key={i} className="rounded-2xl p-5"
                        style={{ background:"var(--surface,#fff)", border:"1px solid var(--border,#e2e8f0)" }}>
                        <div className="flex items-center gap-3 mb-4">
                          <Skeleton w="48px" h="48px" radius="12px" />
                          <div className="flex-1 space-y-2">
                            <Skeleton w="60%" h="14px" />
                            <Skeleton w="40%" h="12px" />
                          </div>
                        </div>
                        <Skeleton w="100%" h="8px" radius="4px" />
                      </div>
                    ))}
                  </div>
                ) : activeGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-2xl gap-3 gl-scale-in"
                    style={{ background:"var(--surface,#fff)", border:"1px dashed var(--border,#e2e8f0)" }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background:"rgba(99,102,241,0.08)" }}>
                      <IconEmpty className="w-6 h-6" style={{ color:"#6366f1", width:"24px", height:"24px" }} />
                    </div>
                    <p className="text-sm font-semibold"
                       style={{ color:"var(--text-primary,#0f172a)" }}>No active goals yet</p>
                    <p className="text-xs"
                       style={{ color:"var(--text-muted,#94a3b8)" }}>Create your first goal using the form</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeGoals.map((goal, i) => {
                      const pct = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                      const remaining = goal.targetAmount - goal.savedAmount;
                      const isEditing = editingGoalId === goal.id;

                      /* progress colour based on % */
                      const barColor = pct >= 75 ? "#22c55e"
                                     : pct >= 40 ? "#6366f1"
                                     :             "#f59e0b";

                      return (
                        <div key={goal.id}
                          className={`gl-card gl-fade-up gl-s${Math.min(i+2,6)} rounded-2xl overflow-hidden`}
                          style={{
                            background: "var(--surface,#fff)",
                            border: "1px solid var(--border,#e2e8f0)",
                            boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
                          }}>

                          <div className="p-5">
                            {/* Top row */}
                            <div className="flex items-start gap-4">
                              {/* Donut */}
                              <div className="shrink-0">
                                <GoalDonut goal={goal} />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-bold truncate"
                                      style={{ color:"var(--text-primary,#0f172a)" }}>
                                    {goal.title}
                                  </h3>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingGoalId(isEditing ? null : goal.id);
                                        setEditForm({
                                          title: goal.title,
                                          targetAmount: goal.targetAmount,
                                          targetDate: goal.targetDate?.split("T")[0] || "",
                                        });
                                      }}
                                      className="gl-edit-btn w-7 h-7 rounded-lg flex items-center
                                                 justify-center border"
                                      style={{ borderColor:"var(--border,#e2e8f0)", color:"var(--text-muted,#94a3b8)" }}>
                                      {isEditing
                                        ? <IconX className="w-3.5 h-3.5" style={{ width:"14px", height:"14px" }} />
                                        : <IconEdit className="w-3.5 h-3.5" style={{ width:"14px", height:"14px" }} />}
                                    </button>
                                    <button
                                      onClick={() => handleDelete(goal.id)}
                                      disabled={deletingId === goal.id}
                                      className="gl-delete-btn w-7 h-7 rounded-lg flex items-center
                                                 justify-center border"
                                      style={{ borderColor:"var(--border,#e2e8f0)", color:"var(--text-muted,#94a3b8)" }}>
                                      {deletingId === goal.id
                                        ? <svg className="gl-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                    stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                          </svg>
                                        : <IconTrash className="w-3.5 h-3.5" style={{ width:"14px", height:"14px" }} />}
                                    </button>
                                  </div>
                                </div>

                                {/* Stat chips */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ background:"rgba(34,197,94,0.10)", color:"#16a34a" }}>
                                    ₦{goal.savedAmount?.toLocaleString()} saved
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ background:"rgba(245,158,11,0.10)", color:"#b45309" }}>
                                    ₦{remaining.toLocaleString()} left
                                  </span>
                                  {goal.targetDate && (
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                      style={{ background:"rgba(99,102,241,0.08)", color:"#6366f1" }}>
                                      📅 {goal.targetDate?.split("T")[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4 space-y-1.5">
                              <ProgressBar pct={pct} color={barColor} />
                              <div className="flex items-center justify-between">
                                <span className="text-xs"
                                      style={{ color:"var(--text-muted,#94a3b8)" }}>
                                  Target: ₦{goal.targetAmount?.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold" style={{ color: barColor }}>
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Add to savings */}
                            <form onSubmit={e => handleAddToSavings(e, goal.id)}
                              className="flex gap-2 mt-4">
                              <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 border"
                                style={{
                                  background:"var(--surface-raised,#f8fafc)",
                                  borderColor:"var(--border,#e2e8f0)",
                                }}>
                                <span className="text-xs font-bold" style={{ color:"#22c55e" }}>₦</span>
                                <input type="number"
                                  value={amountsToSave[goal.id] || ""}
                                  onChange={e => setAmountsToSave(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                  placeholder="Amount to save"
                                  className="gl-input text-sm"
                                  style={{ fontSize:"0.8125rem" }} />
                              </div>
                              <button type="submit"
                                disabled={savingId === goal.id}
                                className="gl-save-btn flex items-center gap-1.5 px-4 py-2.5
                                           rounded-xl text-white text-xs font-semibold shrink-0">
                                {savingId === goal.id ? (
                                  <svg className="gl-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : (
                                  <IconSave className="w-3.5 h-3.5" style={{ color:"#fff", width:"14px", height:"14px" }} />
                                )}
                                Save
                              </button>
                            </form>
                          </div>

                          {/* Inline edit form */}
                          {isEditing && (
                            <div className="gl-slide-down px-5 pb-5 pt-1"
                              style={{ borderTop:"1px solid var(--border,#e2e8f0)" }}>
                              <p className="text-xs font-semibold uppercase tracking-widest mb-3 pt-4"
                                 style={{ color:"var(--text-muted,#94a3b8)" }}>Edit Goal</p>
                              <form onSubmit={e => handleEditGoal(e, goal.id)} className="space-y-3">
                                <div className="gl-field flex items-center gap-3 rounded-xl px-3.5 py-3 border"
                                  style={{ background:"var(--surface-raised,#f8fafc)", borderColor:"var(--border,#e2e8f0)" }}>
                                  <IconText className="w-4 h-4 shrink-0"
                                    style={{ color:"#94a3b8", width:"16px", height:"16px" }} />
                                  <input type="text" value={editForm.title}
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Goal title" className="gl-input text-sm" />
                                </div>
                                <div className="gl-field flex items-center gap-3 rounded-xl px-3.5 py-3 border"
                                  style={{ background:"var(--surface-raised,#f8fafc)", borderColor:"var(--border,#e2e8f0)" }}>
                                  <span className="text-sm font-bold shrink-0" style={{ color:"#22c55e" }}>₦</span>
                                  <input type="number" value={editForm.targetAmount}
                                    onChange={e => setEditForm({ ...editForm, targetAmount: e.target.value })}
                                    placeholder="Target amount" className="gl-input text-sm font-mono" />
                                </div>
                                <div className="gl-field flex items-center gap-3 rounded-xl px-3.5 py-3 border"
                                  style={{ background:"var(--surface-raised,#f8fafc)", borderColor:"var(--border,#e2e8f0)" }}>
                                  <IconCalendar className="w-4 h-4 shrink-0"
                                    style={{ color:"#94a3b8", width:"16px", height:"16px" }} />
                                  <input type="date" value={editForm.targetDate}
                                    onChange={e => setEditForm({ ...editForm, targetDate: e.target.value })}
                                    className="gl-input text-sm" />
                                </div>
                                <div className="flex gap-2">
                                  <button type="submit"
                                    disabled={editingId === goal.id}
                                    className="gl-save-btn flex-1 flex items-center justify-center
                                               gap-2 py-2.5 rounded-xl text-white text-sm font-semibold">
                                    {editingId === goal.id ? (
                                      <svg className="gl-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                    ) : <IconCheck className="w-4 h-4" style={{ color:"#fff", width:"16px", height:"16px" }} />}
                                    Save Changes
                                  </button>
                                  <button type="button"
                                    onClick={() => setEditingGoalId(null)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border"
                                    style={{ borderColor:"var(--border,#e2e8f0)", color:"var(--text-secondary,#64748b)" }}>
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* ── Achieved Goals ───────────────────── */}
              {achievedGoals.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4 gl-fade-up">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background:"rgba(34,197,94,0.12)" }}>
                      <IconTrophy className="w-3.5 h-3.5"
                        style={{ color:"#16a34a", width:"14px", height:"14px" }} />
                    </div>
                    <h2 className="text-base font-bold tracking-tight"
                        style={{ color:"var(--text-primary,#0f172a)" }}>
                      Achieved Goals
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background:"rgba(34,197,94,0.10)", color:"#16a34a" }}>
                      {achievedGoals.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {achievedGoals.map((goal, i) => (
                      <div key={goal.id}
                        className={`gl-card gl-fade-up gl-s${Math.min(i+1,6)} rounded-2xl p-5`}
                        style={{
                          background: "linear-gradient(135deg,rgba(34,197,94,0.04) 0%,rgba(6,182,212,0.04) 100%)",
                          border: "1px solid rgba(34,197,94,0.25)",
                          boxShadow: "0 2px 12px rgba(34,197,94,0.08)",
                        }}>

                        <div className="flex items-start gap-4">
                          <div className="shrink-0">
                            <GoalDonut goal={goal} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold truncate"
                                  style={{ color:"var(--text-primary,#0f172a)" }}>
                                {goal.title}
                              </h3>
                              {/* Achieved badge */}
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 gl-pop"
                                style={{ background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.25)" }}>
                                <IconTrophy className="w-3 h-3" style={{ color:"#16a34a", width:"12px", height:"12px" }} />
                                <span className="text-xs font-bold" style={{ color:"#16a34a" }}>Achieved!</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background:"rgba(34,197,94,0.10)", color:"#16a34a" }}>
                                ₦{goal.savedAmount?.toLocaleString()} saved
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ background:"rgba(99,102,241,0.08)", color:"#6366f1" }}>
                                Target: ₦{goal.targetAmount?.toLocaleString()}
                              </span>
                            </div>

                            <div className="mt-3">
                              <ProgressBar pct={100} color="#22c55e" />
                              <p className="text-xs mt-1 font-bold text-right"
                                 style={{ color:"#16a34a" }}>100% Complete 🎉</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Goals;