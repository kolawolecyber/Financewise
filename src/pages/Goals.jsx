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
  const [editForm, setEditForm] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
  });
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true); // 👈 added loading state

  const activeGoals = goals.filter((goal) => goal.savedAmount < goal.targetAmount);
  const achievedGoals = goals.filter((goal) => goal.savedAmount >= goal.targetAmount);

  useEffect(() => {
    if (!token) {
      navigate("/pages/login");
    } else {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    try {
      setLoading(true); // 👈 start skeleton
      const res = await API.get("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false); // 👈 stop skeleton
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ... (your submit, edit, save, delete handlers stay unchanged)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Your Financial Goals</h1>

      {/* New Goal Form */}
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
        {/* Active Goals */}
        <h2 className="text-lg font-bold mt-8 mb-2">Active Goals</h2>
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="bg-gray-100 p-4 rounded shadow animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </li>
            ))}
          </ul>
        ) : activeGoals.length === 0 ? (
          <p className="text-gray-500">No active goals yet.</p>
        ) : (
          <ul className="space-y-3">
            {/* your activeGoals.map rendering remains unchanged */}
            {activeGoals.map((goal) => {
              const progress = Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
              ).toFixed(1);

              return (
                <li
                  key={goal.id}
                  className="bg-gray-100 p-4 rounded shadow relative"
                >
                  <GoalDonut goal={goal} />
                  <div className="font-semibold">{goal.title}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Target: ₦{goal.targetAmount?.toLocaleString()} | Saved: ₦
                    {goal.savedAmount?.toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
                    <div
                      className="bg-green-500 h-3"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right mt-1 text-gray-700">
                    {progress}%
                  </div>
                  {/* rest of your form/edit/delete buttons untouched */}
                </li>
              );
            })}
          </ul>
        )}

        {/* Achieved Goals */}
        <h2 className="text-lg font-bold mt-10 mb-2">Achieved Goals 🎉</h2>
        {loading ? (
          <ul className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <li
                key={i}
                className="bg-green-50 border border-green-200 p-4 rounded shadow animate-pulse"
              >
                <div className="w-16 h-16 bg-green-200 rounded-full mb-2" />
                <div className="h-4 bg-green-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-green-200 rounded w-full mb-2" />
              </li>
            ))}
          </ul>
        ) : achievedGoals.length === 0 ? (
          <p className="text-gray-500">You haven’t achieved any goals yet.</p>
        ) : (
          <ul className="space-y-3">
            {/* your achievedGoals.map rendering unchanged */}
            {achievedGoals.map((goal) => {
              const progress = Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
              ).toFixed(1);

              return (
                <li
                  key={goal.id}
                  className="bg-green-50 border border-green-200 p-4 rounded shadow relative"
                >
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    🎯 Achieved
                  </div>
                  <GoalDonut goal={goal} />
                  <div className="font-semibold">{goal.title}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Target: ₦{goal.targetAmount?.toLocaleString()} | Saved: ₦
                    {goal.savedAmount?.toLocaleString()}
                  </div>
                  <div className="w-full bg-green-400 h-3 rounded"></div>
                  <div className="text-xs text-right mt-1 text-green-700">
                    {progress}%
                  </div>
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
