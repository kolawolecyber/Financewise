import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchBudgets, createBudget, fetchExpenses } from "../utils/Api";
import BudgetCardWithExpenses from "../components/BudgetCardWithExpense";
import BudgetChart from "../components/BudgetChart"; 
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    month: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/Login");
    } else {
      setLoadingBudgets(true);
      setLoadingExpenses(true);

      fetchBudgets(token)
        .then((data) => setBudgets(data))
        .finally(() => setLoadingBudgets(false));

      fetchExpenses(token)
        .then((data) => setExpenses(data))
        .finally(() => setLoadingExpenses(false));
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await createBudget(token, {
      ...form,
      amount: parseFloat(form.amount),
    });
    if (data?.id) {
      setBudgets((prev) => [...prev, data]);
      setForm({ title: "", amount: "", category: "", month: "" });
      setShowForm(false);
    }
  };

  // Calculate expenses for each budget
  const expensesByBudget = {};
  budgets.forEach((budget) => {
    expensesByBudget[budget.id] = expenses
      .filter((e) => Number(e.budgetId) === Number(budget.id))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  });

  // Calculate total stats
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1A] via-[#1a0f2e] to-[#0F0A1A] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Header with Stats */}
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Financial Dashboard
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Monitor your finances with real-time insights 💰
              </p>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showForm ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Budget
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Budget Card */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">Budget</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Budget</p>
              <p className="text-3xl font-bold text-white">${totalBudget.toLocaleString()}</p>
            </div>

            {/* Total Spent Card */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">Spent</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-white">${totalSpent.toLocaleString()}</p>
            </div>

            {/* Remaining Card */}
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${remaining >= 0 ? 'text-cyan-400 bg-cyan-500/10' : 'text-red-400 bg-red-500/10'} px-3 py-1 rounded-full`}>
                  {remaining >= 0 ? 'Remaining' : 'Overspent'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Available Funds</p>
              <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Create Budget Form - Sliding Panel */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[600px] opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Create New Budget</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "title", label: "Budget Title", type: "text", icon: "📝", placeholder: "e.g., Monthly Groceries" },
                { name: "amount", label: "Amount", type: "number", icon: "💵", placeholder: "e.g., 500" },
                { name: "category", label: "Category", type: "text", icon: "🏷️", placeholder: "e.g., Food" },
                { name: "month", label: "Month", type: "text", icon: "📅", placeholder: "e.g., January 2025" }
              ].map((field) => (
                <div key={field.name} className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <span>{field.icon}</span>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-3/4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                    required
                    step={field.type === "number" ? "0.01" : undefined}
                  />
                </div>
              ))}

              <div className="sm:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl font-bold text-white shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Budget
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Budgets</h2>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-semibold">
              {budgets.length}
            </span>
          </div>

          {loadingBudgets ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 text-lg animate-pulse">Loading your budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No budgets yet</h3>
              <p className="text-gray-500 mb-6">Create your first budget to start tracking expenses</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold text-white hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget, index) => (
                <div
                  key={budget.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BudgetCardWithExpenses
                    budget={budget}
                    token={token}
                    onDeleteBudget={(deletedId) =>
                      setBudgets((prev) => prev.filter((b) => b.id !== deletedId))
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Chart Section */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Spending Analytics</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            {loadingExpenses ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-400 text-lg animate-pulse">Analyzing your expenses...</p>
              </div>
            ) : (
              <div className="w-full h-80">
                <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;