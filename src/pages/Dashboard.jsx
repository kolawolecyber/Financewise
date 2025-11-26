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
    }
  };

  // Calculate expenses for each budget
  const expensesByBudget = {};
  budgets.forEach((budget) => {
    expensesByBudget[budget.id] = expenses
      .filter((e) => Number(e.budgetId) === Number(budget.id))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  });

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen transition-colors duration-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            📊 Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your budgets, expenses, and financial health in one place.
          </p>
        </div>

        {/* Create Budget Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-10 transition-colors duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center justify-center gap-2">
            <span className="text-3xl animate-bounce">➕</span> Create New Budget
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {["title","amount","category","month"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-300 capitalize mb-1">
                  {field}
                </label>
                <input
                  type={field === "amount" ? "number" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="mt-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-400 focus:outline-none shadow-sm transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            ))}

            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-3 rounded-2xl font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                + Create Budget
              </button>
            </div>
          </form>
        </div>

        {/* Budget Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingBudgets ? (
            <p className="text-gray-500 animate-pulse col-span-full text-center">
              📊 Loading budgets...
            </p>
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

        {/* Budget Chart Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            📈 Spending Overview
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            {loadingExpenses ? (
              <p className="text-gray-500 animate-pulse text-center">
                Loading chart...
              </p>
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
