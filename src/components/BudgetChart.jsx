import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

const BudgetChart = ({ budgets, expensesByBudget }) => {
  const chartData = budgets.map((budget) => {
    const totalSpent = expensesByBudget[budget.id] || 0;
     const percentage = Math.min(100, (totalSpent / budget.amount) * 100);
    return {
      name: budget.title,
      value: totalSpent,
      percentage: percentage
    };
  });



  return (
     <div key={budget.id} className="group relative flex flex-col items-center w-16">
                            <div className="absolute -top-10 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                ${spent.toFixed(0)} spent
                            </div>
                            <div className="w-8 sm:w-10 bg-gray-100 rounded-t-2xl overflow-hidden relative h-32 sm:h-48">
                                <div 
                                    className={`absolute bottom-0 w-full transition-all duration-1000 ease-out rounded-t-lg ${percentage > 90 ? 'bg-red-400' : 'bg-indigo-500'}`}
                                    style={{ height: `${percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] mt-3 font-bold text-gray-400 uppercase tracking-tighter truncate w-full text-center px-1">
                                {budget.title}
                            </span>
                        </div>
                    );
                }
          


export default BudgetChart;
