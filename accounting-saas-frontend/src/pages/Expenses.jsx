// pages/Expenses.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = getToken();
        
        const response = await axios.get("http://localhost:5000/api/expenses", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <div className="text-center py-4">Loading expenses...</div>;
  
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td className="border p-2">{expense.category}</td>
                <td className="border p-2">${expense.amount.toFixed(2)}</td>
                <td className="border p-2">{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Expenses;