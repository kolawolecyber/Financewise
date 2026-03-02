import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AppLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Persist theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const navItem = (path, label) => (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${
        location.pathname === path
          ? "bg-primary text-white shadow-md"
          : "text-textSecondary hover:bg-gray-100 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-bg text-textPrimary transition-colors duration-300">
      
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-surface border-r border-border p-4 transition-all duration-300 hidden md:flex flex-col`}
      >
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">
              FinTrackr
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-textSecondary"
          >
            ☰
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {navItem("/", "Dashboard")}
          {navItem("/transactions", "Transactions")}
          {navItem("/goals", "Goals")}
          {navItem("/goal-dashboard", "Goal Dashboard")}
          {navItem("/category", "Categories")}
          {navItem("/profile", "Profile")}
          {navItem("/usersettings", "Settings")}
        </nav>

        <div className="mt-auto">
          <button
            onClick={toggleTheme}
            className="w-full mt-6 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
          >
            Toggle Theme
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold capitalize">
            {location.pathname.replace("/", "") || "Dashboard"}
          </h2>
        </header>

        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}