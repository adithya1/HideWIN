import { Download as DownloadIcon, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Download() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('hidewin_token');
    navigate('/login');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: '60px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
        <h1 className="page-title" style={{ marginBottom: '16px' }}>You're all set!</h1>
        <p className="auth-subtitle" style={{ fontSize: '18px', marginBottom: '32px' }}>
          Download the HideWin Desktop app to get started. Once installed, it will automatically log you in.
        </p>
        
        <button className="btn-primary" style={{ maxWidth: '300px', margin: '0 auto', fontSize: '18px', padding: '16px' }}>
          <DownloadIcon size={24} />
          Download for Windows
        </button>
        
        <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Requires Windows 10 or higher.
        </p>
      </div>
    </div>
  );
}
