import { useState } from "react";
import { login } from "../utils/Api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Icons ────────────────────────────────────────────────────────────── */
const IconMail = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0
         002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const IconLock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
         00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconEye = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
         9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IconEyeOff = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97
         9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242
         4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0
         A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0
         01-4.132 5.411m0 0L21 21" />
  </svg>
);
const IconArrow = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const IconStar = () => (
  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969
             0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
             1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197
             -1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81
             .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ── Feature data ─────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "💰", title: "Smart Budgeting",     desc: "AI-powered insights on your spending" },
  { icon: "📈", title: "Goal Tracking",        desc: "Visual progress toward every target"  },
  { icon: "🔒", title: "Bank-level Security",  desc: "256-bit encryption, always private"   },
  { icon: "⚡", title: "Real-time Sync",       desc: "Instant updates across all devices"   },
];

const AVATARS = [
  { bg: "#f472b6", letter: "A" },
  { bg: "#fb923c", letter: "M" },
  { bg: "#34d399", letter: "K" },
  { bg: "#818cf8", letter: "J" },
];

/* ══════════════════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════════════════ */
const Login = () => {
  const [form,     setForm]     = useState({ email: "", password: "" });
  const [message,  setMessage]  = useState({ text: "", type: "" });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.trim() });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    const result = await login(form);
    setLoading(false);
    if (result.token) {
      authLogin(result.token);
      localStorage.setItem("token", result.token);
      setMessage({ text: "Login successful! Redirecting…", type: "success" });
      setTimeout(() => navigate("/"), 200);
    } else {
      setMessage({ text: result.message || "Invalid email or password.", type: "error" });
    }
  };

  return (
    <>
      {/* ── Page-level keyframes injected once ───────────────────────── */}
      <style>{`
        @keyframes ft-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ft-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes ft-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ft-pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .ft-fade-up   { animation: ft-fade-up   0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .ft-scale-in  { animation: ft-scale-in  0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ft-spin      { animation: ft-spin 0.9s linear infinite; }
        .ft-pulse-dot { animation: ft-pulse-dot 1.8s ease-in-out infinite; }

        /* Input focus glow */
        .ft-input:focus { outline: none; }

        /* Left-panel feature pill hover */
        .ft-pill { transition: background 0.2s ease; }
        .ft-pill:hover { background: rgba(255,255,255,0.13) !important; }

        /* CTA button hover */
        .ft-btn-primary { transition: all 0.2s ease; }
        .ft-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.55) !important;
        }
        .ft-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .ft-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Outline button hover */
        .ft-btn-outline { transition: all 0.2s ease; }
        .ft-btn-outline:hover {
          transform: translateY(-1px);
          border-color: #6366f1 !important;
          background: rgba(99,102,241,0.06) !important;
        }

        /* Input wrapper focus border */
        .ft-field-focused {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
      `}</style>

      <div className="min-h-screen flex" style={{ background: "var(--bg, #f0f2ff)" }}>

        {/* ════════════════════════════════════════════════
            LEFT PANEL  (hidden below lg)
        ════════════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col
                        justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background: "linear-gradient(145deg, #4f46e5 0%, #6d28d9 60%, #7c3aed 100%)" }}>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }} />

          {/* Orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.04)", filter: "blur(80px)" }} />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "rgba(167,139,250,0.18)", filter: "blur(90px)" }} />

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

          {/* Hero copy + features */}
          <div className="relative z-10 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(6px)",
              }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ft-pulse-dot" />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                Trusted by 10,000+ professionals
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3 max-w-sm">
              <h2 className="text-4xl xl:text-[2.75rem] font-bold text-white leading-tight tracking-tight">
                Take control of your{" "}
                <span style={{
                  background: "linear-gradient(90deg, #67e8f9, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  financial future
                </span>
              </h2>
              <p className="text-base leading-relaxed max-w-xs"
                 style={{ color: "rgba(255,255,255,0.60)" }}>
                Smart budgeting, goal tracking, and real-time insights — all in one beautifully designed dashboard.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-2.5 max-w-sm">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="ft-pill flex items-start gap-3.5 px-4 py-3.5 rounded-2xl cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    animationDelay: `${i * 80}ms`,
                  }}>
                  <span className="text-xl mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed"
                       style={{ color: "rgba(255,255,255,0.50)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex" style={{ marginRight: "4px" }}>
              {AVATARS.map((a, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             text-white text-xs font-bold"
                  style={{
                    background: a.bg,
                    border: "2px solid #5b21b6",
                    marginLeft: i > 0 ? "-10px" : "0",
                  }}>
                  {a.letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(s => <IconStar key={s} />)}
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                4.9 / 5 from 2,000+ reviews
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT PANEL — form
        ════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-center
                        px-5 sm:px-10 md:px-14 py-12 overflow-y-auto relative">

          {/* Mobile ambient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden lg:hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
              style={{ background: "rgba(99,102,241,0.12)", filter: "blur(70px)" }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
              style={{ background: "rgba(139,92,246,0.10)", filter: "blur(60px)" }} />
          </div>

          <div className="relative w-full max-w-[400px] ft-fade-up">

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
                Welcome back 👋
              </h1>
              <p className="text-sm mt-1.5"
                 style={{ color: "var(--text-secondary, #64748b)" }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* ── Card ────────────────────────────────────── */}
            <div className="rounded-2xl p-6 sm:p-8"
              style={{
                background: "var(--surface, #ffffff)",
                border: "1px solid var(--border, #e2e8f0)",
                boxShadow: "0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              }}>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted, #94a3b8)" }}>
                    Email Address
                  </label>
                  <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border
                                   transition-all duration-200
                                   ${focused === "email" ? "ft-field-focused" : ""}`}
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: focused === "email" ? "#6366f1" : "var(--border, #e2e8f0)",
                    }}>
                    <IconMail className="w-4 h-4 shrink-0"
                      style={{ color: focused === "email" ? "#6366f1" : "var(--text-muted,#94a3b8)" }} />
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      className="ft-input flex-1 bg-transparent text-sm border-none"
                      style={{
                        color: "var(--text-primary, #0f172a)",
                        caretColor: "#6366f1",
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted, #94a3b8)" }}>
                      Password
                    </label>
                    <button type="button"
                      className="text-xs font-semibold hover:opacity-75 transition-opacity duration-150"
                      style={{ color: "#6366f1" }}>
                      Forgot password?
                    </button>
                  </div>
                  <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border
                                   transition-all duration-200
                                   ${focused === "password" ? "ft-field-focused" : ""}`}
                    style={{
                      background: "var(--surface-raised, #f8fafc)",
                      borderColor: focused === "password" ? "#6366f1" : "var(--border, #e2e8f0)",
                    }}>
                    <IconLock className="w-4 h-4 shrink-0"
                      style={{ color: focused === "password" ? "#6366f1" : "var(--text-muted,#94a3b8)" }} />
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                      className="ft-input flex-1 bg-transparent text-sm border-none"
                      style={{
                        color: "var(--text-primary, #0f172a)",
                        caretColor: "#6366f1",
                      }}
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="shrink-0 hover:opacity-70 transition-opacity duration-150"
                      style={{ color: "var(--text-muted, #94a3b8)" }}>
                      {showPass
                        ? <IconEyeOff className="w-4 h-4" />
                        : <IconEye    className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Feedback */}
                {message.text && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm
                                  border ft-scale-in"
                    style={{
                      background: message.type === "success"
                        ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
                      borderColor: message.type === "success"
                        ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
                      color: message.type === "success" ? "#16a34a" : "#dc2626",
                    }}>
                    {message.type === "success" ? (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2
                             2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    )}
                    <span className="font-medium">{message.text}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="ft-btn-primary w-full flex items-center justify-center gap-2
                             py-3.5 rounded-xl text-white font-semibold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 18px rgba(99,102,241,0.40)",
                  }}>
                  {loading ? (
                    <>
                      <svg className="ft-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <IconArrow className="w-4 h-4 transition-transform duration-200
                                            group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "var(--border, #e2e8f0)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted, #94a3b8)" }}>
                New to FinTrackr?
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--border, #e2e8f0)" }} />
            </div>

            {/* Create account */}
            <Link to="/signup"
              className="ft-btn-outline w-full flex items-center justify-center gap-2
                         py-3 rounded-xl text-sm font-semibold border"
              style={{
                color: "#6366f1",
                borderColor: "var(--border, #e2e8f0)",
                background: "var(--surface, #ffffff)",
              }}>
              Create a free account
              <IconArrow className="w-4 h-4" />
            </Link>

            {/* Footer */}
            <p className="text-center text-xs mt-6"
               style={{ color: "var(--text-muted, #94a3b8)" }}>
              By continuing you agree to our{" "}
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

export default Login;