import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid credentials');
      }
      
      const data = await response.json();
      localStorage.setItem('hidewin_token', data.token);
      
      // Admins go straight to the dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ background: 'var(--bg-subtle)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
          <div className="brand-logo" style={{ marginBottom: '32px', justifyContent: 'center' }}>
            <img src="/logo.png" alt="HideWin" style={{ height: '40px' }} />
          </div>
          
          <h1 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>Staff Portal</h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>
            Restricted access.
          </p>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Admin Email</label>
              <input 
                type="email" 
                className="input-field" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@hidewin.com" 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type="password" 
                className="input-field" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
              />
            </div>
            
            {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
            
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '24px', background: '#0f172a' }}>
              {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
