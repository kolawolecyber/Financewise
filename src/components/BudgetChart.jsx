import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

const BudgetChart = ({ budgets, expensesByBudget }) => {
  const chartData = budgets.map((budget) => {
    const totalSpent = expensesByBudget[budget.id] || 0;
    return {
      name: budget.title,
      value: totalSpent,
    };
  });



  return (
    <div className="w-full h-68 md:h-80 mt-8 ">
      <h2 className="text-lg font-semibold mb-2">Spending Distribution</h2>
   {chartData.length > 0 ? (
  <ResponsiveContainer width="100%" height={250} >
    <PieChart>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {chartData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
) : (
  <p className="text-center text-gray-500 mt-4">No expense data to show</p>
)}


    </div>
  );
};

export default BudgetChart;
