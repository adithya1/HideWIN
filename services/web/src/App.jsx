import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Account from "./pages/Account";

import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import GoInvisible from "./pages/GoInvisible";
import Refer from "./pages/Refer";
import Assistants from "./pages/Assistants";
import Sessions from "./pages/Sessions";
import Documents from "./pages/Documents";
import SessionDetail from "./pages/SessionDetail";
import AdminCopilots from "./pages/AdminCopilots";
import AdminOrders from "./pages/AdminOrders";
import CreateAssistant from "./pages/CreateAssistant";
import Meetings from "./pages/Meetings";
import JoinMeeting from "./pages/JoinMeeting";

function App() {
  const adminPath = import.meta.env.VITE_ADMIN_PATH || "/admin_hw";

  return (
    <BrowserRouter>
      <div className="app-container" style={{ margin: 0, padding: 0, height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/join/:meetingId" element={<JoinMeeting />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant/create" element={<CreateAssistant />} />
            <Route path="/account/:tab?" element={<Account />} />
            <Route path="/assistants" element={<Assistants />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/session/:id/:tab?" element={<SessionDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/invite" element={<Meetings />} /><Route path="/meetings" element={<Meetings />} />
            <Route path="/invisible" element={<GoInvisible />} />
            <Route path="/downloads" element={<GoInvisible />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/referrals" element={<Refer />} />
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


