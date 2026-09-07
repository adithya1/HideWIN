import { useState, useEffect } from 'react';
import { CreditCard, Download, Shield, Zap, CheckCircle2 } from 'lucide-react';

export default function Account() {
  const [activeTab, setActiveTab] = useState('security');
  const [resetToast, setResetToast] = useState(false);
  const [email, setEmail] = useState('user@hidewin.ai');

  useEffect(() => {
    const token = localStorage.getItem('hidewin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.sub) setEmail(payload.sub);
      } catch(e) {}
    }
  }, []);

  const handleResetPassword = () => {
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const tabs = [
    { id: 'security', label: 'Profile & Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: Zap },
    { id: 'billing', label: 'Payment Methods', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: Download }
  ];

  return (
    <div className="account-layout">
      <div className="account-sidebar">
        <h2 className="sidebar-title">Account Settings</h2>
        <nav className="sidebar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="account-content">
        {activeTab === 'security' && (
          <div className="tab-pane">
            <h3 className="pane-title">Profile & Security</h3>
            <p className="pane-subtitle">Manage your account credentials and security settings.</p>
            
            <div className="settings-card">
              <div className="settings-field">
                <label>Email Address</label>
                <div className="input-with-badge">
                  <input type="email" value={email} disabled className="input-field disabled" />
                  <span className="badge-locked">Locked</span>
                </div>
                <p className="field-hint">Your email is used for login and cannot be changed directly.</p>
              </div>

              <div className="settings-divider"></div>

              <div className="settings-field">
                <label>Password</label>
                <p className="field-hint" style={{ marginBottom: '12px' }}>A password reset link will be sent to your registered email address.</p>
                <button className="btn-secondary" onClick={handleResetPassword}>
                  Send Reset Link
                </button>
                {resetToast && (
                  <div className="toast-success">
                    <CheckCircle2 size={16} /> Password reset link sent to your email!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="tab-pane">
            <h3 className="pane-title">Subscription</h3>
            <p className="pane-subtitle">Manage your HideWin plan and usage.</p>
            
            <div className="subscription-card">
              <div className="plan-header">
                <div className="plan-badge">HideWin Pro</div>
                <span className="plan-status">Active</span>
              </div>
              <p className="plan-validity">Valid until Oct 24, 2027</p>
              
              <ul className="plan-features">
                <li><CheckCircle2 size={16} className="text-success" /> Unlimited meeting recordings</li>
                <li><CheckCircle2 size={16} className="text-success" /> Advanced AI summaries</li>
                <li><CheckCircle2 size={16} className="text-success" /> Priority support</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="tab-pane">
            <h3 className="pane-title">Payment Methods</h3>
            <p className="pane-subtitle">Manage your saved credit cards for billing.</p>
            
            <div className="payment-card">
              <div className="card-info">
                <div className="card-icon">VISA</div>
                <div>
                  <p className="card-number">•••• •••• •••• 4242</p>
                  <p className="card-expiry">Expires 12/28</p>
                </div>
              </div>
              <span className="card-badge">Default</span>
            </div>

            <button className="btn-secondary" style={{ marginTop: '16px' }}>+ Add Payment Method</button>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="tab-pane">
            <h3 className="pane-title">Invoices</h3>
            <p className="pane-subtitle">Download previous billing invoices.</p>
            
            <div className="invoice-table">
              <div className="invoice-row header">
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div></div>
              </div>
              <div className="invoice-row">
                <div>Oct 24, 2026</div>
                <div>$120.00</div>
                <div><span className="status-badge success">Paid</span></div>
                <div><button className="btn-text"><Download size={16} /> PDF</button></div>
              </div>
              <div className="invoice-row">
                <div>Oct 24, 2025</div>
                <div>$120.00</div>
                <div><span className="status-badge success">Paid</span></div>
                <div><button className="btn-text"><Download size={16} /> PDF</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
