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
    <div>
       <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
     
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Track your budgets, expenses, and financial health in one place.
          </p>
        </div>

        {/* Create Bdget Form */}
        <div className=" bg-white p-6 rounded overflow-hidden w-36 h-28 shadow-lg mb-4 border-3 display:inline-flex border-gray-100 ">
          <h2 className="text-xl font-semibold mb-6  text-gray-800">➕ Create New Budget</h2>
          <form 
            onSubmit={handleSubmit} 
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label className=" text-sm text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Food Budget"
                className="w-40 border p-3 rounded-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-40 border p-3 rounded-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Groceries"
                className="w-40 border p-3 rounded-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Month</label>
              <input
                type="text"
                name="month"
                value={form.month}
                onChange={handleChange}
                placeholder="e.g. August"
                className="w-40 border p-3 rounded-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600  to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
              >
                + Create Budget
              </button>
            </div>
          </form>
        </div>

        {/* Display Budget Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📈 Spending Overview</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {loadingExpenses ? (
              <p className="text-gray-500 animate-pulse">Loading chart...</p>
            ) : (
              <div className="w-full h-80">
                <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
