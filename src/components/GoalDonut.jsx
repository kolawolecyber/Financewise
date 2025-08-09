import { PieChart, Pie, Cell } from "recharts";

const GoalDonut = ({ goal }) => {
  const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const data = [
    { name: "Saved", value: percent },
    { name: "Remaining", value: 100 - percent },
  ];

  return (
    <div className="flex flex-col items-center">
      <PieChart width={100} height={100}>
        <Pie
          data={data}
          innerRadius={30}
          outerRadius={45}
          paddingAngle={2}
          dataKey="value"
        >
          <Cell fill="#4ade80" />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>
      <div className="text-xs text-center mt-1">
        {goal.title}<br />
        {percent.toFixed(0)}%
      </div>
    </div>
  );
};

export default GoalDonut;
