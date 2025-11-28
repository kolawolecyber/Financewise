import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TransactionChart from "../components/TransactionChart";

const Transaction = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    date: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchTransactions().finally(() => setLoading(false));
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateParts = form.date.split("-");
      const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;

      await API.post(
        "/api/transactions",
        {
          ...form,
          date: formattedDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ title: "", amount: "", type: "expense", categoryId: "", date: "" });
      fetchTransactions();
    } catch (err) {
      console.error("Failed to create transaction", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1A] via-[#1a0f2e] to-[#0F0A1A] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-green-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Transactions
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Track every income and expense with precision 💸
          </p>
        </div>

        {/* Main Grid: Form + Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Form + Transaction List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span>📝</span>
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., Grocery Shopping"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span>💵</span>
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="e.g., 5000"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                      required
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span>🔖</span>
                      Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="expense" className="bg-gray-800">💸 Expense</option>
                      <option value="income" className="bg-gray-800">💰 Income</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span>🏷️</span>
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-800">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-gray-800">
                          {cat.name} ({cat.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <span>📅</span>
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl font-bold text-white shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Transaction
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Transactions</h2>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-semibold">
                  {transactions.length}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-400 text-lg animate-pulse">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No transactions yet</h3>
                  <p className="text-gray-500">Add your first transaction to start tracking</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t, index) => (
                    <div
                      key={t.id}
                      className="group bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.01] shadow-lg hover:shadow-2xl animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            style={{
                              background:
                                t.type === "income"
                                  ? "linear-gradient(135deg,#10b981,#059669)"
                                  : "linear-gradient(135deg,#f472b6,#ec4899)",
                            }}
                          >
                            {t.title?.charAt(0)?.toUpperCase() || "T"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg truncate">{t.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-400">
                                {t.category?.name || "No Category"}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-sm text-gray-400">{t.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                          <div
                            className={`text-xl font-bold ${
                              t.type === "income" ? "text-green-400" : "text-pink-400"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}₦{Number(t.amount).toLocaleString()}
                          </div>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary Cards */}
          <aside className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Total Income Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full">Income</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Income</p>
              <p className="text-3xl font-bold text-green-400">₦{totalIncome.toLocaleString()}</p>
            </div>

            {/* Total Expenses Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">Expense</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-pink-400">₦{totalExpense.toLocaleString()}</p>
            </div>

            {/* Balance Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${balance >= 0 ? 'text-cyan-400 bg-cyan-500/10' : 'text-red-400 bg-red-500/10'} px-3 py-1 rounded-full`}>
                  Balance
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Net Balance</p>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                ₦{Math.abs(balance).toLocaleString()}
              </p>
            </div>
          </aside>
        </div>

        {/* Transaction Chart */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Analytics Overview</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <TransactionChart transactions={transactions} />
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">
                    Total Income
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-pink-400 uppercase tracking-wider">
                    Total Expenses
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-5 text-2xl font-bold text-green-400">
                    ₦{totalIncome.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-2xl font-bold text-pink-400">
                    ₦{totalExpense.toLocaleString()}
                  </td>
                  <td className={`px-6 py-5 text-2xl font-bold ${balance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                    ₦{balance.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;