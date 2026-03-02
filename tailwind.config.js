/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include all components/pages
  ],
  darkMode: "class", // enable dark mode via 'class'
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        surface: "#FFFFFF",
        background: "#F8FAFC",
        darkbg: "#0F172A",
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        premium: "0 10px 25px -5px rgba(0,0,0,0.08)",
        card: "0 4px 12px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};