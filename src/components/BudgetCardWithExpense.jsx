import React, { useEffect, useState } from "react";
// Import preserved for your local environment
import API from "../services/api";
import { 
  Trash2, 
  Plus, 
  X, 
  Wallet, 
  ArrowUpRight, 
  TrendingDown,
  History,
  LayoutGrid,
  CreditCard
} from "lucide-react";

const App = () => {
  // Safe check for API for preview environment
  const safeAPI = typeof API !== 'undefined' ? API : null;

  // State to manage the budget data
  const [budget, setBudget] = useState({
    id: "1",
    title: "Monthly Groceries",
    amount: 50000,
    category: "Food & Drinks",
    userId: "user_1"
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 lg:p-20 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] tracking-[0.3em] uppercase">
              <LayoutGrid size={14} />
              <span>Financial Overview</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Budget <span className="text-indigo-600">Details.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Plan</span>
              <span className="text-sm font-bold text-slate-700">Premium Business</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
              <CreditCard size={20} />
            </div>
          </div>
        </header>

        {/* Main Content Layout - Fully Responsive Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Main Card Component - Adapts width based on container */}
          <div className="w-full lg:flex-1 max-w-2xl">
            <BudgetCard budget={budget} token="mock-token" safeAPI={safeAPI} />
          </div>
          
          {/* Desktop Sidebar Info - Only visible on LG+ screens */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 transition-transform hover:scale-[1.02]">
              <h4 className="text-lg font-black mb-2 leading-tight">Smart Saving Tip</h4>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
                You've spent 12% less on groceries this week compared to last month. Keep it up to reach your goals!
              </p>
            </div>
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Stats</h4>
              <div className="space-y-4">
                {[
                  { label: "Transactions", val: "14" },
                  { label: "Avg. Daily", val: "₦1,200" },
                  { label: "Status", val: "On Track" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0">
                    <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                    <span className="text-xs font-black text-slate-900">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const BudgetCard = ({ budget, token, onDeleteBudget, safeAPI }) => {
  const [expenses, setExpenses] = useState([
    { id: '1', description: 'Fresh Fruits', amount: 4500, date: new Date().toISOString() },
    { id: '2', description: 'Cereal & Milk', amount: 2800, date: new Date().toISOString() },
    { id: '3', description: 'Beef Cutlets', amount: 7200, date: new Date().toISOString() },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "" });

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const remaining = Number(budget.amount) - totalSpent;
  const progress = Math.min((totalSpent / Number(budget.amount)) * 100, 100);

  // Sync with API if available
  useEffect(() => {
    if (safeAPI?.get) {
      safeAPI.get(`/api/expenses/${budget.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setExpenses(res.data || []))
        .catch(err => console.error("Sync error:", err));
    }
  }, [budget.id, token, safeAPI]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    
    setIsLoading(true);
    try {
      if (safeAPI?.post) {
        const res = await safeAPI.post("/api/expenses", {
          description: form.title,
          amount: form.amount,
          category: budget.category,
          date: new Date().toISOString(),
          userId: budget.userId,
          budgetId: budget.id,
        }, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data) setExpenses(prev => [res.data, ...prev]);
      } else {
        // Fallback for preview mode
        const newExp = {
          id: Math.random().toString(),
          description: form.title,
          amount: form.amount,
          date: new Date().toISOString()
        };
        setExpenses(prev => [newExp, ...prev]);
      }
      setForm({ title: "", amount: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/40 border border-slate-50 overflow-hidden transition-all duration-500 hover:shadow-indigo-200/50">
      {/* Header Section */}
      <div className="p-8 pb-4 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Wallet size={20} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400/80">
              {budget.category}
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none pt-1">{budget.title}</h2>
        </div>
        <button 
          onClick={() => onDeleteBudget?.(budget.id)}
          className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Hero Balance Card */}
      <div className="px-8 mb-8">
        <div className="relative p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden shadow-xl shadow-slate-200">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Remaining Fund</p>
            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">
              ₦{remaining.toLocaleString()}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Budget Usage</span>
                <span className={progress > 90 ? 'text-red-400' : 'text-indigo-400'}>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-[2px]">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${progress > 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Responsive Column Counts */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white transition-colors group">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <ArrowUpRight size={14} className="text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Budget Limit</span>
          </div>
          <p className="text-lg font-black text-slate-900">₦{Number(budget.amount).toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white transition-colors group">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <TrendingDown size={14} className="text-indigo-500 transition-transform group-hover:translate-y-0.5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Total Spent</span>
          </div>
          <p className="text-lg font-black text-slate-900">₦{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Area: Add Expense */}
      <div className="px-8 mb-10">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-[2rem] border border-slate-100/50 shadow-inner">
            <input
              type="text"
              placeholder="What did you buy?"
              className="w-full px-5 py-3 bg-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-10 pr-5 py-4 bg-white rounded-2xl text-sm font-black text-slate-900 placeholder:text-slate-200 outline-none shadow-sm shadow-slate-100"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all hover:bg-indigo-700 flex items-center justify-center"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={24}/>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transaction History */}
      <div className="px-8 pb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <History size={16} className="text-indigo-400" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Recent Activity</h4>
          </div>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{expenses.length} Trans.</span>
        </div>
        
        <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2 custom-scrollbar">
          {expenses.length === 0 ? (
             <div className="text-center py-10 text-slate-300 italic text-sm">No expenses yet</div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-50 rounded-[1.8rem] hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/40 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm flex-shrink-0">
                    {exp.description?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{exp.description}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-sm font-black text-slate-900">₦{Number(exp.amount).toLocaleString()}</span>
                  <button className="p-2 text-slate-200 hover:text-red-400 transition-colors active:scale-90">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
      `}} />
    </div>
  );
};

export default App;