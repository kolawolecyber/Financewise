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
    // Intentionally same dependency behavior as original
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            💸 Transactions
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Add, view, and analyze your incomes and expenses.
          </p>
        </header>

        {/* Grid: Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Form (large) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Transaction</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    required
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>

                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.type})
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:scale-105 transform transition"
                  >
                    + Add Transaction
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions list */}
            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-12 h-12 rounded-full bg-pink-200 animate-ping" />
                  <p className="text-gray-500 mt-3">Loading Transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No transactions yet.</div>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{
                          background:
                            t.type === "income"
                              ? "linear-gradient(135deg,#8ef6c2,#34d399)"
                              : "linear-gradient(135deg,#ffb3c6,#ff7aa2)",
                        }}
                      >
                        {t.title?.charAt(0)?.toUpperCase() || "T"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{t.title}</div>
                        <div className="text-sm text-gray-500">
                          {t.category?.name || "No Category"} • {t.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₦{Number(t.amount).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary / Totals (right column) */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-purple-100">
              <h3 className="text-sm text-gray-500">Total Income</h3>
              <div className="text-2xl font-bold text-green-600">₦{totalIncome.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xl border border-pink-100">
              <h3 className="text-sm text-gray-500">Total Expenses</h3>
              <div className="text-2xl font-bold text-red-600">₦{totalExpense.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xl border border-teal-100">
              <h3 className="text-sm text-gray-500">Balance</h3>
              <div className="text-2xl font-bold text-blue-600">₦{balance.toLocaleString()}</div>
            </div>
          </aside>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <TransactionChart transactions={transactions} />
        </div>

        {/* Totals Table (keeps original totals UI but restyled) */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm bg-white shadow-lg rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-pink-50 to-purple-50 text-gray-700">
                <th className="px-4 py-3 border">Total Income</th>
                <th className="px-4 py-3 border">Total Expenses</th>
                <th className="px-4 py-3 border">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center font-semibold bg-white">
                <td className="px-4 py-4 border text-green-600">₦{totalIncome.toLocaleString()}</td>
                <td className="px-4 py-4 border text-red-600">₦{totalExpense.toLocaleString()}</td>
                <td className="px-4 py-4 border text-blue-600">₦{balance.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
