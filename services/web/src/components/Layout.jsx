import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const token = localStorage.getItem('hidewin_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
