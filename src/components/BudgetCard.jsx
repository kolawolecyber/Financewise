import { useEffect, useState } from 'react';
import API from '../services/api';

const BudgetCard = ({ budget }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await API.get(`/expenses?budgetId=${budget.id}`);
      setExpenses(res.data);
    };
    fetchExpenses();
  }, [budget.id]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{budget.title}</h2>
      <p className="text-gray-600">₦{budget.amount}</p>
      <div className="mt-2">
        <h3 className="text-md font-semibold">Expenses</h3>
        {expenses.map((exp) => (
          <div key={exp.id} className="text-sm flex justify-between border-b py-1">
            <span>{exp.description}</span>
            <span>₦{exp.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCard;
