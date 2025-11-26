import React, { useEffect, useState, useContext } from "react";

// ====================================================================
// MOCK DEPENDENCIES (For single-file runnability - DO NOT MODIFY LOGIC)
// ====================================================================

// Placeholder for react-router-dom's useNavigate
const useNavigate = () => (path) => console.log(`Navigating to ${path}`);

// Placeholder for AuthContext and useAuth
const AuthContext = React.createContext({ token: "MOCK_TOKEN" });
const useAuth = () => useContext(AuthContext);

// Placeholder for API functions
const fetchBudgets = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 1, title: "Groceries", amount: 500, category: "Food", month: "Nov" },
    { id: 2, title: "Rent", amount: 1500, category: "Housing", month: "Nov" },
    { id: 3, title: "Savings", amount: 300, category: "Financial", month: "Nov" },
  ];
};

const fetchExpenses = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: 101, budgetId: 1, amount: 200, description: "Weekly shop" },
    { id: 102, budgetId: 2, amount: 1500, description: "Monthly payment" },
    { id: 103, budgetId: 1, amount: 50, description: "Coffee run" },
    { id: 104, budgetId: 3, amount: 100, description: "IRA contribution" },
  ];
};

const createBudget = async (token, budgetData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id: Math.random(), ...budgetData };
};

// ====================================================================
// MOCK UI COMPONENTS
// ====================================================================

// Mock Navbar - Clean, standard header
const Navbar = () => (
  <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="text-xl font-extrabold text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 align-text-bottom"><path d="M12 20h9"/><path d="M16 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/><path d="M10 2v4"/><path d="M14 2v4"/><path d="M17 14h-7"/><path d="M17 18h-7"/><path d="M7 7h4v4H7z"/></svg>
        FinanceFlow
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 hidden sm:inline">User: MOCK_TOKEN</span>
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">JS</div>
      </div>
    </div>
  </header>
);

// Mock BudgetCardWithExpenses - Modernized Card Design
const BudgetCardWithExpenses = ({ budget, token, onDeleteBudget }) => {
  const expenseProgress = 250 / budget.amount; // Mock progress for visual
  const percentage = Math.round(expenseProgress * 100);
  const color = percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{budget.title}</h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {budget.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">Target: ${budget.amount} / Spent: $250 (Mock)</p>
      
      {/* Modern Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${Math.min(100, percentage)}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
          <span>{budget.month}</span>
        </div>
        <button
          onClick={() => onDeleteBudget(budget.id)}
          className="text-red-500 hover:text-red-700 transition duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
};

// Mock BudgetChart - Simple visual placeholder
const BudgetChart = ({ budgets, expensesByBudget }) => {
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalExpense = Object.values(expensesByBudget).reduce((sum, e) => sum + e, 0);
  const expensePercentage = totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;
  
  // Minimalistic Chart Placeholder using SVG
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (expensePercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
      <svg width="200" height="200" className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          stroke="#e5e7eb"
          strokeWidth="20"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
        />
        {/* Progress Ring */}
        <circle
          stroke="#4f46e5" /* Indigo color for chart */
          strokeWidth="20"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.8s ease-out',
          }}
        />
      </svg>
      <div className="text-center">
        <p className="text-3xl font-extrabold text-gray-800">
          {Math.round(expensePercentage)}%
        </p>
        <p className="text-gray-500">of Total Budget Spent</p>
      </div>
    </div>
  );
};

// ====================================================================
// MAIN DASHBOARD COMPONENT (Refactored for Modern Aesthetics)
// ====================================================================

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [form, setForm] = useState({
    title: "",
    amount: "", // Kept as string for controlled input
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
    <AuthContext.Provider value={{ token }}>
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pb-16"> 
          {/* Use soft gray background, removed complex gradient for cleaner look */}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header: Enhanced Typography and Spacing */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                Welcome to your Dashboard
              </h1>
              <p className="text-xl text-gray-500 mt-2">
                Track your budgets, expenses, and financial health in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Create Budget Form - RESTRUCTURED AND MODERNIZED */}
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-2xl border border-indigo-500/10 h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        Create New Budget
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Food Budget"
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="e.g. 500.00"
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Groceries"
                                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Month</label>
                                <input
                                    type="text"
                                    name="month"
                                    value={form.month}
                                    onChange={handleChange}
                                    placeholder="e.g. November"
                                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transition duration-300 transform hover:scale-[1.01] flex items-center justify-center mt-6"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                            Create Budget
                        </button>
                    </form>
                </div>
                
                {/* 2. Budget Chart - Occupies a third column on desktop */}
                <div className="lg:col-span-2 order-first lg:order-none">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">📈 Spending Overview</h2>
                    <div className="bg-white rounded-3xl shadow-2xl p-6 h-96 flex items-center justify-center border border-gray-100">
                        {loadingExpenses ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                <p className="text-gray-500 mt-4">Loading financial chart...</p>
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                <BudgetChart budgets={budgets} expensesByBudget={expensesByBudget} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Display Budget Section - Full width under the main grid */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Your Active Budgets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loadingBudgets ? (
                        <p className="text-indigo-500 col-span-full">
                           <span className="animate-pulse">Loading budgets...</span>
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
            </div>

          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

// Main export as per the single-file React requirement
export default Dashboard;