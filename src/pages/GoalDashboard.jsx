import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GoalDonut from "../components/GoalDonut";
import axios from "axios";
import dayjs from "dayjs";

const GoalDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filteredGoals, setFilteredGoals] = useState([]);

  // Fetch goals on mount or when token changes
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setGoals(res.data);
        setFilteredGoals(res.data); // default to show all
        console.log("Fetched goals:", res.data);
      } else {
        console.warn("Unexpected API response format", res.data);
        setGoals([]);
        setFilteredGoals([]);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedMonth = e.target.value;
    setFilterMonth(selectedMonth);

    if (!selectedMonth) {
      setFilteredGoals(goals);
      return;
    }

    const filtered = goals.filter((goal) =>
      dayjs(goal.dueDate).format("MMMM") === selectedMonth
    );
    setFilteredGoals(filtered);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Navbar/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Goal Dashboard</h1>

        <select
          value={filterMonth}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={dayjs().month(i).format("MMMM")}>
              {dayjs().month(i).format("MMMM")}
            </option>
          ))}
        </select>
      </div>

      {filteredGoals.length === 0 ? (
        <p className="text-gray-600">No goals found for selected month.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white shadow p-4 rounded border border-gray-200"
            >
              <GoalDonut goal={goal} />

              <div className="text-xs mt-2 text-gray-500">
                Due: {dayjs(goal.targetDate).format("MMM D, YYYY")}
                <br />
                {dayjs(goal.targetDate).diff(dayjs(), "day") >= 0
                  ? `${dayjs(goal.targetDate).diff(dayjs(), "day")} days left`
                  : `Overdue by ${Math.abs(
                      dayjs(goal.targetDate).diff(dayjs(), "day")
                    )} days`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalDashboard;
