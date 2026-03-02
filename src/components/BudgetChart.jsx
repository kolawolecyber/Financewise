import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Text } from "recharts";

// Premium color palette for financial data
const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
];

const BudgetChart = ({ budgets, expensesByBudget }) => {
  // Transform data for the chart
  const chartData = budgets
    .map((budget) => ({
      name: budget.title,
      value: expensesByBudget[budget.id] || 0,
    }))
    .filter((data) => data.value > 0);

  const totalSpent = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Custom Active Shape or Center Label logic
  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <g>
        <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central">
          <tspan fontSize="12" fontWeight="900" fill="#94a3b8" dy="0" className="uppercase tracking-widest">
            Total
          </tspan>
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central">
          <tspan fontSize="20" fontWeight="900" fill="#1e293b">
            ${totalSpent.toLocaleString()}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col group">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Spending Distribution
        </h2>
        {chartData.length > 0 && (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            Live Data
          </span>
        )}
      </div>

      <div className="flex-1 w-full min-h-[220px] relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                stroke="none"
                animationBegin={0}
                animationDuration={1200}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              
              {/* Center Labels */}
              <Tooltip 
                trigger="hover"
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-xl rounded-2xl border border-gray-50 flex flex-col gap-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {payload[0].name}
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          ${payload[0].value.toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Static center text when not hovering */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                {renderCustomLabel({ cx: "50%", cy: "50%" })}
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
               <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
               </svg>
            </div>
            <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
              No Data to Visualize
            </p>
          </div>
        )}
      </div>

      {/* Simplified Custom Legend */}
      {chartData.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {chartData.slice(0, 3).map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-[10px] font-bold text-gray-500 truncate max-w-[80px]">
                {entry.name}
              </span>
            </div>
          ))}
          {chartData.length > 3 && (
            <span className="text-[10px] font-bold text-gray-300">+{chartData.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetChart;