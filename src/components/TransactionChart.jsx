import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TransactionChart = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    const grouped = {};

    transactions.forEach((tx) => {
      const dateValue = tx.date || tx.createdAt;

      const parsedDate = new Date(dateValue);

      if (isNaN(parsedDate)) return; // skip bad dates

      const month = parsedDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = { month, income: 0, expense: 0 };
      }

      const amt = Number(tx.amount);

      if (tx.type === "income") grouped[month].income += amt;
      else grouped[month].expense += amt;
    });

    setChartData(Object.values(grouped));
  }, [transactions]);

  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Monthly Income vs Expense
      </h2>

      {chartData.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No chart data available yet.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#4ade80" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TransactionChart;
