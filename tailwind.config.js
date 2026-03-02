/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        primaryLight: "#818CF8",
        primaryDark: "#4F46E5",
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        surface: "#FFFFFF",
        surfaceDark: "#1E293B",
        background: "#F8FAFC",
        darkbg: "#0F172A",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
      },
      boxShadow: {
        premium: "0 10px 25px -5px rgba(0,0,0,0.08)",
        premiumDark: "0 10px 25px -5px rgba(0,0,0,0.2)",
        card: "0 4px 12px rgba(0,0,0,0.05)",
        button: "0 4px 14px rgba(0,0,0,0.1)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        colors: "background-color, border-color, color, fill, stroke",
      },
    },
  },
  plugins: [],
};