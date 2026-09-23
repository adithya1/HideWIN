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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDetails, setCancelDetails] = useState("");

  const handleCancel = async () => {
      if (!cancelReason) return alert("Please select a reason");
      try {
          await api.post('/user/billing/cancel', { reason: cancelReason, details: cancelDetails });
          alert("Subscription cancelled successfully.");
          setShowCancelModal(false);
      } catch(e) {
          alert("Failed to cancel.");
      }
  };

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
        <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
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

      {showCancelModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "white", padding: "24px", borderRadius: "8px", width: "400px" }}>
                  <h3 style={{ marginTop: 0, fontSize: "18px", color: "#202124" }}>Cancel Subscription</h3>
                  <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "16px" }}>We're sorry to see you go. Why are you cancelling?</p>
                  <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #ddd" }}>
                      <option value="">Select a reason</option>
                      <option value="too_expensive">Too expensive</option>
                      <option value="not_using_enough">Not using it enough</option>
                      <option value="missing_features">Missing features</option>
                      <option value="other">Other</option>
                  </select>
                  <textarea placeholder="Tell us more (optional)" value={cancelDetails} onChange={e => setCancelDetails(e.target.value)} style={{ width: "100%", padding: "8px", height: "80px", marginBottom: "16px", borderRadius: "4px", border: "1px solid #ddd" }}></textarea>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <button onClick={() => setShowCancelModal(false)} style={{ background: "transparent", border: "none", color: "#5f6368", cursor: "pointer", fontWeight: 500 }}>Keep Subscription</button>
                      <button onClick={handleCancel} style={{ background: "#d93025", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}>Confirm Cancel</button>
                  </div>
              </div>
          </div>
      )}
    </nav>

  );
}
