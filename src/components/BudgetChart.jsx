import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ── Brand-quality colour palette ──────────────────────────────────── */
const COLORS = [
  "#6366f1", "#22c55e", "#f59e0b", "#ef4444",
  "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f97316", "#84cc16",
];

/* ── Custom tooltip ─────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: "var(--surface,#fff)",
      border: "1px solid var(--border,#e2e8f0)",
      borderRadius: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
      minWidth: "140px",
    }}>
      <div className="flex items-center gap-2 mb-1">
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: d.payload.fill, flexShrink: 0,
        }} />
        <span style={{
          fontSize: "0.75rem", fontWeight: 600,
          color: "var(--text-secondary,#64748b)",
        }}>
          {d.name}
        </span>
      </div>
      <p style={{
        fontSize: "1rem", fontWeight: 700,
        color: "var(--text-primary,#0f172a)",
        fontFamily: "monospace",
        margin: 0,
      }}>
        ₦{Number(d.value).toLocaleString()}
      </p>
      <p style={{
        fontSize: "0.7rem", marginTop: "2px",
        color: "var(--text-muted,#94a3b8)", margin: 0,
      }}>
        {d.payload.pct}% of total
      </p>
    </div>
  );
};

/* ── Custom legend ──────────────────────────────────────────────────── */
const CustomLegend = ({ data }) => (
  <div style={{
    display: "flex", flexWrap: "wrap",
    gap: "8px", justifyContent: "center",
    marginTop: "16px",
  }}>
    {data.map((d, i) => (
      <div key={d.name} style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "4px 10px", borderRadius: "9999px",
        background: `${COLORS[i % COLORS.length]}15`,
        border: `1px solid ${COLORS[i % COLORS.length]}30`,
        fontSize: "0.7rem", fontWeight: 600,
        color: COLORS[i % COLORS.length],
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: COLORS[i % COLORS.length], flexShrink: 0,
        }} />
        {d.name}
      </div>
    ))}
  </div>
);

/* ── Custom label inside each slice ────────────────────────────────── */
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
  if (pct < 5) return null; // skip tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: "0.65rem", fontWeight: 700 }}>
      {pct}%
    </text>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   BUDGET CHART
══════════════════════════════════════════════════════════════════════ */
const BudgetChart = ({ budgets, expensesByBudget }) => {

  const total = budgets.reduce((sum, b) =>
    sum + (expensesByBudget[b.id] || 0), 0
  );

  const chartData = budgets
    .map((b, i) => {
      const value = expensesByBudget[b.id] || 0;
      return {
        name:  b.title,
        value,
        fill:  COLORS[i % COLORS.length],
        pct:   total > 0 ? Math.round((value / total) * 100) : 0,
      };
    })
    .filter(d => d.value > 0); // hide zero-spend budgets

  const isEmpty = chartData.length === 0;

  return (
    <>
      <style>{`
        @keyframes bc-fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .bc-fade-up { animation: bc-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="bc-fade-up rounded-2xl p-5 sm:p-6"
        style={{
          background: "var(--surface,#fff)",
          border: "1px solid var(--border,#e2e8f0)",
          boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
        }}>

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(99,102,241,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* pie icon */}
              <svg fill="none" viewBox="0 0 24 24" stroke="#6366f1"
                   strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h2 style={{
                fontSize: "0.9375rem", fontWeight: 700,
                color: "var(--text-primary,#0f172a)",
                letterSpacing: "-0.01em", margin: 0,
              }}>
                Spending Distribution
              </h2>
              <p style={{
                fontSize: "0.75rem", margin: 0,
                color: "var(--text-muted,#94a3b8)",
              }}>
                Budget breakdown by category
              </p>
            </div>
          </div>

          {/* Total badge */}
          {!isEmpty && (
            <div style={{
              padding: "4px 12px", borderRadius: "9999px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              fontSize: "0.75rem", fontWeight: 700,
              color: "#6366f1", fontFamily: "monospace",
            }}>
              ₦{total.toLocaleString()}
            </div>
          )}
        </div>

        {/* ── Chart or empty state ─────────────────────── */}
        {isEmpty ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "48px 0", gap: "12px",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(99,102,241,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#6366f1"
                   strokeWidth={1.5} style={{ width:"24px", height:"24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "0.875rem", fontWeight: 600, margin: 0,
                color: "var(--text-primary,#0f172a)",
              }}>
                No expense data yet
              </p>
              <p style={{
                fontSize: "0.75rem", marginTop: "4px",
                color: "var(--text-muted,#94a3b8)",
              }}>
                Add transactions to see your spending breakdown
              </p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  labelLine={false}
                  label={renderLabel}
                  strokeWidth={0}
                >
                  {chartData.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={d.fill}
                          style={{ filter:`drop-shadow(0 2px 4px ${d.fill}40)`,
                                   cursor:"pointer" }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label (donut hole text) */}
            <div style={{
              position: "relative", marginTop: "-160px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none", height: "60px",
            }}>
              <p style={{
                fontSize: "0.65rem", fontWeight: 600, margin: 0,
                color: "var(--text-muted,#94a3b8)",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Total Spent
              </p>
              <p style={{
                fontSize: "1rem", fontWeight: 800, margin: 0,
                color: "var(--text-primary,#0f172a)",
                fontFamily: "monospace",
              }}>
                ₦{total.toLocaleString()}
              </p>
            </div>

            {/* Custom legend */}
            <div style={{ marginTop: "80px" }}>
              <CustomLegend data={chartData} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BudgetChart;