import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Download from "./pages/Download";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Account from "./pages/Account";

import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AdminCopilots from "./pages/AdminCopilots";
import AdminOrders from "./pages/AdminOrders";
import CreateAssistant from "./pages/CreateAssistant";

function App() {
  const adminPath = import.meta.env.VITE_ADMIN_PATH || "/admin_hw";

  return (
    <BrowserRouter>
      <div className="app-container" style={{ margin: 0, padding: 0, height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant/create" element={<CreateAssistant />} />
            <Route path="/account" element={<Account />} />
            <Route path="/assistants" element={<div>Assistants List</div>} />
            <Route path="/sessions" element={<div>Sessions List</div>} />
            <Route path="/documents" element={<div>Documents List</div>} />
          </Route>
          
          <Route path={adminPath} element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
<Route path="/admin/copilots" element={<AdminCopilots />} />
<Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

