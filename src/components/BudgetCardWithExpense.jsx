import { useEffect, useState } from "react";
import API from "../services/api";

const BudgetCardWithExpenses = ({ budget, token, onDeleteBudget }) => {
  const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({ title: "", amount: "" });
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

const totalSpent = budget.totalSpent;
const remaining = budget.remaining;

//Fetch expenses using useEffect with API get 
  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await API.get(`/api/expenses/${budget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    };
    fetchExpenses();
  }, [budget.id, token]);

  //handle changes of the Forms
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit button for API post request
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post(
      "/api/expenses",
      {
        description: form.title,
        amount: form.amount,
        category: budget.category,
        date: new Date().toISOString(),
        userId: budget.userId, // or get from decoded token
        budgetId: budget.id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data?.id) {
      setExpenses((prev) => [...prev, res.data]);
      setForm({ title: "", amount: "" });
    }
  } catch (error) {
    console.error("Failed to add expense:", error);
    alert("Error adding expense. Check console.");
  }
};

const handleDeleteExpense = async (expenseId) => {
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
        amount: editForm.amount,
        date: new Date().toISOString(), // or use original date
        category: budget.category,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Replace updated expense in the list
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? res.data : e))
    );

    setEditingId(null);
  } catch (err) {
    console.error("Failed to update:", err);
    alert("Update failed");
  }
};



  const handleDeleteBudget = async () => {
    try{
    await API.delete(`/api/budgets/${budget.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (onDeleteBudget) onDeleteBudget(budget.id); // ✅ prevent "undefined" call
  } catch (error) {
    console.error("Failed to delete budget:", error);
    alert("Failed to delete budget.");
  }
  };
  return (
    <div className="bg-white rounded shadow p-4">
         <div className="flex justify-between items-start">
        <div>
      <h2 className="text-xl font-semibold mb-2">{budget.title}</h2>
      <p className="mb-1">Category: {budget.category}</p>
      <p className="mb-1">Month: {budget.month}</p>
</div>
  <button
          onClick={handleDeleteBudget}
          className="text-red-500 hover:underline text-sm"
        >
          Delete Budget
        </button>
</div>
      <p className="mb-1">Total Budget: ₦{budget.amount}</p>
      <p className="mb-3 text-green-600 font-bold">
     <p>  Total Spent :  ₦ {totalSpent} </p> 
     <p>   Remaining: ₦{remaining} </p>

      </p>

      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Expense title"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <ul className="space-y-2">
       {expenses.map((expense) => (
  <li key={expense.id} className="bg-gray-100 p-2 rounded">
    {editingId === expense.id ? (
      <>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="border p-1 rounded mb-1 w-full"
        />
        <input
          type="number"
          value={editForm.amount}
          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
          className="border p-1 rounded mb-1 w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateExpense(expense.id)}
            className="text-green-600 text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="font-semibold">{expense.description}</div>
        <div>₦{expense.amount}</div>
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => {
              setEditingId(expense.id);
              setEditForm({ title: expense.description, amount: expense.amount });
            }}
            className="text-blue-500 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteExpense(expense.id)}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        </div>
      </>
    )}
  </li>
))}

        
      
      </ul>
    </div>
  );
};

export default BudgetCardWithExpenses;
