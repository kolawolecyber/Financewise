import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ── Helpers ────────────────────────────────────────────────────────── */
const fmt   = (n) => `₦${Number(n).toLocaleString()}`;
const month = (key) => {
  const [y, m] = key.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-GB", {
    month: "short", year: "2-digit",
  });
};

/* ══════════════════════════════════════════════════════════════════════
   TRANSACTION CHART
══════════════════════════════════════════════════════════════════════ */
const TransactionChart = ({ transactions }) => {

  /* ── Aggregate by month ─────────────────────────────────────────── */
  const monthlyTotals = {};
  (transactions ?? []).forEach((t) => {
    if (!t.date) return;
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyTotals[key]) monthlyTotals[key] = { income: 0, expense: 0 };
    if (t.type === "income") monthlyTotals[key].income  += Number(t.amount);
    else                     monthlyTotals[key].expense += Number(t.amount);
  });

  const labels      = Object.keys(monthlyTotals).sort();
  const incomeData  = labels.map(m => monthlyTotals[m].income);
  const expenseData = labels.map(m => monthlyTotals[m].expense);
  const isEmpty     = labels.length === 0;

  /* ── Summary stats ──────────────────────────────────────────────── */
  const totalIncome  = incomeData.reduce((s, v) => s + v, 0);
  const totalExpense = expenseData.reduce((s, v) => s + v, 0);
  const netBalance   = totalIncome - totalExpense;

  /* ── Chart.js data ──────────────────────────────────────────────── */
  const chartData = {
    labels: labels.map(month),
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34,197,94,0.75)",
        hoverBackgroundColor: "rgba(34,197,94,0.92)",
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239,68,68,0.72)",
        hoverBackgroundColor: "rgba(239,68,68,0.92)",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: false, /* we render our own legend below */
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#0f172a",
        bodyColor: "#64748b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: (item) =>
            ` ${item.dataset.label}: ${fmt(item.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 11, weight: "600" },
        },
      },
      y: {
        grid: {
          color: "rgba(226,232,240,0.7)",
          drawBorder: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) => `₦${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`,
        },
      },
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
  };

  return (
    <>
      <style>{`
        @keyframes tc-fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .tc-fade-up { animation: tc-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        .tc-stat {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tc-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.10) !important;
        }
      `}</style>

      <div className="tc-fade-up"
        style={{
          background: "var(--surface,#fff)",
          borderRadius: "20px",
          border: "1px solid var(--border,#e2e8f0)",
          boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
          overflow: "hidden",
          width: "100%",
        }}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={{
          padding: "20px 20px 0",
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: "12px",
          flexWrap: "wrap",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{
              width:"32px", height:"32px", borderRadius:"10px",
              background:"rgba(99,102,241,0.10)",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#6366f1"
                   strokeWidth={1.8} style={{ width:"16px", height:"16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0
                     002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0
                     012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2
                     2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2
                     0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 style={{
                fontSize: "0.9375rem", fontWeight: 700, margin: 0,
                color: "var(--text-primary,#0f172a)", letterSpacing: "-0.01em",
              }}>
                Monthly Income vs Expense
              </h3>
              <p style={{
                fontSize: "0.72rem", margin: 0,
                color: "var(--text-muted,#94a3b8)",
              }}>
                {isEmpty ? "No data yet" : `${labels.length} month${labels.length !== 1 ? "s" : ""} of activity`}
              </p>
            </div>
          </div>

          {/* Custom legend pills */}
          {!isEmpty && (
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {[
                { label:"Income",  color:"#22c55e", bg:"rgba(34,197,94,0.10)"  },
                { label:"Expense", color:"#ef4444", bg:"rgba(239,68,68,0.10)"  },
              ].map(l => (
                <div key={l.label} style={{
                  display:"flex", alignItems:"center", gap:"5px",
                  padding:"3px 10px", borderRadius:"9999px",
                  background: l.bg,
                  fontSize:"0.7rem", fontWeight:700, color: l.color,
                }}>
                  <div style={{
                    width:"8px", height:"8px", borderRadius:"50%",
                    background: l.color, flexShrink:0,
                  }} />
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Summary stat strip ──────────────────────── */}
        {!isEmpty && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            padding: "16px 20px 4px",
          }}>
            {[
              {
                label:"Total Income", value: totalIncome,
                color:"#16a34a", bg:"rgba(34,197,94,0.08)",
              },
              {
                label:"Total Expense", value: totalExpense,
                color:"#dc2626", bg:"rgba(239,68,68,0.08)",
              },
              {
                label: netBalance >= 0 ? "Net Savings" : "Net Loss",
                value: Math.abs(netBalance),
                color: netBalance >= 0 ? "#6366f1" : "#dc2626",
                bg:    netBalance >= 0 ? "rgba(99,102,241,0.08)" : "rgba(239,68,68,0.08)",
              },
            ].map(s => (
              <div key={s.label}
                className="tc-stat"
                style={{
                  padding: "10px 12px", borderRadius: "12px",
                  background: s.bg, textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                <p style={{
                  fontSize: "0.6rem", fontWeight: 700, margin: 0,
                  color: "var(--text-muted,#94a3b8)",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {s.label}
                </p>
                <p style={{
                  fontSize: "clamp(0.7rem, 2vw, 0.875rem)",
                  fontWeight: 800, margin: "3px 0 0",
                  color: s.color, fontFamily: "monospace",
                  whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {fmt(s.value)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Chart or empty state ─────────────────────── */}
        <div style={{ padding: "16px 20px 20px" }}>
          {isEmpty ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "40px 0", gap: "12px",
            }}>
              <div style={{
                width:"48px", height:"48px", borderRadius:"14px",
                background:"rgba(99,102,241,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#6366f1"
                     strokeWidth={1.5} style={{ width:"24px", height:"24px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
                       2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012
                       2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0
                       012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{
                  fontSize:"0.875rem", fontWeight:700, margin:0,
                  color:"var(--text-primary,#0f172a)",
                }}>
                  No chart data yet
                </p>
                <p style={{
                  fontSize:"0.75rem", marginTop:"4px",
                  color:"var(--text-muted,#94a3b8)",
                }}>
                  Add transactions to see monthly trends
                </p>
              </div>
            </div>
          ) : (
            /* ── Responsive chart wrapper ─────────────── */
            <div style={{
              position: "relative",
              width: "100%",
              /* on mobile cap the height so bars don't get tiny */
              minHeight: "180px",
            }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionChart;