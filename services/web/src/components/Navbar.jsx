import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function getInitials(email) {
  if (!email) return 'U';
  
  const namePart = email.split('@')[0];
  if (namePart.includes('.')) {
    const parts = namePart.split('.');
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return namePart.substring(0, 2).toUpperCase();
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get user info from token or state
  const token = localStorage.getItem('hidewin_token');
  let email = 'user@hidewin.ai';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.sub) {
        email = payload.sub;
      }
    } catch (e) {
      console.error('Failed to parse token');
    }
  }

  const initials = getInitials(email);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('hidewin_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/download')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="HideWin" />
        </div>
        
        <div className="navbar-actions" ref={dropdownRef}>
          <div className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {initials}
          </div>
          
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-email">{email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/account'); }}>
                Account Settings
              </button>
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); window.open('mailto:support@hidewin.ai'); }}>
                Help
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
