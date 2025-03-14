// components/Sidebar.jsx
import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col">
      <div className="p-4 text-xl font-bold">Accounting SaaS</div>
      
      <nav className="flex-1">
        <Link to="/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link>
        <Link to="/invoices" className="block p-4 hover:bg-gray-700">Invoices</Link>
        <Link to="/expenses" className="block p-4 hover:bg-gray-700">Expenses</Link>
      </nav>
      
      <div className="p-4">
        <button 
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;