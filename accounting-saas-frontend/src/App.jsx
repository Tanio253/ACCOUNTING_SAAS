// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Invoices from "./pages/Invoices.jsx";
import Expenses from "./pages/Expenses.jsx";
import Login from "./pages/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function AppContent() {
  const { isLoggedIn } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Only show sidebar on protected routes when logged in */}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Protected routes with sidebar */}
        <Route path="/*" element={
          isLoggedIn ? (
            <div className="flex w-full">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/expenses" element={<Expenses />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;