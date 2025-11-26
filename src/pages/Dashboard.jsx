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
        .then((data => setBudgets(data))
        .finally(() => setLoadingBudgets(false)));

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
    }
  };

  const expensesByBudget = {};
  budgets.forEach((budget) => {
    expensesByBudget[budget.id] = expenses
      .filter((e) => Number(e.budgetId) === Number(budget.id))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Finance Dashboard
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Stay cute, stay in control of your money
            </p>
          </div>

          {/* Create Budget Card – Floating Glassmorphic Beauty */}
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">Create New Budget</span>
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Budget name"
                  className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/60 backdrop-blur"
                  required
                />
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all bg-white/60 backdrop-blur"
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white/60 backdrop-blur"
                  required
                />
                <input
                  type="text"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  placeholder="Month (e.g. August)"
                  className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white/60 backdrop-blur"
                  required
                />

                <div className="sm:col-span-2 lg:col-span-4 flex justify-center mt-4">
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
                  >
                    <span className="text-2xl">+</span> Create Budget
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Budget Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loadingBudgets ? (
              Array(6).fill().map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200/60 backdrop-blur rounded-3xl"></div>
                </div>
              ))
            ) : budgets.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-6xl mb-4">No budgets yet</p>
                <p className="text-xl text-gray-500">Create your first budget above!</p>
              </div>
            ) : (
              budgets.map((budget) => (
                <BudgetCardWithExpenses
                  key={budget.id}
                  budget={budget}
                  token={token}
                  onDeleteBudget={(deletedId) =>
                    setBudgets((prev) => prev.filter((b) => b.id !== deletedId))
                  }
                />
              ))
            )}
          </div>

          {/* Spending Overview Chart */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">Spending Overview</span>
            </h2>

            <div className="bg-white/80 rounded-2xl p-4 sm:p-8 shadow-inner">
              {loadingExpenses ? (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-gray-500 text-xl animate-pulse">Loading beautiful chart...</p>
                </div>
              ) : (
                <div className="w-full h-80 sm:h-96">
                  <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cute little floating decoration */}
      <div className="fixed bottom-6 right-6 text-6xl pointer-events-none select-none animate-bounce-slow">
      </div>
    </>
  );
};

export default Dashboard;