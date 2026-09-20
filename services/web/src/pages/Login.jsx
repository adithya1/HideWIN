import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';

const desktopStyles = `
  .desktop-match .input-field { padding: 10px 12px !important; font-size: 15px !important; border: 1px solid #d1d5db !important; border-radius: 8px !important; background: #ffffff !important; color: #111827 !important; }
  .desktop-match .input-field:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important; outline: none !important; }
  .desktop-match .btn-primary { padding: 10px 16px !important; font-size: 14px !important; border-radius: 8px !important; font-weight: 500 !important; }
  .desktop-match .auth-title { font-size: 24px !important; font-weight: 700 !important; color: #111827 !important; }
  .desktop-match .auth-subtitle { font-size: 14px !important; color: #6b7280 !important; }
  .desktop-match .input-label { font-size: 13px !important; font-weight: 500 !important; color: #374151 !important; }
  .desktop-match .sso-btn { padding: 10px 16px !important; font-size: 14px !important; border: 1px solid #d1d5db !important; color: #374151 !important; }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(180);
  const [successMsg, setSuccessMsg] = useState('');
  const [deepLinkMsg, setDeepLinkMsg] = useState('');
  const [branding, setBranding] = useState({ logo_light: '', logo_dark: '', browser_icon: '' });
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/auth/branding')
      .then(res => res.json())
      .then(data => {
        setBranding(data);
        if (data.browser_icon) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) { link.href = data.browser_icon; }
          else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = data.browser_icon;
            document.head.appendChild(newLink);
          }
        }
      }).catch(err => console.log(err));
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && expiryTimer > 0) {
      interval = setInterval(() => setExpiryTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, expiryTimer]);
  
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
    if (params.get('source') === 'desktop' || params.has('returnUrl') || params.has('redirect_uri')) {
      sessionStorage.setItem('isDesktop', 'true');
    }
    
    const emailParam = params.get('email') || params.get('login_hint');
    if (emailParam) {
      setEmail(emailParam);
      setLockedEmail(true);
    }
    
    if (params.get('step') === 'otp') {
      setStep('otp');
      setResendTimer(60);
      setExpiryTimer(180);
      setSuccessMsg('Enter the password or OTP sent to your email.');
    }
    
    const isDesktopUser = sessionStorage.getItem('isDesktop') === 'true';

    if (isDesktopUser) {
      // SECURITY FIX: For enterprise desktop flows, we MUST force re-authentication.
      // We clear the existing token so they are forced to validate via OTP.
      localStorage.removeItem('hidewin_token');
    } else {
      const existingToken = localStorage.getItem('hidewin_token');
      if (existingToken) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);


  useEffect(() => {
    if (lockedEmail && email && sessionStorage.getItem('isDesktop') === 'true' && !sessionStorage.getItem('auto_otp_sent')) {
      sessionStorage.setItem('auto_otp_sent', 'true');
      handleSendOtp({ preventDefault: () => {} });
    }
  }, [lockedEmail, email]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/send-otp', {
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
      setExpiryTimer(180);
    } catch (err) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e, overrideOtp = otp) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', overrideOtp);
      
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        let errMsg = 'Enter valid OTP';
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errMsg = errorData.detail === 'Incorrect email or password' ? 'Enter valid OTP' : errorData.detail;
          }
        }
        throw new Error(errMsg);
      }
      
      const data = await response.json();
      const token = data.access_token;
      const hash = data.hash;
      
      // Success - save token
      localStorage.setItem('hidewin_token', token);
      
      const isDesktopUser = sessionStorage.getItem('isDesktop') === 'true';
      
      // Determine if we redirect to desktop app or download page
      if (isDesktopUser) {
        try {
          window.location.href = `hidewin://auth?token=${token}&hash=${hash}`;
        } catch (e) {
          console.log("Deep link failed");
        }
      }
      if (!isDesktopUser) {
        // Fallback redirect for users who are new or on a web-only device
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setTimeout(() => {
          navigate('/dashboard');
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
    window.location.href = `http://127.0.0.1:8000/auth/sso/${provider.toLowerCase()}/login`;
  };

  return (
    <div className="auth-layout desktop-match">
      <style>{desktopStyles}</style>
      <div className="auth-left">
        <div className="auth-card">
          <div className="brand-logo" style={{ justifyContent: 'center' }}>
            {branding.logo_light || branding.logo_dark ? (
              <img src={(document.body.getAttribute('data-theme') === 'dark' ? branding.logo_dark : branding.logo_light) || branding.logo_light || branding.logo_dark} alt="HideWin" style={{ maxHeight: '48px', maxWidth: '240px' }} />
            ) : (
              <>
                <ShieldCheck size={32} color="var(--primary)" />
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginLeft: '12px' }}>HideWin</span>
              </>
            )}
          </div>

          
          
          {step === 'email' && (
            <>
              <h1 className="auth-title">Sign in to HideWin</h1>
              <p className="auth-subtitle">Enter your email and we will send you a login code</p>
              
              <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="input-label" style={{ marginBottom: 0 }}>Email address</label>
                    {lockedEmail && (
                      <button 
                        type="button" 
                        onClick={() => setLockedEmail(false)} 
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                      >
                        Change Email
                      </button>
                    )}
                  </div>
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
                
                {error && <p className="error-message" style={{ marginTop: '8px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c' }}>{error}</p>}
                
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

          {step === 'otp' && (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">Enter the code sent to {email}</p>
              
              
              
              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label className="input-label">6-digit Code</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    value={otp}
                    onChange={e => {
                      const val = e.target.value;
                      setOtp(val);
                      if (val.length === 6) {
                        handleVerifyOtp(null, val);
                      }
                    }}
                    placeholder="123456" 
                    maxLength={6}
                    style={{ fontSize: '24px', letterSpacing: '4px', textAlign: 'center' }}
                  />
                </div>
                
                {error && <p className="error-message" style={{ textAlign: 'center', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c' }}>{error}</p>}
                
                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '24px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: expiryTimer > 0 ? 'block' : 'none' }}>
                  Code expires in: {Math.floor(expiryTimer / 60)}:{String(expiryTimer % 60).padStart(2, '0')}
                </div>
                <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    disabled={resendTimer > 0}
                    onClick={handleSendOtp}
                    style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#9ca3af' : 'var(--primary)', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
                  >
                    {resendTimer > 0 ? `Wait ${resendTimer}s to Regenerate` : 'Regenerate OTP'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setStep('email'); setError(''); setOtp(''); setLockedEmail(false); }}
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
