import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import GoalDonut from "../components/GoalDonut";
import axios from "axios";
import dayjs from "dayjs";

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
const IconTrophy = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42
         0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138
         3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0
         00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946
         .806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42
         3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0
         010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
const IconClock = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconAlert = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2
         2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
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
const IconChevron = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IconEmpty = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
         00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2
         2 0 012 2" />
  </svg>
);
const IconFilter = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13
         13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293
         6.707A1 1 0 013 6V4z" />
  </svg>
);

/* ── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ w = "100%", h = "16px", radius = "8px" }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "gd-shimmer 1.6s ease-in-out infinite",
  }} />
);

/* ── Mini progress bar ──────────────────────────────────────────────── */
const MiniBar = ({ pct, color }) => (
  <div className="w-full rounded-full overflow-hidden"
       style={{ height: "5px", background: "var(--border,#e2e8f0)" }}>
    <div style={{
      width: `${pct}%`, height: "100%", borderRadius: "9999px",
      background: color,
      transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
      boxShadow: `0 0 6px ${color}55`,
      animation: "gd-bar 0.8s cubic-bezier(0.16,1,0.3,1) both",
    }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   GOAL DASHBOARD
══════════════════════════════════════════════════════════════════════ */
const GoalDashboard = () => {
  const { token }  = useAuth();
  const navigate   = useNavigate();

  const [goals,          setGoals]          = useState([]);
  const [filterMonth,    setFilterMonth]    = useState("");
  const [filteredGoals,  setFilteredGoals]  = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    fetchGoals().finally(() => setLoading(false));
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/goals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (Array.isArray(res.data)) {
        setGoals(res.data);
        setFilteredGoals(res.data);
      } else {
        setGoals([]); setFilteredGoals([]);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  const handleFilterChange = (e) => {
    const selectedMonth = e.target.value;
    setFilterMonth(selectedMonth);
    if (!selectedMonth) { setFilteredGoals(goals); return; }
    setFilteredGoals(
      goals.filter(g => dayjs(g.dueDate).format("MMMM") === selectedMonth)
    );
  };

  /* ── Derived summary stats ──────────────────────────────────────── */
  const totalGoals    = filteredGoals.length;
  const achieved      = filteredGoals.filter(g => g.savedAmount >= g.targetAmount).length;
  const inProgress    = filteredGoals.filter(g => g.savedAmount < g.targetAmount).length;
  const overdue       = filteredGoals.filter(g =>
    dayjs(g.targetDate).diff(dayjs(), "day") < 0 && g.savedAmount < g.targetAmount
  ).length;
  const totalSaved    = filteredGoals.reduce((s, g) => s + (g.savedAmount || 0), 0);
  const totalTarget   = filteredGoals.reduce((s, g) => s + (g.targetAmount || 0), 0);
  const overallPct    = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );

  return (
    <>
      <style>{`
        @keyframes gd-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes gd-fade-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes gd-scale-in {
          from { opacity:0; transform:scale(0.93); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes gd-bar { from { width:0; } }

        .gd-fade-up  { animation: gd-fade-up  0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .gd-scale-in { animation: gd-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }

        .gd-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .gd-card:hover {
          box-shadow: 0 10px 32px rgba(99,102,241,0.13) !important;
          transform: translateY(-3px);
        }

        .gd-stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .gd-stat-card:hover {
          transform: translateY(-2px);
        }

        .gd-select {
          appearance: none; -webkit-appearance: none;
          outline: none; cursor: pointer;
          background: transparent;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .gd-select:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }

        /* stagger */
        .gd-s1 { animation-delay:  50ms; }
        .gd-s2 { animation-delay: 100ms; }
        .gd-s3 { animation-delay: 150ms; }
        .gd-s4 { animation-delay: 200ms; }
        .gd-s5 { animation-delay: 250ms; }
        .gd-s6 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen pb-24" style={{ background: "var(--bg,#f0f2ff)" }}>
        

        <div className="max-w-6xl mx-auto px-4 pt-8">

          {/* ── Page header ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center
                          justify-between gap-4 mb-8 gd-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary,#0f172a)" }}>
                Goal Dashboard
              </h1>
              <p className="text-sm mt-1"
                 style={{ color: "var(--text-secondary,#64748b)" }}>
                Visual overview of all your financial goals
              </p>
            </div>

            {/* Month filter */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border"
              style={{
                background: "var(--surface,#fff)",
                borderColor: "var(--border,#e2e8f0)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                minWidth: "200px",
              }}>
              <IconFilter className="w-4 h-4 shrink-0"
                style={{ color: "#6366f1", width:"16px", height:"16px" }} />
              <select value={filterMonth} onChange={handleFilterChange}
                className="gd-select flex-1 text-sm font-medium border-none"
                style={{ color: "var(--text-primary,#0f172a)" }}>
                <option value="">All Months</option>
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <IconChevron className="w-4 h-4 shrink-0 pointer-events-none"
                style={{ color:"#94a3b8", width:"16px", height:"16px" }} />
            </div>
          </div>

          {/* ── Summary stat strip ──────────────────────── */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Goals", value: totalGoals,
                  icon: IconTarget, iconBg: "rgba(99,102,241,0.10)",
                  iconColor: "#6366f1", valueColor: "#6366f1",
                  border: "rgba(99,102,241,0.18)", delay: "gd-s1",
                },
                {
                  label: "Achieved", value: achieved,
                  icon: IconTrophy, iconBg: "rgba(34,197,94,0.10)",
                  iconColor: "#22c55e", valueColor: "#16a34a",
                  border: "rgba(34,197,94,0.20)", delay: "gd-s2",
                },
                {
                  label: "In Progress", value: inProgress,
                  icon: IconClock, iconBg: "rgba(245,158,11,0.10)",
                  iconColor: "#f59e0b", valueColor: "#b45309",
                  border: "rgba(245,158,11,0.20)", delay: "gd-s3",
                },
                {
                  label: "Overdue", value: overdue,
                  icon: IconAlert, iconBg: "rgba(239,68,68,0.10)",
                  iconColor: "#ef4444", valueColor: "#dc2626",
                  border: "rgba(239,68,68,0.20)", delay: "gd-s4",
                },
              ].map(s => (
                <div key={s.label}
                  className={`gd-stat-card gd-fade-up ${s.delay} rounded-2xl p-4
                              flex items-center gap-3`}
                  style={{
                    background: "var(--surface,#fff)",
                    border: `1px solid ${s.border}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center
                                  justify-center shrink-0"
                    style={{ background: s.iconBg }}>
                    <s.icon className="w-5 h-5"
                      style={{ color: s.iconColor, width:"20px", height:"20px" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium"
                       style={{ color: "var(--text-muted,#94a3b8)" }}>{s.label}</p>
                    <p className="text-2xl font-bold leading-tight"
                       style={{ color: s.valueColor }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Overall progress banner ─────────────────── */}
          {!loading && totalGoals > 0 && (
            <div className="gd-fade-up gd-s3 rounded-2xl p-5 mb-8 flex
                            flex-col sm:flex-row items-start sm:items-center gap-5"
              style={{
                background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#0891b2 100%)",
                boxShadow: "0 6px 24px rgba(99,102,241,0.30)",
              }}>
              {/* Dot grid */}
              <div className="absolute pointer-events-none inset-0 rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px,transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />

              <div className="flex-1 relative z-10">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                  Overall Progress
                </p>
                <p className="text-white text-2xl font-bold tracking-tight">
                  ₦{totalSaved.toLocaleString()}
                  <span className="text-white/50 text-base font-normal ml-2">
                    / ₦{totalTarget.toLocaleString()}
                  </span>
                </p>
                <div className="mt-3 w-full rounded-full overflow-hidden"
                     style={{ height:"8px", background:"rgba(255,255,255,0.20)" }}>
                  <div style={{
                    width: `${overallPct}%`, height:"100%",
                    background: "rgba(255,255,255,0.90)",
                    borderRadius: "9999px",
                    transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: "0 0 10px rgba(255,255,255,0.50)",
                  }} />
                </div>
                <p className="text-white/60 text-xs mt-1.5">
                  {overallPct.toFixed(1)}% of total target saved
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center
                              w-20 h-20 rounded-2xl shrink-0"
                style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.20)" }}>
                <p className="text-white text-xl font-bold leading-none">
                  {overallPct.toFixed(0)}%
                </p>
                <p className="text-white/60 text-xs mt-0.5">done</p>
              </div>
            </div>
          )}

          {/* ── Goals grid ──────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl p-5 space-y-4"
                  style={{ background:"var(--surface,#fff)", border:"1px solid var(--border,#e2e8f0)" }}>
                  <div className="flex items-center justify-center py-3">
                    <Skeleton w="80px" h="80px" radius="50%" />
                  </div>
                  <Skeleton w="70%" h="14px" />
                  <Skeleton w="50%" h="11px" />
                  <Skeleton w="100%" h="5px" radius="9999px" />
                </div>
              ))}
            </div>

          ) : filteredGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20
                            rounded-2xl gap-4 gd-scale-in"
              style={{
                background: "var(--surface,#fff)",
                border: "1px dashed var(--border,#e2e8f0)",
              }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background:"rgba(99,102,241,0.08)" }}>
                <IconEmpty className="w-7 h-7"
                  style={{ color:"#6366f1", width:"28px", height:"28px" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold"
                   style={{ color:"var(--text-primary,#0f172a)" }}>
                  No goals found
                </p>
                <p className="text-xs mt-1"
                   style={{ color:"var(--text-muted,#94a3b8)" }}>
                  {filterMonth ? `No goals due in ${filterMonth}` : "Create your first goal to get started"}
                </p>
              </div>
            </div>

          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGoals.map((goal, i) => {
                const pct        = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                const daysLeft   = dayjs(goal.targetDate).diff(dayjs(), "day");
                const isAchieved = goal.savedAmount >= goal.targetAmount;
                const isOverdue  = daysLeft < 0 && !isAchieved;
                const isUrgent   = daysLeft >= 0 && daysLeft <= 7 && !isAchieved;

                const barColor = isAchieved ? "#22c55e"
                               : isOverdue  ? "#ef4444"
                               : pct >= 75  ? "#22c55e"
                               : pct >= 40  ? "#6366f1"
                               :              "#f59e0b";

                return (
                  <div key={goal.id}
                    className={`gd-card gd-fade-up gd-s${Math.min(i+1,6)}
                                rounded-2xl overflow-hidden flex flex-col`}
                    style={{
                      background: isAchieved
                        ? "linear-gradient(135deg,rgba(34,197,94,0.04),rgba(6,182,212,0.04))"
                        : "var(--surface,#fff)",
                      border: isAchieved
                        ? "1px solid rgba(34,197,94,0.28)"
                        : isOverdue
                        ? "1px solid rgba(239,68,68,0.25)"
                        : "1px solid var(--border,#e2e8f0)",
                      boxShadow: isAchieved
                        ? "0 2px 12px rgba(34,197,94,0.10)"
                        : "0 2px 10px rgba(99,102,241,0.06)",
                    }}>

                    {/* Status ribbon */}
                    {(isAchieved || isOverdue || isUrgent) && (
                      <div className="px-4 py-2 flex items-center gap-2"
                        style={{
                          background: isAchieved ? "rgba(34,197,94,0.10)"
                                    : isOverdue  ? "rgba(239,68,68,0.10)"
                                    :              "rgba(245,158,11,0.10)",
                          borderBottom: `1px solid ${
                            isAchieved ? "rgba(34,197,94,0.18)"
                            : isOverdue ? "rgba(239,68,68,0.18)"
                            :            "rgba(245,158,11,0.18)"
                          }`,
                        }}>
                        {isAchieved
                          ? <IconTrophy className="w-3.5 h-3.5"
                              style={{ color:"#16a34a", width:"14px", height:"14px" }} />
                          : isOverdue
                          ? <IconAlert className="w-3.5 h-3.5"
                              style={{ color:"#dc2626", width:"14px", height:"14px" }} />
                          : <IconClock className="w-3.5 h-3.5"
                              style={{ color:"#b45309", width:"14px", height:"14px" }} />}
                        <span className="text-xs font-semibold"
                          style={{
                            color: isAchieved ? "#16a34a"
                                 : isOverdue  ? "#dc2626"
                                 :              "#b45309",
                          }}>
                          {isAchieved ? "Goal Achieved! 🎉"
                           : isOverdue ? `Overdue by ${Math.abs(daysLeft)}d`
                           :             `${daysLeft}d left — Urgent!`}
                        </span>
                      </div>
                    )}

                    {/* Card body */}
                    <div className="p-5 flex flex-col gap-4 flex-1">

                      {/* Donut + title */}
                      <div className="flex flex-col items-center gap-3">
                        <GoalDonut goal={goal} />
                        <h3 className="text-sm font-bold text-center leading-tight"
                            style={{ color:"var(--text-primary,#0f172a)" }}>
                          {goal.title}
                        </h3>
                      </div>

                      {/* Amounts */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color:"var(--text-muted,#94a3b8)" }}>Saved</span>
                          <span className="font-bold font-mono"
                                style={{ color: barColor }}>
                            ₦{(goal.savedAmount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color:"var(--text-muted,#94a3b8)" }}>Target</span>
                          <span className="font-semibold font-mono"
                                style={{ color:"var(--text-primary,#0f172a)" }}>
                            ₦{(goal.targetAmount || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Mini progress bar */}
                        <MiniBar pct={pct} color={barColor} />
                        <div className="flex items-center justify-between">
                          <span className="text-xs"
                                style={{ color:"var(--text-muted,#94a3b8)" }}>
                            Progress
                          </span>
                          <span className="text-xs font-bold"
                                style={{ color: barColor }}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Date + countdown */}
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-auto"
                        style={{
                          background: isOverdue
                            ? "rgba(239,68,68,0.07)"
                            : "var(--surface-raised,#f8fafc)",
                          border: `1px solid ${isOverdue
                            ? "rgba(239,68,68,0.18)"
                            : "var(--border,#e2e8f0)"}`,
                        }}>
                        <IconCalendar className="w-3.5 h-3.5 shrink-0"
                          style={{
                            color: isOverdue ? "#ef4444" : "#94a3b8",
                            width:"14px", height:"14px",
                          }} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate"
                             style={{ color:"var(--text-secondary,#64748b)" }}>
                            {dayjs(goal.targetDate).format("MMM D, YYYY")}
                          </p>
                          <p className="text-xs font-semibold"
                            style={{
                              color: isOverdue ? "#dc2626"
                                   : isUrgent  ? "#b45309"
                                   :             "#6366f1",
                            }}>
                            {isAchieved
                              ? "Completed ✓"
                              : daysLeft >= 0
                              ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
                              : `${Math.abs(daysLeft)}d overdue`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GoalDashboard;