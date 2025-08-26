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
    amount: 0,
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Track your budgets and expenses at a glance.
        </p>

        {/* Create Budget Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Budget</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Food Budget"
                className="w-full border p-2 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border p-2 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Groceries"
                className="w-full border p-2 rounded-lg mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Month</label>
              <input
                type="text"
                name="month"
                value={form.month}
                onChange={handleChange}
                placeholder="e.g. August"
                className="w-full border p-2 rounded-lg mt-1"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
              >
                + Create Budget
              </button>
            </div>
          </form>
        </div>

        {/* Budgets */}
        <div className="space-y-6">
          {loadingBudgets ? (
            <p className="text-gray-500 animate-pulse">📊 Loading budgets...</p>
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

        {/* Budget Chart */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
          <div className="bg-white rounded-2xl shadow-md p-4">
            {loadingExpenses ? (
              <p className="text-gray-500 animate-pulse">📈 Loading chart...</p>
            ) : (
              <div className="w-full h-72">
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
