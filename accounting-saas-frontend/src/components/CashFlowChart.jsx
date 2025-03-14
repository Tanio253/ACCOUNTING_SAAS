import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getToken } from "../utils/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CashFlowChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };
        
        const [invoiceRes, expenseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/invoices", authHeader),
          axios.get("http://localhost:5000/api/expenses", authHeader),
        ]);

        // Group data by month
        const monthlyData = {};
        
        invoiceRes.data.forEach(({ amount, createdAt }) => {
          const month = new Date(createdAt).toLocaleString("default", { month: "short", year: "numeric" });
          monthlyData[month] = monthlyData[month] || { revenue: 0, expenses: 0 };
          monthlyData[month].revenue += amount;
        });

        expenseRes.data.forEach(({ amount, date }) => {
          const month = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
          monthlyData[month] = monthlyData[month] || { revenue: 0, expenses: 0 };
          monthlyData[month].expenses += amount;
        });

        // Prepare chart data
        const labels = Object.keys(monthlyData).sort();
        const revenueData = labels.map(month => monthlyData[month].revenue);
        const expensesData = labels.map(month => monthlyData[month].expenses);
        const profitData = labels.map(month => monthlyData[month].revenue - monthlyData[month].expenses);

        setChartData({
          labels,
          datasets: [
            { 
              label: "Revenue", 
              data: revenueData, 
              backgroundColor: "rgba(75, 192, 192, 0.7)" 
            },
            { 
              label: "Expenses", 
              data: expensesData, 
              backgroundColor: "rgba(255, 99, 132, 0.7)" 
            },
            { 
              label: "Profit", 
              data: profitData, 
              backgroundColor: "rgba(54, 162, 235, 0.7)" 
            }
          ],
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.msg || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center justify-center h-64">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Monthly Cash Flow</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">Monthly Cash Flow</h2>
      {chartData.labels.length === 0 ? (
        <p className="text-gray-500 p-4">No data available</p>
      ) : (
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true, 
            plugins: { 
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(context.parsed.y);
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }} 
        />
      )}
    </div>
  );
};

export default CashFlowChart;