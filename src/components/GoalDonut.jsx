import { PieChart, Pie, Cell } from "recharts";

/* ══════════════════════════════════════════════════════════════════════
   GOAL DONUT
══════════════════════════════════════════════════════════════════════ */
const GoalDonut = ({ goal, size = "md" }) => {
  const pct       = goal.targetAmount > 0
    ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) : 0;
  const isAchieved = pct >= 100;
  const isUrgent   = !isAchieved && goal.dueDate
    && ((new Date(goal.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 7;
  const isOverdue  = !isAchieved && goal.dueDate
    && new Date(goal.dueDate) < new Date();

  /* colour logic */
  const fillColor = isAchieved ? "#22c55e"
                  : isOverdue  ? "#ef4444"
                  : isUrgent   ? "#f59e0b"
                  : pct >= 75  ? "#22c55e"
                  : pct >= 40  ? "#6366f1"
                  :              "#f59e0b";

  const trackColor = isAchieved ? "rgba(34,197,94,0.12)"
                   : isOverdue  ? "rgba(239,68,68,0.10)"
                   :              "#f1f5f9";

  /* size presets */
  const sizes = {
    sm: { chart:80,  inner:22, outer:36, font:"0.6rem",  label:"0.55rem", gap:"4px" },
    md: { chart:110, inner:30, outer:48, font:"0.75rem", label:"0.65rem", gap:"6px" },
    lg: { chart:140, inner:40, outer:62, font:"0.875rem",label:"0.7rem",  gap:"8px" },
  };
  const s = sizes[size] ?? sizes.md;

  const data = [
    { name: "Saved",     value: pct           },
    { name: "Remaining", value: 100 - pct     },
  ];

  return (
    <>
      <style>{`
        @keyframes gd-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes gd-pop {
          0%   { transform: scale(0.6); opacity:0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity:1; }
        }
        @keyframes gd-fade-in {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        .gd-wrap {
          animation: gd-fade-in 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        .gd-achieved-icon {
          animation: gd-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>

      <div className="gd-wrap"
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: s.gap,
          /* never overflow parent on mobile */
          minWidth: 0, width: "100%",
        }}>

        {/* ── Chart + centre overlay ────────────────────── */}
        <div style={{ position: "relative",
                      width: `${s.chart}px`, height: `${s.chart}px`,
                      flexShrink: 0 }}>

          <PieChart width={s.chart} height={s.chart}>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={s.inner}
              outerRadius={s.outer}
              paddingAngle={isAchieved ? 0 : 3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              <Cell fill={fillColor}
                    style={{ filter:`drop-shadow(0 2px 4px ${fillColor}50)` }} />
              <Cell fill={trackColor} />
            </Pie>
          </PieChart>

          {/* Centre text overlay */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            {isAchieved ? (
              /* Trophy icon for 100% */
              <div className="gd-achieved-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke={fillColor}
                     strokeWidth={1.8}
                     style={{ width:`${s.inner}px`, height:`${s.inner}px` }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806
                       3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806
                       3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
                       3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946
                       3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806
                       3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
                       3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946
                       3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946
                       3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            ) : (
              <>
                <span style={{
                  fontSize: s.font, fontWeight: 800,
                  color: fillColor, lineHeight: 1,
                  fontFamily: "monospace",
                }}>
                  {pct.toFixed(0)}%
                </span>
                {size !== "sm" && (
                  <span style={{
                    fontSize: s.label, fontWeight: 500,
                    color: "var(--text-muted,#94a3b8)",
                    marginTop: "2px", lineHeight: 1,
                  }}>
                    saved
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Label below chart ─────────────────────────── */}
        <div style={{ textAlign: "center", minWidth: 0, width: "100%" }}>
          <p style={{
            fontSize: s.label, fontWeight: 700, margin: 0,
            color: "var(--text-primary,#0f172a)",
            whiteSpace: "nowrap", overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.3,
          }}>
            {goal.title}
          </p>

          {/* Status badge */}
          {size !== "sm" && (
            <span style={{
              display: "inline-block", marginTop: "4px",
              fontSize: "0.6rem", fontWeight: 700,
              padding: "2px 7px", borderRadius: "9999px",
              background: isAchieved ? "rgba(34,197,94,0.12)"
                        : isOverdue  ? "rgba(239,68,68,0.10)"
                        : isUrgent   ? "rgba(245,158,11,0.10)"
                        :              "rgba(99,102,241,0.10)",
              color: isAchieved ? "#16a34a"
                   : isOverdue  ? "#dc2626"
                   : isUrgent   ? "#b45309"
                   :              "#6366f1",
            }}>
              {isAchieved ? "✓ Achieved"
             : isOverdue  ? "Overdue"
             : isUrgent   ? "Due soon"
             :              `₦${Number(goal.savedAmount).toLocaleString()} saved`}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default GoalDonut;