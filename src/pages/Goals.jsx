import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

import GoalDonut from "../components/GoalDonut";

const Goals = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [amountsToSave, setAmountsToSave] = useState({});
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
const [editForm, setEditForm] = useState({
  title: "",
  targetAmount: "",
  targetDate: "",
});


  const activeGoals = goals.filter(
  (goal) => goal.savedAmount < goal.targetAmount
);

const achievedGoals = goals.filter(
  (goal) => goal.savedAmount >= goal.targetAmount
);

  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    dueDate: "", // Format: yyyy-MM-dd
  });

  useEffect(() => {
    if (!token) {
      navigate("/pages/login");
    } else {
      setLoading(true)
      fetchGoals()
      .finally(()=>setLoading(false));
    }
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Convert yyyy-MM-dd to MM/dd/yyyy
    const dateParts = form.dueDate.split("-"); // [yyyy, mm, dd]
    if (dateParts.length !== 3) throw new Error("Invalid date input");

    const [year, month, day] = dateParts;
    const formattedDate = `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`; // MM/dd/yyyy

    const goalData = {
      title: form.title,
      targetAmount: parseFloat(form.targetAmount),
      targetDate: formattedDate, // now in MM/dd/yyyy
    };

    const res = await API.post("/api/goals", goalData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setGoals((prev) => [...prev, res.data]);
    setForm({ title: "", targetAmount: "", dueDate: "" });
  } catch (err) {
    console.error("Goal creation failed:", err.response?.data || err.message);
    alert(
      "Error creating goal: " +
        (err.response?.data?.error || err.message || "Unknown error")
    );
  }
};


const handleEditGoal = async (e, goalId) => {
  e.preventDefault();

  try {
    // Convert yyyy-MM-dd to MM/dd/yyyy
    const dateParts = editForm.targetDate.split("-");
    if (dateParts.length !== 3) throw new Error("Invalid date input");

    const [year, month, day] = dateParts;
    const formattedDate = `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;

    const res = await API.put(
      `/api/goals/${goalId}`,
      {
        title: editForm.title,
        targetAmount: parseFloat(editForm.targetAmount),
        targetDate: formattedDate, // Send correctly formatted date
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update local state
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, ...res.data } : goal
      )
    );

    setEditingGoalId(null);
  } catch (err) {
    console.error("Edit failed:", err);
    alert("Failed to edit goal");
    console.log('error', err);
  }
};

  
  const handleAddToSavings = async (e, goalId) => {
    e.preventDefault();
    const amount = parseFloat(amountsToSave[goalId]);

    if (!amount || amount <= 0) return;

    try {
      const res = await API.put(
        `/api/goals/${goalId}/save`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId
            ? { ...goal, savedAmount: res.data.savedAmount }
            : goal
        )
      );
      setAmountsToSave((prev) => ({ ...prev, [goalId]: "" }));
    } catch (error) {
      console.error("Error updating savings:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Your Financial Goals</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4 mb-6"
      >
        <h2 className="font-semibold">Add New Goal</h2>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Buy Laptop"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="targetAmount"
          value={form.targetAmount}
          onChange={handleChange}
          placeholder="Target Amount (₦)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Goal
        </button>
      </form>

      <ul className="space-y-3">
       {/* Active Goals Section */}
<h2 className="text-lg font-bold mt-8 mb-2">Active Goals</h2>
{loading ? (
  <p className="text-gray-600"> 📊 Loading goals...</p>
) :activeGoals.length === 0 ? (
  <p className="text-gray-500">No active goals yet.</p>
) : (
  <ul className="space-y-3">
    {activeGoals.map((goal) => {
      const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);

      return (
        <li key={goal.id} className="bg-gray-100 p-4 rounded shadow relative">
          <GoalDonut goal={goal} />
          <div className="font-semibold">{goal.title}</div>
          <div className="text-sm text-gray-600 mb-2">
            Target: ₦{goal.targetAmount?.toLocaleString()} | Saved: ₦{goal.savedAmount?.toLocaleString()}
          </div>
          <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
            <div className="bg-green-500 h-3" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-xs text-right mt-1 text-gray-700">{progress}%</div>

          <form onSubmit={(e) => handleAddToSavings(e, goal.id)} className="flex mt-2 gap-2">
            <input
              type="number"
              value={amountsToSave[goal.id] || ""}
              onChange={(e) =>
                setAmountsToSave((prev) => ({
                  ...prev,
                  [goal.id]: e.target.value,
                }))
              }
              placeholder="₦ to save"
              className="border p-1 rounded w-1/2"
            />
            <button className="bg-green-600 text-white px-2 py-1 rounded text-sm">Add</button>
          </form>
<button
  onClick={() => {
    setEditingGoalId(goal.id);
    setEditForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate?.split("T")[0] || "",
    });
  }}
  className="mt-2 text-sm text-blue-500 hover:underline mr-4"
>
  Edit
</button>


{editingGoalId === goal.id && (
  <form
    onSubmit={(e) => handleEditGoal(e, goal.id)}
    className="mt-2 space-y-2 bg-white p-3 rounded border"
  >
    <input
      type="text"
      name="title"
      value={editForm.title}
      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
      className="w-full border p-1 rounded"
      placeholder="Title"
    />
    <input
      type="number"
      name="targetAmount"
      value={editForm.targetAmount}
      onChange={(e) => setEditForm({ ...editForm, targetAmount: e.target.value })}
      className="w-full border p-1 rounded"
      placeholder="Target Amount"
    />
    <input
      type="date"
      name="targetDate"
      value={editForm.targetDate}
      onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
      className="w-full border p-1 rounded"
    />
    <div className="flex gap-2">
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditingGoalId(null)}
        className="text-sm text-gray-500 hover:underline"
      >
        Cancel
      </button>
    </div>
  </form>
)}


          <button
            onClick={() => handleDelete(goal.id)}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Delete
          </button>
        </li>
      );
    })}
  </ul>
)}

{/* Achieved Goals Section */}
<h2 className="text-lg font-bold mt-10 mb-2">Achieved Goals 🎉</h2>
{achievedGoals.length === 0 ? (
  <p className="text-gray-500">You haven’t achieved any goals yet.</p>
) : (
  <ul className="space-y-3">
    {achievedGoals.map((goal) => {
      const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);

      return (
        <li key={goal.id} className="bg-green-50 border border-green-200 p-4 rounded shadow relative">
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            🎯 Achieved
          </div>
          <GoalDonut goal={goal} />
          <div className="font-semibold">{goal.title}</div>
          <div className="text-sm text-gray-600 mb-2">
            Target: ₦{goal.targetAmount?.toLocaleString()} | Saved: ₦{goal.savedAmount?.toLocaleString()}
          </div>
          <div className="w-full bg-green-400 h-3 rounded"></div>
          <div className="text-xs text-right mt-1 text-green-700">{progress}%</div>
        </li>
      );
    })}
  </ul>
)}

      </ul>
    </div>
  );
};

export default Goals;
