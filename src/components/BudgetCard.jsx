import { useEffect, useState } from "react";
import API from "../services/api";

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "12px", radius = "6px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "bc2-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ── Mini progress bar ──────────────────────────────────────────────── */
const ProgressBar = ({ pct, isOver }) => (
  <div style={{
    width:"100%", height:"6px", borderRadius:"9999px",
    background:"var(--border,#e2e8f0)", overflow:"hidden",
  }}>
    <div style={{
      width:`${Math.min(pct, 100)}%`, height:"100%", borderRadius:"9999px",
      background: isOver
        ? "linear-gradient(90deg,#ef4444,#dc2626)"
        : pct >= 80
        ? "linear-gradient(90deg,#f59e0b,#d97706)"
        : "linear-gradient(90deg,#6366f1,#8b5cf6)",
      boxShadow: isOver
        ? "0 0 6px rgba(239,68,68,0.40)"
        : "0 0 6px rgba(99,102,241,0.35)",
      animation: "bc2-bar 0.8s cubic-bezier(0.16,1,0.3,1) both",
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   BUDGET CARD  (read-only, lightweight view)
══════════════════════════════════════════════════════════════════════ */
const BudgetCard = ({ budget }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/expenses?budgetId=${budget.id}`);
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [budget.id]);

  /* ── Derived ──────────────────────────────────────────────────── */
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const remaining  = Number(budget.amount) - totalSpent;
  const pct        = budget.amount > 0
    ? Math.min((totalSpent / budget.amount) * 100, 100) : 0;
  const isOver     = totalSpent > Number(budget.amount);
  const isWarn     = pct >= 80 && !isOver;

  /* border / accent colour */
  const accent = isOver  ? "#ef4444"
               : isWarn  ? "#f59e0b"
               :            "#6366f1";

  return (
    <>
      <style>{`
        @keyframes bc2-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes bc2-bar      { from { width:0; } }
        @keyframes bc2-fade-up  {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes bc2-slide-down {
          from { opacity:0; max-height:0;    transform:translateY(-6px); }
          to   { opacity:1; max-height:600px; transform:translateY(0);   }
        }

        .bc2-card {
          animation: bc2-fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .bc2-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(99,102,241,0.11) !important;
        }

        .bc2-toggle {
          transition: background 0.18s ease, color 0.18s ease;
        }
        .bc2-toggle:hover {
          background: rgba(99,102,241,0.07) !important;
          color: #6366f1 !important;
        }

        .bc2-exp-row {
          transition: background 0.14s ease;
        }
        .bc2-exp-row:hover {
          background: rgba(99,102,241,0.04) !important;
        }

        .bc2-slide-down {
          animation: bc2-slide-down 0.35s cubic-bezier(0.16,1,0.3,1) both;
          overflow: hidden;
        }
      `}</style>

      <div className="bc2-card"
        style={{
          background: "var(--surface,#fff)",
          borderRadius: "16px",
          overflow: "hidden",
          border: isOver
            ? "1px solid rgba(239,68,68,0.28)"
            : isWarn
            ? "1px solid rgba(245,158,11,0.28)"
            : "1px solid var(--border,#e2e8f0)",
          boxShadow: "0 2px 14px rgba(99,102,241,0.07)",
          /* full width on mobile, natural width on grid */
          width: "100%",
        }}>

        {/* ── Accent top bar ──────────────────────── */}
        <div style={{
          height: "4px",
          background: isOver
            ? "linear-gradient(90deg,#ef4444,#dc2626)"
            : isWarn
            ? "linear-gradient(90deg,#f59e0b,#d97706)"
            : "linear-gradient(90deg,#6366f1,#8b5cf6)",
        }} />

        {/* ── Card body ───────────────────────────── */}
        <div style={{ padding: "16px" }}>

          {/* Title row */}
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", gap: "10px",
            marginBottom: "12px",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontSize: "0.9375rem", fontWeight: 700, margin: 0,
                color: "var(--text-primary,#0f172a)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {budget.title}
              </h2>
              {budget.category && (
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  marginTop: "4px",
                  fontSize: "0.68rem", fontWeight: 600,
                  padding: "2px 8px", borderRadius: "9999px",
                  background: `${accent}14`, color: accent,
                }}>
                  {budget.category}
                  {budget.month && ` · ${budget.month}`}
                </span>
              )}
            </div>

            {/* Status badge */}
            <span style={{
              fontSize: "0.65rem", fontWeight: 700, flexShrink: 0,
              padding: "3px 9px", borderRadius: "9999px",
              background: isOver  ? "rgba(239,68,68,0.10)"
                        : isWarn  ? "rgba(245,158,11,0.10)"
                        :           "rgba(99,102,241,0.10)",
              color: accent,
              border: `1px solid ${accent}28`,
            }}>
              {isOver ? "⚠ Over" : isWarn ? "⚡ Alert" : "✓ OK"}
            </span>
          </div>

          {/* ── Stat row (3 pills) ───────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginBottom: "12px",
          }}>
            {[
              {
                label: "Budget",
                value: `₦${Number(budget.amount).toLocaleString()}`,
                color: "#6366f1",
                bg: "rgba(99,102,241,0.07)",
              },
              {
                label: "Spent",
                value: `₦${totalSpent.toLocaleString()}`,
                color: isOver ? "#dc2626" : "#f59e0b",
                bg: isOver ? "rgba(239,68,68,0.07)" : "rgba(245,158,11,0.07)",
              },
              {
                label: remaining >= 0 ? "Left" : "Over",
                value: `₦${Math.abs(remaining).toLocaleString()}`,
                color: remaining >= 0 ? "#16a34a" : "#dc2626",
                bg: remaining >= 0 ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
              },
            ].map(s => (
              <div key={s.label} style={{
                padding: "8px 6px", borderRadius: "10px",
                background: s.bg, textAlign: "center",
              }}>
                <p style={{
                  fontSize: "0.6rem", fontWeight: 700, margin: 0,
                  color: "var(--text-muted,#94a3b8)",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {s.label}
                </p>
                <p style={{
                  fontSize: "0.8125rem", fontWeight: 800, margin: "2px 0 0",
                  color: s.color, fontFamily: "monospace",
                  /* shrink text if number is long */
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {loading ? "—" : s.value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Progress bar ─────────────────────── */}
          <ProgressBar pct={loading ? 0 : pct} isOver={isOver} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: "5px",
          }}>
            <span style={{
              fontSize: "0.68rem", color: "var(--text-muted,#94a3b8)",
            }}>
              {loading ? "—" : `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`}
            </span>
            <span style={{
              fontSize: "0.68rem", fontWeight: 700,
              color: isOver ? "#dc2626" : isWarn ? "#b45309" : "#6366f1",
            }}>
              {loading ? "—" : `${pct.toFixed(1)}% used`}
            </span>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────── */}
        <div style={{ height: "1px", background: "var(--border,#e2e8f0)" }} />

        {/* ── Expenses toggle ─────────────────────── */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="bc2-toggle"
          style={{
            width: "100%", padding: "10px 16px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            background: "transparent", border: "none",
            cursor: "pointer",
            fontSize: "0.75rem", fontWeight: 700,
            color: "var(--text-secondary,#64748b)",
          }}>
          <span>Expenses</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {!loading && (
              <span style={{
                padding: "1px 8px", borderRadius: "9999px",
                background: "rgba(99,102,241,0.10)", color: "#6366f1",
                fontSize: "0.7rem", fontWeight: 700,
              }}>
                {expenses.length}
              </span>
            )}
            {/* chevron */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"
                 strokeWidth={2.5}
                 style={{
                   width: "14px", height: "14px",
                   transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                   transition: "transform 0.25s ease",
                 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* ── Expense list ─────────────────────────── */}
        {expanded && (
          <div className="bc2-slide-down"
            style={{ borderTop: "1px solid var(--border,#e2e8f0)" }}>

            {loading ? (
              /* skeleton rows */
              <div style={{ padding: "10px 16px 14px",
                            display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1, 2].map(i => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: "10px",
                  }}>
                    <Skeleton w="55%" h="11px" />
                    <Skeleton w="25%" h="11px" />
                  </div>
                ))}
              </div>

            ) : expenses.length === 0 ? (
              <div style={{
                padding: "20px 16px",
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: "0.8rem", margin: 0,
                  color: "var(--text-muted,#94a3b8)",
                }}>
                  No expenses recorded yet
                </p>
              </div>

            ) : (
              <div style={{ padding: "4px 0 8px" }}>
                {expenses.map((exp, i) => (
                  <div key={exp.id}
                    className="bc2-exp-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 16px",
                      borderRadius: "0",
                      animationDelay: `${i * 35}ms`,
                    }}>

                    {/* Initial bubble */}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem", fontWeight: 700, color: "#fff",
                      boxShadow: "0 2px 5px rgba(99,102,241,0.25)",
                    }}>
                      {exp.description?.charAt(0)?.toUpperCase() ?? "E"}
                    </div>

                    {/* Description */}
                    <span style={{
                      flex: 1, fontSize: "0.8rem", fontWeight: 500,
                      color: "var(--text-primary,#0f172a)",
                      whiteSpace: "nowrap", overflow: "hidden",
                      textOverflow: "ellipsis",
                      /* ensure it doesn't push amount off screen */
                      minWidth: 0,
                    }}>
                      {exp.description}
                    </span>

                    {/* Amount */}
                    <span style={{
                      fontSize: "0.8125rem", fontWeight: 700,
                      color: "#dc2626", fontFamily: "monospace",
                      flexShrink: 0,
                    }}>
                      −₦{Number(exp.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BudgetCard;