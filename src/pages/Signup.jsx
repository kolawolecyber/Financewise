import { useState } from "react";
import { signup } from "../utils/Api";
import { useNavigate, Link } from "react-router-dom";

/* ── Icons ────────────────────────────────────────────────────────────── */
const IconUser = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconMail = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0
         002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconLock = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
         00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconEye = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
         9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IconEyeOff = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97
         9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242
         4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0
         A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0
         01-4.132 5.411m0 0L21 21" />
  </svg>
);
const IconShield = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
         11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
         10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconArrow = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const IconCheck = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/* ── Password strength helper ─────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#ef4444" };
  if (score <= 3) return { score, label: "Fair",   color: "#f59e0b" };
  if (score === 4) return { score, label: "Good",  color: "#06b6d4" };
  return              { score, label: "Strong", color: "#22c55e" };
};

/* ── Steps shown on the left panel ───────────────────────────────────── */
const STEPS = [
  { icon: "✦", title: "Create your account",   desc: "Takes less than 60 seconds"              },
  { icon: "✦", title: "Connect your finances",  desc: "Link accounts or enter manually"         },
  { icon: "✦", title: "Get instant insights",   desc: "Your dashboard is ready immediately"     },
];

const PERKS = [
  "No credit card required",
  "Free forever plan available",
  "Cancel anytime, no questions",
  "256-bit bank-level encryption",
];

/* ══════════════════════════════════════════════════════════════════════
   SIGNUP
══════════════════════════════════════════════════════════════════════ */
const Signup = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState("");
  const [focused,  setFocused]  = useState("");
  const [showPass, setShowPass] = useState({ password: false, confirm: false });
  const navigate = useNavigate();

  const validate = () => {
    const { email, password, confirmPassword } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))       return "Please enter a valid email address.";
    if (password.length < 6)           return "Password must be at least 6 characters.";
    if (password !== confirmPassword)  return "Passwords do not match.";
    return "";
  };

  const handleChange = (e) => {
    setErrors("");
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      setLoading(false);
      return;
    }
    const result = await signup(form);
    setLoading(false);
    if (result.token) {
      setMessage("Account created successfully!");
      setTimeout(() => navigate("/login"), 500);
    } else {
      setMessage(result.message || "Signup failed");
    }
  };

  const strength = getStrength(form.password);

  return (
    <>
      <style>{`
        @keyframes su-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes su-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes su-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes su-pulse {
          0%,100% { opacity:1; } 50% { opacity:0.4; }
        }
        @keyframes su-bar {
          from { width: 0; }
        }

        .su-fade-up  { animation: su-fade-up  0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .su-scale-in { animation: su-scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        .su-spin     { animation: su-spin 0.9s linear infinite; }
        .su-pulse    { animation: su-pulse 1.8s ease-in-out infinite; }
        .su-bar      { animation: su-bar 0.4s ease both; }

        .su-input { outline: none; background: transparent; width: 100%; }
        .su-input::placeholder { color: #94a3b8; }

        .su-field { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .su-field:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }

        .su-btn-primary {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 18px rgba(99,102,241,0.40);
        }
        .su-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.55);
        }
        .su-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .su-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .su-btn-outline {
          transition: all 0.2s ease;
        }
        .su-btn-outline:hover {
          transform: translateY(-1px);
          border-color: #6366f1 !important;
          background: rgba(99,102,241,0.06) !important;
        }

        .su-perk { transition: background 0.2s ease; }
        .su-perk:hover { background: rgba(255,255,255,0.12) !important; }

        /* stagger delays for left panel items */
        .su-stagger-1 { animation-delay: 80ms;  }
        .su-stagger-2 { animation-delay: 160ms; }
        .su-stagger-3 { animation-delay: 240ms; }
        .su-stagger-4 { animation-delay: 320ms; }
      `}</style>

      <div className="min-h-screen flex overflow-hidden"
           style={{ background: "var(--bg, #f0f2ff)" }}>

        {/* ══════════════════════════════════════════════
            LEFT PANEL
        ══════════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col
                        justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background: "linear-gradient(150deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%)" }}>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />

          {/* Orbs */}
          <div className="absolute -top-48 -left-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "rgba(139,92,246,0.20)", filter: "blur(90px)" }} />
          <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "rgba(6,182,212,0.12)", filter: "blur(80px)" }} />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3
                     2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0
                     1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9
                     0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">FinTrackr</span>
          </div>

          {/* Main content */}
          <div className="relative z-10 space-y-10">

            {/* Headline */}
            <div className="space-y-3 max-w-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 su-pulse" />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Join 10,000+ users today
                </span>
              </div>

              <h2 className="text-4xl xl:text-[2.6rem] font-bold text-white
                             leading-tight tracking-tight">
                Your financial journey{" "}
                <span style={{
                  background: "linear-gradient(90deg,#67e8f9,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  starts here
                </span>
              </h2>
              <p className="text-base leading-relaxed"
                 style={{ color: "rgba(255,255,255,0.58)" }}>
                Everything you need to budget smarter, save faster, and reach your goals.
              </p>
            </div>

            {/* 3-step process */}
            <div className="space-y-3 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                 style={{ color: "rgba(255,255,255,0.40)" }}>
                How it works
              </p>
              {STEPS.map((s, i) => (
                <div key={s.title}
                  className={`flex items-start gap-3.5 su-fade-up su-stagger-${i + 1}`}>
                  {/* Step number bubble */}
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center
                                  justify-center text-xs font-bold"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.20)",
                      color: "#fff",
                    }}>
                    {i + 1}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.48)" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-1 gap-2 max-w-xs">
              {PERKS.map((p, i) => (
                <div key={p}
                  className={`su-perk flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                              su-fade-up su-stagger-${i + 1}`}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.25)" }}>
                    <IconCheck className="w-2.5 h-2.5" style={{ color: "#4ade80" }} />
                  </div>
                  <span className="text-xs font-medium"
                        style={{ color: "rgba(255,255,255,0.72)" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              © 2026 FinTrackr · Built for professionals
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT PANEL — form
        ══════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-center
                        px-5 sm:px-10 md:px-14 py-10 overflow-y-auto relative">

          {/* Mobile ambient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden lg:hidden">
            <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full"
              style={{ background: "rgba(99,102,241,0.10)", filter: "blur(70px)" }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
              style={{ background: "rgba(139,92,246,0.08)", filter: "blur(60px)" }} />
          </div>

          <div className="relative w-full max-w-[420px] su-fade-up">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3
                       2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0
                       1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9
                       0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-xl tracking-tight"
                    style={{ color: "#6366f1" }}>FinTrackr</span>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary, #0f172a)" }}>
                Create your account
              </h1>
              <p className="text-sm mt-1.5"
                 style={{ color: "var(--text-secondary, #64748b)" }}>
                Free forever · No credit card needed
              </p>
            </div>

            {/* ── Card ─────────────────────────────────── */}
            <div className="rounded-2xl p-6 sm:p-7"
              style={{
                background: "var(--surface, #ffffff)",
                border: "1px solid var(--border, #e2e8f0)",
                boxShadow: "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              }}>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ── Full Name ── */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #94a3b8)" }}>
                    Full Name
                  </label>
                  <div className="su-field flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: "var(--border, #e2e8f0)",
                    }}>
                    <IconUser className="w-4 h-4 shrink-0"
                      style={{ color: focused === "name" ? "#6366f1" : "#94a3b8" }} />
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="John Doe"
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused("")}
                      className="su-input text-sm"
                      style={{ color: "var(--text-primary, #0f172a)", caretColor: "#6366f1" }}
                    />
                  </div>
                </div>

                {/* ── Email ── */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #94a3b8)" }}>
                    Email Address
                  </label>
                  <div className="su-field flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: "var(--border, #e2e8f0)",
                    }}>
                    <IconMail className="w-4 h-4 shrink-0"
                      style={{ color: focused === "email" ? "#6366f1" : "#94a3b8" }} />
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      className="su-input text-sm"
                      style={{ color: "var(--text-primary, #0f172a)", caretColor: "#6366f1" }}
                    />
                  </div>
                </div>

                {/* ── Password ── */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #94a3b8)" }}>
                    Password
                  </label>
                  <div className="su-field flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: "var(--border, #e2e8f0)",
                    }}>
                    <IconLock className="w-4 h-4 shrink-0"
                      style={{ color: focused === "password" ? "#6366f1" : "#94a3b8" }} />
                    <input
                      type={showPass.password ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="new-password"
                      placeholder="Minimum 6 characters"
                      onChange={handleChange}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                      className="su-input text-sm"
                      style={{ color: "var(--text-primary, #0f172a)", caretColor: "#6366f1" }}
                    />
                    <button type="button"
                      onClick={() => setShowPass(p => ({ ...p, password: !p.password }))}
                      className="shrink-0 hover:opacity-70 transition-opacity duration-150"
                      style={{ color: "#94a3b8" }}>
                      {showPass.password
                        ? <IconEyeOff className="w-4 h-4" />
                        : <IconEye    className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {form.password && (
                    <div className="space-y-1.5 su-scale-in">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full su-bar"
                            style={{
                              background: i <= strength.score ? strength.color : "#e2e8f0",
                              transition: "background 0.3s ease",
                            }} />
                        ))}
                      </div>
                      <p className="text-xs font-medium"
                         style={{ color: strength.color }}>
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Confirm Password ── */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #94a3b8)" }}>
                    Confirm Password
                  </label>
                  <div className="su-field flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: form.confirmPassword
                        ? form.confirmPassword === form.password
                          ? "rgba(34,197,94,0.6)"
                          : "rgba(239,68,68,0.5)"
                        : "var(--border, #e2e8f0)",
                    }}>
                    <IconShield className="w-4 h-4 shrink-0"
                      style={{
                        color: form.confirmPassword
                          ? form.confirmPassword === form.password ? "#22c55e" : "#ef4444"
                          : "#94a3b8"
                      }} />
                    <input
                      type={showPass.confirm ? "text" : "password"}
                      name="confirmPassword"
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      onChange={handleChange}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused("")}
                      className="su-input text-sm"
                      style={{ color: "var(--text-primary, #0f172a)", caretColor: "#6366f1" }}
                    />
                    <button type="button"
                      onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                      className="shrink-0 hover:opacity-70 transition-opacity duration-150"
                      style={{ color: "#94a3b8" }}>
                      {showPass.confirm
                        ? <IconEyeOff className="w-4 h-4" />
                        : <IconEye    className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {form.confirmPassword && (
                    <p className="text-xs font-medium su-scale-in"
                      style={{
                        color: form.confirmPassword === form.password ? "#22c55e" : "#ef4444"
                      }}>
                      {form.confirmPassword === form.password
                        ? "✓ Passwords match"
                        : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>

                {/* Validation error */}
                {errors && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                                  text-sm border su-scale-in"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      borderColor: "rgba(239,68,68,0.22)",
                      color: "#dc2626",
                    }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71
                           3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <span className="font-medium">{errors}</span>
                  </div>
                )}

                {/* Success message */}
                {message && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                                  text-sm border su-scale-in"
                    style={{
                      background: message.includes("success")
                        ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      borderColor: message.includes("success")
                        ? "rgba(34,197,94,0.22)" : "rgba(239,68,68,0.22)",
                      color: message.includes("success") ? "#16a34a" : "#dc2626",
                    }}>
                    <IconCheck className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{message}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="su-btn-primary w-full flex items-center justify-center
                             gap-2 py-3.5 rounded-xl text-white font-semibold text-sm">
                  {loading ? (
                    <>
                      <svg className="su-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <IconArrow className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "var(--border, #e2e8f0)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted, #94a3b8)" }}>
                Already have an account?
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--border, #e2e8f0)" }} />
            </div>

            {/* Sign in link */}
            <Link to="/login"
              className="su-btn-outline w-full flex items-center justify-center gap-2
                         py-3 rounded-xl text-sm font-semibold border"
              style={{
                color: "#6366f1",
                borderColor: "var(--border, #e2e8f0)",
                background: "var(--surface, #ffffff)",
              }}>
              Sign in instead
              <IconArrow className="w-4 h-4" />
            </Link>

            {/* Footer */}
            <p className="text-center text-xs mt-6"
               style={{ color: "var(--text-muted, #94a3b8)" }}>
              By signing up you agree to our{" "}
              <span className="font-medium cursor-pointer hover:underline"
                    style={{ color: "#6366f1" }}>Terms</span>
              {" & "}
              <span className="font-medium cursor-pointer hover:underline"
                    style={{ color: "#6366f1" }}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;