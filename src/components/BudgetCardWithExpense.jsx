import { useEffect, useState } from "react";
import API from "../services/api";

const BudgetCardWithExpenses = ({ budget, token, onDeleteBudget }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "" });
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "" });

  // Calculate spent & remaining (fallback if API doesn't send them)
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = Math.max(0, budget.amount - totalSpent);
  const percentage = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get(`/api/expenses/${budget.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data || []);
      } catch (err) {
        console.error("Failed to load expenses for budget:", budget.id);
      }
    };
    fetchExpenses();
  }, [budget.id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        "/api/expenses",
        {
          description: form.title,
          amount: parseFloat(form.amount),
          category: budget.category,
          date: new Date().toISOString(),
          userId: budget.userId,
          budgetId: budget.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.id) {
        setExpenses((prev) => [...prev, res.data]);
        setForm({ title: "", amount: "" });
      }
    } catch (error) {
      alert("Oops! Couldn’t add expense. Try again ♡");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm("Delete this expense?")) return;
    await API.delete(`/api/expenses/${expenseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  const handleUpdateExpense = async (expenseId) => {
    try {
      const res = await API.put(
        `/api/expenses/${expenseId}`,
        {
          description: editForm.title,
          amount: parseFloat(editForm.amount),
          category: budget.category,
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses((prev) =>
        prev.map((e) => (e.id === expenseId ? res.data : e))
      );
      setEditingId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDeleteBudget = async () => {
    if (!confirm("Delete entire budget and all its expenses?")) return;
    try {
      await API.delete(`/api/budgets/${budget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleteBudget?.(budget.id);
    } catch (error) {
      alert("Couldn’t delete budget");
    }
  };

  return (
    <div className="group relative backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Cute Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {budget.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {budget.category} • {budget.month}
            </p>
          </div>
          <button
            onClick={handleDeleteBudget}
            className="text-red-400 hover:text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Delete
          </button>
        </div>

        {/* Budget Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Budget</span>
            <span className="font-bold text-purple-600">₦{budget.amount.toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent</span>
              <span className="font-semibold text-pink-600">₦{totalSpent.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  percentage > 90
                    ? "bg-red-400"
                    : percentage > 70
                    ? "bg-orange-400"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining</span>
              <span className={`font-bold ${remaining > 0 ? "text-green-600" : "text-red-600"}`}>
                ₦{remaining.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="px-6 pb-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What did you spend on?"
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition bg-white/70"
            required
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full sm:w-32 px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition bg-white/70"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Add
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="border-t border-gray-100 px-6 py-4 max-h-80 overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No expenses yet — all clean!</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-gray-100 hover:border-purple-200 transition"
              >
                {editingId === expense.id ? (
                  <>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl mb-2"
                    />
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl mb-3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateExpense(expense.id)}
                        className="text-green-600 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800">{expense.description}</div>
                        <div className="text-lg font-bold text-pink-600">₦{expense.amount.toLocaleString()}</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <button
                          onClick={() => {
                            setEditingId(expense.id);
                            setEditForm({ title: expense.description, amount: expense.amount });
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cute little decoration */}
      <div className="absolute -top-4 -right-4 text-7xl opacity-10 pointer-events-none select-none">
        {percentage > 80 ? "(warning)" : "(happy face)"}
      </div>
    </div>
  );
};

export default BudgetCardWithExpenses;