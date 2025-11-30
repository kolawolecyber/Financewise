import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No chart data available
      </div>
    );
  }

  // ⭐ FIX ISO date → YYYY-MM
  const monthlyTotals = {};

  transactions.forEach((t) => {
    if (!t.date) return;

    const d = new Date(t.date); // Parse ISO date
    if (isNaN(d)) return;

    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyTotals[monthKey].income += Number(t.amount);
    } else {
      monthlyTotals[monthKey].expense += Number(t.amount);
    }
  });

  const labels = Object.keys(monthlyTotals).sort();
  const incomeData = labels.map((m) => monthlyTotals[m].income);
  const expenseData = labels.map((m) => monthlyTotals[m].expense);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239,68,68,0.6)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly Income vs Expense
      </h3>

      <Bar data={data} />
    </div>
  );
};

export default TransactionChart;
