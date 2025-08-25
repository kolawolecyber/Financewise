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
  date: ""  
});


  useEffect(() => {
    setLoading(true);
    fetchTransactions().finally(()=>setLoading(false));
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

      await API.post("/api/transactions", {
  ...form,
  date: formattedDate
}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", amount: "", type: "expense", categoryId: "" });
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
  .filter(tx => tx.type === "income")
  .reduce((sum, tx) => sum + tx.amount, 0);

const totalExpense = transactions
  .filter(tx => tx.type === "expense")
  .reduce((sum, tx) => sum + tx.amount, 0);

const balance = totalIncome - totalExpense;


  return (
    <div className="max-w-2xl mx-auto p-6">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border p-2 rounded">
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
  className="w-full border p-2 rounded"
/>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Transaction</button>
      </form>

      <ul className="space-y-3">
         {loading ? (
  <p className="text-gray-600">Loading Transaction...</p>
) :(transactions.map((t) => (
          <li key={t.id} className="bg-gray-100 p-3 rounded shadow">
            <div className="font-bold">{t.title}</div>
            <div>₦{t.amount.toLocaleString()} | {t.type}</div>
            <div className="text-sm text-gray-500">
              {t.category?.name || "No Category"}

              <div>
                 <button
          onClick={() => handleDelete(t.id)}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
              </div>
            </div>
          </li>
        )))}
      </ul>

     <div className="overflow-x-auto mb-6">
  <table className="min-w-full table-auto border text-sm text-left bg-white shadow rounded">
    <thead>
      <tr className="bg-gray-100 text-gray-700">
        <th className="px-4 py-2 border">Total Income</th>
        <th className="px-4 py-2 border">Total Expenses</th>
        <th className="px-4 py-2 border">Balance</th>
       
      </tr>
    </thead>
    <tbody>
      <tr className="text-center font-semibold">
        <td className="px-4 py-3 border text-green-600">₦{totalIncome.toLocaleString()}</td>
        <td className="px-4 py-3 border text-red-600">₦{totalExpense.toLocaleString()}</td>
        <td className="px-4 py-3 border text-blue-600">₦{balance.toLocaleString()}</td>
        
      </tr>
    </tbody>
  </table>
</div>

<TransactionChart transactions={transactions} />

    </div>
  );
};

export default Transaction;
