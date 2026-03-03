import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../services/api";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconPlus = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
const IconTrash = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
         01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
         00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconText = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
);
const IconArrowUp = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);
const IconArrowDown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);
const IconChevron = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IconPalette = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4
         4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343
         M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2
         0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);
const IconEmpty = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0
         010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0
         013 12V7a4 4 0 014-4z" />
  </svg>
);

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "16px", radius = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "ct-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ── Preset colour swatches ─────────────────────────────────────────── */
const SWATCHES = [
  "#6366f1","#8b5cf6","#ec4899","#ef4444",
  "#f59e0b","#22c55e","#06b6d4","#3b82f6",
  "#14b8a6","#f97316","#84cc16","#a855f7",
];

/* ══════════════════════════════════════════════════════════════════════
   CATEGORY
══════════════════════════════════════════════════════════════════════ */
const Category = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [form,       setForm]       = useState({ name:"", type:"expense", color:"#6366f1" });
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [focused,    setFocused]    = useState("");
  const [activeTab,  setActiveTab]  = useState("all"); // "all" | "expense" | "income"

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/api/categories", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", type: "expense", color: "#6366f1" });
      fetchCategories();
    } catch (err) {
      console.error("Error creating category", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
    } finally {
      setDeletingId(null);
    }
  };

  const expenseCount = categories.filter(c => c.type === "expense").length;
  const incomeCount  = categories.filter(c => c.type === "income").length;

  const displayed = activeTab === "all"
    ? categories
    : categories.filter(c => c.type === activeTab);

  return (
    <>
      <style>{`
        @keyframes ct-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ct-fade-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes ct-scale-in {
          from { opacity:0; transform:scale(0.93); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes ct-slide-in {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0);     }
        }
        @keyframes ct-spin { to { transform:rotate(360deg); } }

        .ct-fade-up  { animation: ct-fade-up  0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .ct-scale-in { animation: ct-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ct-slide-in { animation: ct-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .ct-spin     { animation: ct-spin 0.9s linear infinite; }

        .ct-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border,#e2e8f0);
        }
        .ct-field:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }
        .ct-input, .ct-select {
          outline: none; background: transparent; width: 100%;
          color: var(--text-primary,#0f172a); font-size: 0.875rem;
          caret-color: #6366f1;
        }
        .ct-input::placeholder { color: #94a3b8; }
        .ct-select { appearance:none; -webkit-appearance:none; cursor:pointer; }

        .ct-submit-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
        }
        .ct-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(99,102,241,0.50);
        }
        .ct-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .ct-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .ct-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
        }
        .ct-card:hover {
          box-shadow: 0 8px 28px rgba(99,102,241,0.10) !important;
          transform: translateY(-2px);
        }

        .ct-delete-btn {
          transition: all 0.15s ease;
          opacity: 0;
        }
        .ct-card:hover .ct-delete-btn { opacity: 1; }
        .ct-delete-btn:hover {
          background: rgba(239,68,68,0.12) !important;
          color: #ef4444 !important;
          transform: scale(1.08);
        }
        .ct-delete-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .ct-swatch {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .ct-swatch:hover { transform: scale(1.15); }

        .ct-tab {
          transition: all 0.18s ease;
          cursor: pointer;
        }
        .ct-tab:hover { background: rgba(99,102,241,0.06) !important; }

        .ct-type-btn { transition: all 0.18s ease; }
        .ct-type-btn:hover { opacity: 0.85; }

        /* stagger */
        .ct-s1 { animation-delay:  50ms; }
        .ct-s2 { animation-delay: 100ms; }
        .ct-s3 { animation-delay: 150ms; }
        .ct-s4 { animation-delay: 200ms; }
        .ct-s5 { animation-delay: 250ms; }
        .ct-s6 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen pb-24" style={{ background: "var(--bg,#f0f2ff)" }}>
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 pt-8">

          {/* ── Page header ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center
                          justify-between gap-4 mb-8 ct-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary,#0f172a)" }}>
                Categories
              </h1>
              <p className="text-sm mt-1"
                 style={{ color: "var(--text-secondary,#64748b)" }}>
                Organise your income and expenses with custom categories
              </p>
            </div>

            {/* Stat pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  color: "#dc2626",
                  border: "1px solid rgba(239,68,68,0.20)",
                }}>
                <IconArrowDown className="w-3 h-3" style={{ width:"12px", height:"12px" }} />
                {expenseCount} Expense{expenseCount !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(34,197,94,0.10)",
                  color: "#16a34a",
                  border: "1px solid rgba(34,197,94,0.20)",
                }}>
                <IconArrowUp className="w-3 h-3" style={{ width:"12px", height:"12px" }} />
                {incomeCount} Income{incomeCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* ── Main grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Create form (sticky sidebar) ────────── */}
            <div className="lg:col-span-1">
              <div className="ct-fade-up ct-s1 rounded-2xl p-6 lg:sticky lg:top-6"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
                }}>

                {/* Form header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.10)" }}>
                    <IconPlus className="w-4 h-4"
                      style={{ color:"#6366f1", width:"16px", height:"16px" }} />
                  </div>
                  <h2 className="text-base font-bold tracking-tight"
                      style={{ color: "var(--text-primary,#0f172a)" }}>
                    New Category
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>
                      Category Name
                    </label>
                    <div className="ct-field flex items-center gap-3 rounded-xl px-3.5 py-3"
                      style={{ background: "var(--surface-raised,#f8fafc)" }}>
                      <IconText className="w-4 h-4 shrink-0"
                        style={{ color: focused==="name"?"#6366f1":"#94a3b8",
                                 width:"16px", height:"16px" }} />
                      <input type="text" name="name" value={form.name}
                        placeholder="e.g. Transportation"
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        className="ct-input" required />
                    </div>
                  </div>

                  {/* Type toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>
                      Type
                    </label>
                    <div className="flex rounded-xl overflow-hidden p-1 gap-1"
                      style={{
                        background: "var(--surface-raised,#f8fafc)",
                        border: "1.5px solid var(--border,#e2e8f0)",
                      }}>
                      {["expense","income"].map(t => (
                        <button key={t} type="button"
                          onClick={() => setForm({ ...form, type: t })}
                          className="ct-type-btn flex-1 flex items-center justify-center
                                     gap-1.5 py-2.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: form.type === t
                              ? t === "income"
                                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                : "linear-gradient(135deg,#ef4444,#dc2626)"
                              : "transparent",
                            color: form.type === t ? "#fff"
                                 : "var(--text-muted,#94a3b8)",
                            boxShadow: form.type === t
                              ? t === "income"
                                ? "0 2px 8px rgba(34,197,94,0.28)"
                                : "0 2px 8px rgba(239,68,68,0.25)"
                              : "none",
                          }}>
                          {t === "income"
                            ? <IconArrowUp   className="w-3 h-3"
                                style={{ width:"12px", height:"12px",
                                         color: form.type===t?"#fff":"#94a3b8" }} />
                            : <IconArrowDown className="w-3 h-3"
                                style={{ width:"12px", height:"12px",
                                         color: form.type===t?"#fff":"#94a3b8" }} />}
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colour picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                           style={{ color: "var(--text-muted,#94a3b8)" }}>
                      Colour
                    </label>

                    {/* Swatches grid */}
                    <div className="grid grid-cols-6 gap-2">
                      {SWATCHES.map(c => (
                        <button key={c} type="button"
                          onClick={() => setForm({ ...form, color: c })}
                          className="ct-swatch w-8 h-8 rounded-lg"
                          style={{
                            background: c,
                            borderColor: form.color === c
                              ? "var(--text-primary,#0f172a)" : "transparent",
                            boxShadow: form.color === c
                              ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : "none",
                          }}
                        />
                      ))}
                    </div>

                    {/* Custom colour input */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="relative flex-1">
                        <IconPalette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color:"#94a3b8", width:"16px", height:"16px" }} />
                        <input type="text" value={form.color}
                          onChange={e => setForm({ ...form, color: e.target.value })}
                          placeholder="#6366f1"
                          className="ct-input pl-9 pr-4 py-2.5 rounded-xl text-xs font-mono"
                          style={{
                            border: "1.5px solid var(--border,#e2e8f0)",
                            background: "var(--surface-raised,#f8fafc)",
                          }} />
                      </div>
                      {/* Live preview swatch */}
                      <div className="w-10 h-10 rounded-xl shrink-0 border-2"
                        style={{
                          background: form.color,
                          borderColor: "var(--border,#e2e8f0)",
                          boxShadow: `0 2px 8px ${form.color}55`,
                        }} />
                      {/* Native color picker */}
                      <input type="color" name="color" value={form.color}
                        onChange={handleChange}
                        className="w-10 h-10 rounded-xl cursor-pointer shrink-0"
                        style={{
                          border: "1.5px solid var(--border,#e2e8f0)",
                          background: "var(--surface-raised,#f8fafc)",
                          padding: "2px",
                        }} />
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={submitting}
                    className="ct-submit-btn w-full flex items-center justify-center
                               gap-2 py-3.5 rounded-xl text-white font-semibold text-sm mt-2">
                    {submitting ? (
                      <>
                        <svg className="ct-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                                  stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <IconPlus className="w-4 h-4"
                          style={{ color:"#fff", width:"16px", height:"16px" }} />
                        Create Category
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Category list ───────────────────────── */}
            <div className="lg:col-span-2">

              {/* Tab bar */}
              <div className="flex items-center gap-1 p-1 rounded-xl mb-5 ct-fade-up ct-s2"
                style={{
                  background: "var(--surface,#fff)",
                  border: "1px solid var(--border,#e2e8f0)",
                  display: "inline-flex",
                }}>
                {[
                  { id:"all",     label:`All (${categories.length})` },
                  { id:"expense", label:`Expense (${expenseCount})` },
                  { id:"income",  label:`Income (${incomeCount})` },
                ].map(tab => (
                  <button key={tab.id} type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="ct-tab px-4 py-2 rounded-lg text-xs font-semibold"
                    style={{
                      background: activeTab === tab.id
                        ? tab.id === "expense"
                          ? "linear-gradient(135deg,#ef4444,#dc2626)"
                          : tab.id === "income"
                          ? "linear-gradient(135deg,#22c55e,#16a34a)"
                          : "linear-gradient(135deg,#6366f1,#8b5cf6)"
                        : "transparent",
                      color: activeTab === tab.id
                        ? "#fff" : "var(--text-muted,#94a3b8)",
                      boxShadow: activeTab === tab.id
                        ? "0 2px 8px rgba(99,102,241,0.20)" : "none",
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Loading skeletons */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="rounded-2xl p-5 flex items-center gap-4"
                      style={{
                        background: "var(--surface,#fff)",
                        border: "1px solid var(--border,#e2e8f0)",
                      }}>
                      <Skeleton w="48px" h="48px" radius="12px" />
                      <div className="flex-1 space-y-2">
                        <Skeleton w="60%" h="14px" />
                        <Skeleton w="40%" h="11px" />
                      </div>
                    </div>
                  ))}
                </div>

              /* Empty state */
              ) : displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16
                                rounded-2xl gap-4 ct-scale-in"
                  style={{
                    background: "var(--surface,#fff)",
                    border: "1px dashed var(--border,#e2e8f0)",
                  }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.08)" }}>
                    <IconEmpty className="w-6 h-6"
                      style={{ color:"#6366f1", width:"24px", height:"24px" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold"
                       style={{ color:"var(--text-primary,#0f172a)" }}>
                      No {activeTab !== "all" ? activeTab : ""} categories yet
                    </p>
                    <p className="text-xs mt-1"
                       style={{ color:"var(--text-muted,#94a3b8)" }}>
                      Create your first category using the form
                    </p>
                  </div>
                </div>

              /* Category grid */
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayed.map((cat, i) => (
                    <div key={cat.id}
                      className={`ct-card ct-slide-in rounded-2xl overflow-hidden`}
                      style={{
                        background: "var(--surface,#fff)",
                        border: "1px solid var(--border,#e2e8f0)",
                        boxShadow: "0 2px 10px rgba(99,102,241,0.05)",
                        animationDelay: `${i * 50}ms`,
                      }}>

                      {/* Colour accent top bar */}
                      <div style={{
                        height: "4px",
                        background: cat.color || "#6366f1",
                        boxShadow: `0 2px 8px ${cat.color || "#6366f1"}55`,
                      }} />

                      <div className="p-4 flex items-center gap-4">

                        {/* Colour bubble */}
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-xl"
                            style={{
                              background: cat.color || "#6366f1",
                              boxShadow: `0 4px 12px ${cat.color || "#6366f1"}45`,
                            }} />
                          {/* Glow */}
                          <div className="absolute inset-0 rounded-xl blur-sm opacity-40 pointer-events-none"
                            style={{ background: cat.color || "#6366f1" }} />
                          {/* Type icon overlay */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                                          flex items-center justify-center"
                            style={{
                              background: cat.type === "income"
                                ? "#22c55e" : "#ef4444",
                              border: "2px solid var(--surface,#fff)",
                            }}>
                            {cat.type === "income"
                              ? <IconArrowUp className="w-2.5 h-2.5"
                                  style={{ color:"#fff", width:"10px", height:"10px" }} />
                              : <IconArrowDown className="w-2.5 h-2.5"
                                  style={{ color:"#fff", width:"10px", height:"10px" }} />}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold truncate"
                              style={{ color:"var(--text-primary,#0f172a)" }}>
                            {cat.name}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 mt-1
                                           text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              background: cat.type === "income"
                                ? "rgba(34,197,94,0.10)"
                                : "rgba(239,68,68,0.10)",
                              color: cat.type === "income" ? "#16a34a" : "#dc2626",
                            }}>
                            {cat.type === "income"
                              ? <IconArrowUp className="w-2.5 h-2.5"
                                  style={{ width:"10px", height:"10px" }} />
                              : <IconArrowDown className="w-2.5 h-2.5"
                                  style={{ width:"10px", height:"10px" }} />}
                            {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                          </span>
                        </div>

                        {/* Delete button */}
                        <button onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="ct-delete-btn w-8 h-8 rounded-lg flex items-center
                                     justify-center border shrink-0"
                          style={{
                            color: "var(--text-muted,#94a3b8)",
                            borderColor: "var(--border,#e2e8f0)",
                            background: "transparent",
                          }}>
                          {deletingId === cat.id ? (
                            <svg className="ct-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
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
        </div>
      </div>
    </>
  );
};

export default Category;