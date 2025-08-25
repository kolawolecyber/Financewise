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
     const [loadingBudgets, setLoadingBudgets] = useState(true); // 👈 loading states
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [form, setForm] = useState({
    title: "",
    amount: 0,
    category: "",
    month: "",
  });

  useEffect(() => {
     console.log("Token:", token);
    if (!token) {
      navigate('/Login');
    } else {
       setLoadingBudgets(true);
      setLoadingExpenses(true);
      fetchBudgets(token).then((data) => setBudgets(data))
      .finally(() => setLoadingBudgets(false));
       fetchExpenses(token).then((data) => setExpenses(data)) 
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
  expensesByBudget[budget.id] =expenses
  .filter((e) => Number(e.budgetId) === Number(budget.id))
    .reduce((sum, e) => sum + Number(e.amount), 0);
    
});
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Budget Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded shadow">
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
         {loadingBudgets ? (
          <p className="text-gray-500 animate-pulse"> 📊 Loading budgets...</p>
        ) :
        budgets.map((budget) => (
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
      <div className="w-full h-64 md:h-80 mt-8">
         {loadingExpenses ? (
          <p className="text-gray-500 animate-pulse">Loading chart...</p>
        ) :(
    <div className="w-full mt-8 border border-red-500" style={{ height: "300px" }}>
  <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
</div>
        )}
        
</div>
    </div>
  );
};

export default Dashboard;
