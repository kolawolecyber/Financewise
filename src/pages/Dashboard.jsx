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
  const [loading, setLoading] = useState(true);
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
      const loadData = async () => {
        try {
          setLoading(true);
          const [budgetsData, expensesData] = await Promise.all([
            fetchBudgets(token),
            fetchExpenses(token),
          ]);
          setBudgets(budgetsData);
          setExpenses(expensesData);
        } catch (err) {
          console.error("Error loading dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
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

  // Skeleton for BudgetCard
  const SkeletonBudgetCard = () => (
    <div className="p-4 border rounded shadow animate-pulse bg-white">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  // Skeleton for Chart
  const SkeletonChart = () => (
    <div className="w-full h-64 md:h-80 mt-8 border rounded animate-pulse bg-gray-200 flex items-center justify-center">
      <div className="text-gray-400">Loading chart...</div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Budget Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-6 bg-white p-4 rounded shadow"
      >
        <h2 className="font-semibold text-lg">Create Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="month"
            value={form.month}
            onChange={handleChange}
            placeholder="e.g. July"
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Budget
        </button>
      </form>

      {/* Budgets + Expenses Display */}
      <div className="space-y-6">
        {loading
          ? [1, 2, 3].map((i) => <SkeletonBudgetCard key={i} />)
          : budgets.map((budget) => (
              <BudgetCardWithExpenses
                key={budget.id}
                budget={budget}
                token={token}
                onDeleteBudget={(deletedId) =>
                  setBudgets((prev) => prev.filter((b) => b.id !== deletedId))
                }
              />
            ))}
      </div>

      {/* Chart */}
      {loading ? (
        <SkeletonChart />
      ) : (
        <div className="w-full h-64 md:h-80 mt-8">
          <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
