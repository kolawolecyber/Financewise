import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#c084fc", "#f472b6", "#fb923c", "#34d399", "#60a5fa", "#a78bfa", "#f87171"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-white/90 border border-white/30 rounded-2xl shadow-2xl p-4">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-lg font-semibold text-purple-600">
          ₦{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const BudgetChart = ({ budgets, expensesByBudget }) => {
  const chartData = budgets
    .map((budget) => {
      const totalSpent = expensesByBudget[budget.id] || 0;
      return totalSpent > 0
        ? {
            name: budget.title,
            value: totalSpent,
            category: budget.category,
          }
        : null;
    })
    .filter(Boolean);

  const hasData = chartData.length > 0;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        Spending by Budget
      </h2>

      {hasData ? (
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8">
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={4}
                cornerRadius={12}
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="drop-shadow-md hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />

              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm font-medium text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Total Spending Badge */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Total Spent This Month</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₦{chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        /* Super Cute Empty State */
        <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6">No expenses yet</div>
          <p className="text-xl text-gray-500">Your spending chart will appear here once you add expenses</p>
          <div className="mt-6 text-6xl animate-bounce">Add your first expense!</div>
        </div>
      )}
    </div>
  );
};

export default BudgetChart;