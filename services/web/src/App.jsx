import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Download from './pages/Download';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

import Layout from './components/Layout';
import Account from './pages/Account';

function App() {
  const adminPath = import.meta.env.VITE_ADMIN_PATH || '/admin_hw';

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/download" element={<Download />} />
            <Route path="/account" element={<Account />} />
          </Route>
          
          {/* Secret Admin Routes */}
          <Route path={adminPath} element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
