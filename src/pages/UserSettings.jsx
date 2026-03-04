import { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


/* ── Icons ─────────────────────────────────────────────────────────── */
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
const IconGlobe = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8
         3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2
         0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0
         11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconTarget = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2
         2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0
         002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2
         2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconCamera = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0
         0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07
         7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconChevron = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IconCheck = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconArrowLeft = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const IconLock = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0
         00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

/* ── Currency options ───────────────────────────────────────────────── */
const CURRENCIES = [
  { value: "NGN", label: "NGN", name: "Nigerian Naira",  flag: "🇳🇬" },
  { value: "USD", label: "USD", name: "US Dollar",        flag: "🇺🇸" },
  { value: "GBP", label: "GBP", name: "British Pound",    flag: "🇬🇧" },
  { value: "EUR", label: "EUR", name: "Euro",             flag: "🇪🇺" },
  { value: "CAD", label: "CAD", name: "Canadian Dollar",  flag: "🇨🇦" },
  { value: "AUD", label: "AUD", name: "Australian Dollar",flag: "🇦🇺" },
];

/* ══════════════════════════════════════════════════════════════════════
   USER SETTINGS
══════════════════════════════════════════════════════════════════════ */
const UserSettings = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [previewSource, setPreviewSource] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", monthlyIncome: "",
    currency: "NGN", financialGoal: "", profilePic: "",
  });
  const [focused,  setFocused]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState({ show: false, type: "", msg: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/profile/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "", msg: "" }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name",           formData.name);
      data.append("monthlyIncome",  formData.monthlyIncome);
      data.append("currency",       formData.currency);
      data.append("financialGoal",  formData.financialGoal);
      if (formData.profilePic && formData.profilePic instanceof File)
        data.append("profilePic", formData.profilePic);

      await API.put("/api/profile/settings", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("success", "Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      console.error("Update failed", err);
      showToast("error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = formData?.name
    ? formData.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  /* ── Field config ─────────────────────────────────────────────── */
  const FIELDS = [
    {
      id: "name", label: "Full Name", type: "text",
      icon: IconUser, accent: "#6366f1", bg: "rgba(99,102,241,0.08)",
      placeholder: "John Doe", autoComplete: "name", disabled: false,
    },
    {
      id: "email", label: "Email Address", type: "email",
      icon: IconMail, accent: "#94a3b8", bg: "rgba(148,163,184,0.08)",
      placeholder: "you@example.com", autoComplete: "email", disabled: true,
      hint: "Email cannot be changed",
    },
    {
      id: "monthlyIncome", label: "Monthly Income", type: "number",
      icon: IconMoney, accent: "#22c55e", bg: "rgba(34,197,94,0.08)",
      placeholder: "0.00", autoComplete: "off", disabled: false,
    },
    {
      id: "financialGoal", label: "Financial Goal", type: "text",
      icon: IconTarget, accent: "#f59e0b", bg: "rgba(245,158,11,0.08)",
      placeholder: "e.g. Save for a house, build emergency fund…",
      autoComplete: "off", disabled: false,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes us-fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes us-scale-in {
          from { opacity:0; transform:scale(0.93); }
          to   { opacity:1; transform:scale(1);    }
        }
        @keyframes us-slide-down {
          from { opacity:0; transform:translateY(-16px); }
          to   { opacity:1; transform:translateY(0);     }
        }
        @keyframes us-spin {
          to { transform:rotate(360deg); }
        }

        .us-fade-up   { animation: us-fade-up   0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .us-scale-in  { animation: us-scale-in  0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .us-slide-down{ animation: us-slide-down 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .us-spin      { animation: us-spin 0.9s linear infinite; }

        .us-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1.5px solid var(--border, #e2e8f0);
        }
        .us-field:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16);
        }
        .us-field-disabled {
          border: 1.5px solid var(--border, #e2e8f0) !important;
          opacity: 0.65;
          cursor: not-allowed;
        }

        .us-input { outline:none; background:transparent; width:100%; }
        .us-input::placeholder { color:#94a3b8; }
        .us-input:disabled { cursor:not-allowed; }

        .us-select { outline:none; background:transparent; width:100%;
                     appearance:none; -webkit-appearance:none; cursor:pointer; }

        .us-save-btn {
          transition: all 0.2s ease;
          background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
          box-shadow: 0 4px 18px rgba(99,102,241,0.38);
        }
        .us-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.52);
        }
        .us-save-btn:active:not(:disabled) { transform:translateY(0); }
        .us-save-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .us-back-btn {
          transition: all 0.2s ease;
        }
        .us-back-btn:hover {
          background: rgba(99,102,241,0.08) !important;
          color: #6366f1 !important;
        }

        .us-avatar-ring {
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);
          padding: 3px;
          border-radius: 9999px;
        }
        .us-upload-zone {
          transition: all 0.2s ease;
          border: 2px dashed rgba(99,102,241,0.25);
        }
        .us-upload-zone:hover {
          border-color: #6366f1;
          background: rgba(99,102,241,0.04) !important;
        }

        .us-s1 { animation-delay:  60ms; }
        .us-s2 { animation-delay: 120ms; }
        .us-s3 { animation-delay: 180ms; }
        .us-s4 { animation-delay: 240ms; }
        .us-s5 { animation-delay: 300ms; }
      `}</style>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast.show && (
        <div className="fixed top-5 left-1/2 z-50 us-slide-down"
          style={{ transform: "translateX(-50%)" }}>
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm
                          font-semibold shadow-2xl"
            style={{
              background: toast.type === "success"
                ? "rgba(34,197,94,0.95)" : "rgba(239,68,68,0.95)",
              color: "#fff",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
            {toast.type === "success"
              ? <IconCheck className="w-4 h-4" style={{ color: "#fff" }} />
              : <span className="text-base">⚠</span>}
            {toast.msg}
          </div>
        </div>
      )}

      <div className="min-h-screen" style={{ background: "var(--bg, #f0f2ff)" }}>
        

        <div className="max-w-xl mx-auto px-4 pt-8 pb-24">

          {/* ── Header ────────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-7 us-fade-up">
            <button onClick={() => navigate("/profile")}
              className="us-back-btn w-9 h-9 rounded-xl flex items-center justify-center
                         border transition-colors duration-200"
              style={{
                background: "var(--surface, #fff)",
                borderColor: "var(--border, #e2e8f0)",
                color: "var(--text-secondary, #64748b)",
              }}>
              <IconArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary, #0f172a)" }}>
                Edit Profile
              </h1>
              <p className="text-xs mt-0.5"
                 style={{ color: "var(--text-secondary, #64748b)" }}>
                Update your personal and financial settings
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Avatar upload card ────────────────────────── */}
            <div className="us-fade-up rounded-2xl p-6"
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e2e8f0)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
              }}>

              <p className="text-xs font-semibold uppercase tracking-widest mb-5"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Profile Photo
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar preview */}
                <div className="us-avatar-ring shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden
                                  flex items-center justify-center"
                    style={{ background: "var(--surface, #fff)" }}>
                    {previewSource || formData?.profilePic ? (
                      <img src={previewSource || formData.profilePic}
                           alt="Profile"
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                        <span className="text-xl font-bold text-white">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload zone */}
                <label className="us-upload-zone flex-1 flex flex-col items-center
                                  justify-center gap-2 px-4 py-5 rounded-xl cursor-pointer"
                  style={{ background: "var(--surface-raised, #f8fafc)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.10)" }}>
                    <IconCamera className="w-4.5 h-4.5"
                      style={{ color: "#6366f1", width: "18px", height: "18px" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold"
                       style={{ color: "#6366f1" }}>
                      Click to upload photo
                    </p>
                    <p className="text-xs mt-0.5"
                       style={{ color: "var(--text-muted, #94a3b8)" }}>
                      PNG, JPG or WEBP · Max 5MB
                    </p>
                  </div>
                  <input type="file" name="profilePic" className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setFormData({ ...formData, profilePic: file });
                      previewFile(file);
                    }} />
                </label>
              </div>
            </div>

            {/* ── Personal info card ────────────────────────── */}
            <div className="us-fade-up us-s1 rounded-2xl p-6"
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e2e8f0)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
              }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Personal Information
              </p>

              <div className="space-y-4">
                {FIELDS.map((f, i) => (
                  <div key={f.id} className={`space-y-1.5 us-fade-up us-s${i + 1}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted, #94a3b8)" }}>
                        {f.label}
                      </label>
                      {f.disabled && (
                        <span className="flex items-center gap-1 text-xs"
                              style={{ color: "var(--text-muted, #94a3b8)" }}>
                          <IconLock className="w-3 h-3" style={{ color: "#94a3b8" }} />
                          {f.hint}
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-3 rounded-xl px-3.5 py-3
                                    ${f.disabled ? "us-field-disabled" : "us-field"}`}
                      style={{
                        background: f.disabled
                          ? "var(--surface-raised, #f8fafc)"
                          : "var(--surface-raised, #f8fafc)",
                      }}>
                      {/* Icon bubble */}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: f.bg }}>
                        <f.icon className="w-3.5 h-3.5"
                          style={{ color: f.accent, width: "14px", height: "14px" }} />
                      </div>

                      <input
                        type={f.type}
                        name={f.id}
                        value={formData[f.id] || ""}
                        placeholder={f.placeholder}
                        autoComplete={f.autoComplete}
                        disabled={f.disabled}
                        onChange={handleChange}
                        onFocus={() => setFocused(f.id)}
                        onBlur={() => setFocused("")}
                        className="us-input text-sm font-medium"
                        style={{
                          color: f.disabled
                            ? "var(--text-muted, #94a3b8)"
                            : "var(--text-primary, #0f172a)",
                          caretColor: "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Currency card ─────────────────────────────── */}
            <div className="us-fade-up us-s2 rounded-2xl p-6"
              style={{
                background: "var(--surface, #fff)",
                border: "1px solid var(--border, #e2e8f0)",
                boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
              }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Currency Preference
              </p>

              {/* Currency grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                {CURRENCIES.map(c => (
                  <button key={c.value} type="button"
                    onClick={() => setFormData({ ...formData, currency: c.value })}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                               border text-left transition-all duration-200"
                    style={{
                      background: formData.currency === c.value
                        ? "rgba(99,102,241,0.08)"  : "var(--surface-raised, #f8fafc)",
                      borderColor: formData.currency === c.value
                        ? "#6366f1" : "var(--border, #e2e8f0)",
                      transform: formData.currency === c.value ? "scale(1.02)" : "scale(1)",
                    }}>
                    <span className="text-lg">{c.flag}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold"
                        style={{ color: formData.currency === c.value
                          ? "#6366f1" : "var(--text-primary, #0f172a)" }}>
                        {c.label}
                      </p>
                      <p className="text-xs truncate"
                        style={{ color: "var(--text-muted, #94a3b8)" }}>
                        {c.name}
                      </p>
                    </div>
                    {formData.currency === c.value && (
                      <div className="ml-auto w-4 h-4 rounded-full shrink-0
                                      flex items-center justify-center"
                        style={{ background: "#6366f1" }}>
                        <IconCheck className="w-2.5 h-2.5" style={{ color: "#fff",
                          width: "10px", height: "10px" }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Fallback hidden select for form submission */}
              <input type="hidden" name="currency" value={formData.currency} />
              <p className="text-xs"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Selected:{" "}
                <span className="font-semibold" style={{ color: "#6366f1" }}>
                  {CURRENCIES.find(c => c.value === formData.currency)?.flag}{" "}
                  {CURRENCIES.find(c => c.value === formData.currency)?.name}
                </span>
              </p>
            </div>

            {/* ── Save button ───────────────────────────────── */}
            <div className="us-fade-up us-s5">
              <button type="submit" disabled={saving}
                className="us-save-btn w-full flex items-center justify-center
                           gap-2 py-4 rounded-2xl text-white font-semibold text-sm">
                {saving ? (
                  <>
                    <svg className="us-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving changes…
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" style={{ color: "#fff" }} />
                    Save Changes
                  </>
                )}
              </button>

              <p className="text-center text-xs mt-3"
                 style={{ color: "var(--text-muted, #94a3b8)" }}>
                Changes are saved securely and encrypted
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSettings;