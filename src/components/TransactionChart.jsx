import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TransactionChart = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    const grouped = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });

      if (!grouped[month]) {
        grouped[month] = { month, income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        grouped[month].income += tx.amount;
      } else {
        grouped[month].expense += tx.amount;
      }
    });

    const finalData = Object.values(grouped).sort(
      (a, b) => new Date(`01 ${a.month}`) - new Date(`01 ${b.month}`)
    );

    setChartData(finalData);
  }, [transactions]);

  return (
    <div className="mt-10 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Monthly Income vs Expense</h2>
      {chartData.length === 0 ? (
        <p className="text-center text-gray-500">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4ade80" name="Income" />
            <Bar dataKey="expense" fill="#f87171" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TransactionChart;
