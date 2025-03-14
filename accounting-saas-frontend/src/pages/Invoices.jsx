import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../utils/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/invoices`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch invoices");
        setLoading(false);
        console.error("Error fetching invoices:", err);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <div className="text-center py-4">Loading invoices...</div>;
  
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      
      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Client</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice._id}>
                <td className="border p-2">{invoice.client}</td>
                <td className="border p-2">${invoice.amount.toFixed(2)}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="border p-2">{new Date(invoice.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Invoices;