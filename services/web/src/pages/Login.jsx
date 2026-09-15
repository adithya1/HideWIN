import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [deepLinkMsg, setDeepLinkMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const [lockedEmail, setLockedEmail] = useState(false);

  useEffect(() => {
    // Check if coming from desktop app
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') === 'desktop') {
      sessionStorage.setItem('isDesktop', 'true');
    }
    if (params.get('email')) {
      setEmail(params.get('email'));
      setLockedEmail(true);
    }
    if (params.get('step') === 'otp') {
      setStep('otp');
      setResendTimer(60);
      setSuccessMsg('Enter the password or OTP sent to your email.');
    }
    
    const isDesktopUser = sessionStorage.getItem('isDesktop') === 'true';

    const existingToken = localStorage.getItem('hidewin_token');
    if (existingToken) {
      if (isDesktopUser) {
        console.log('Active session found for desktop user. Triggering deep link...');
        try {
          window.location.href = `hidewin://auth?token=${existingToken}&hash=mock_hash`;
        } catch (e) {
          console.log("Deep link failed");
        }
        
        // Browsers block automatic custom protocol redirects without a user gesture!
        // We MUST wait for the user to click a button if it was blocked.
        // So we do NOT navigate away automatically.
        setDeepLinkMsg('Session found! Attempting to launch the app...');
      } else {
        // Regular web user visiting /login while logged in -> redirect to dashboard
        navigate('/download');
      }
    }
  }, [navigate]);


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send OTP');
      }
      
      setSuccessMsg(`We found your account. Enter your password or the OTP sent to your email.`);
      setStep('otp');
      setResendTimer(60);
    } catch (err) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: otp }) // Sending OTP input as password
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid code. Please try again.');
      }
      
      const data = await response.json();
      const token = data.token;
      
      // Success - save token
      localStorage.setItem('hidewin_token', token);
      
      const isDesktopUser = sessionStorage.getItem('isDesktop') === 'true';
      
      // Determine if we redirect to desktop app or download page
      if (isDesktopUser) {
        try {
          window.location.href = `hidewin://auth?token=${token}&hash=mock_hash`;
        } catch (e) {
          console.log("Deep link failed");
        }
      }
      if (!isDesktopUser) {
        // Fallback redirect for users who are new or on a web-only device
        setTimeout(() => {
          navigate('/download');
        }, 3000);
      } else {
        setTimeout(() => {
          navigate('/download');
        }, 500);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = (provider) => {
    // Redirect to FastAPI SSO endpoints
    window.location.href = `http://localhost:8000/auth/sso/${provider.toLowerCase()}/login`;
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-card">
          <div className="brand-logo">
            <ShieldCheck size={32} color="var(--primary)" />
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginLeft: '12px' }}>HideWin</span>
          </div>

          {deepLinkMsg ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <ShieldCheck size={32} color="#16a34a" />
              </div>
              <h1 className="auth-title" style={{ color: '#16a34a', marginBottom: '16px' }}>{deepLinkMsg}</h1>
              
              {sessionStorage.getItem('isDesktop') === 'true' && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      try {
                        window.location.href = `hidewin://auth?token=${localStorage.getItem('hidewin_token')}&hash=mock_hash`;
                        setTimeout(() => navigate('/download'), 500);
                      } catch(e) {}
                    }}
                    style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  >
                    Launch HideWin App
                  </button>
                  <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                    Click above to return to the app if it didn't open automatically.
                  </p>
                </div>
              )}
            </div>
          ) : null}
          
          {!deepLinkMsg && step === 'email' && (
            <>
              <h1 className="auth-title">Sign in to HideWin</h1>
              <p className="auth-subtitle">Enter your email and we will send you a login code</p>
              
              <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <label className="input-label">Email address</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    disabled={lockedEmail}
                    style={lockedEmail ? { backgroundColor: '#f1f5f9', color: '#64748b' } : {}}
                  />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '24px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Continue with Email'}
                </button>
              </form>

              <div style={{ margin: '32px 0', textAlign: 'center', position: 'relative' }}>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                <span style={{ 
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', 
                  background: 'var(--bg-main)', padding: '0 16px', color: 'var(--text-muted)', fontSize: '14px' 
                }}>
                  OR
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => handleSSO('Google')}
                  style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', height: '16px' }} />
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleSSO('Apple')}
                  style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  <svg viewBox="0 0 384 512" style={{ width: '16px', height: '16px' }}><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  Continue with Apple
                </button>
                <button 
                  onClick={() => handleSSO('SAML')}
                  style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  <ShieldCheck size={16} />
                  Single Sign-On (SSO)
                </button>
              </div>
            </>
          )}

          {!deepLinkMsg && step === 'otp' && (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">Enter the code sent to {email}</p>
              
              {successMsg && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200 mb-6">
                  {successMsg}
                </div>
              )}
              
              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                                    <label className="input-label">Password or OTP</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="input-field" 
                      required 
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter password or code" 
                      style={{ fontSize: '18px', textAlign: 'center', paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
                
                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '24px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                </button>

                <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    disabled={resendTimer > 0}
                    onClick={handleSendOtp}
                    style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#9ca3af' : 'var(--primary)', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
                  >
                    {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="auth-right"></div>
    </div>
  );
}
