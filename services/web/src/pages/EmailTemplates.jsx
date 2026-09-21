import React, { useState, useEffect } from 'react';
import { Mail, Plus, Save, Eye, RefreshCw, Layers, Send } from 'lucide-react';
import { API_BASE } from '../config';

export default function EmailTemplates() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [logs, setLogs] = useState([]);
    const [branding, setBranding] = useState({});
    const [activeTab, setActiveTab] = useState('templates');
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [campaignAudience, setCampaignAudience] = useState('all_active_users');
    const [campaignCustomEmails, setCampaignCustomEmails] = useState('');
 // templates, branding, logs

    const fetchTemplates = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-templates`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            });
            const data = await res.json();
            setTemplates(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchBranding = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-branding`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            });
            const data = await res.json();
            setBranding(data);
        } catch (e) {
            console.error(e);
        }
    };
    
    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-logs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            });
            const data = await res.json();
            setLogs(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTemplates();
        fetchBranding();
        fetchLogs();
    }, []);

    const handleSelect = (tmpl) => {
        setSelectedTemplate(tmpl);
        setFormData(tmpl);
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setSelectedTemplate(null);
        setFormData({ template_key: '', name: '', subject: '', preheader: '', body_html: '', enabled: true });
        setIsEditing(true);
    };

    
    const handleDispatchCampaign = async () => {
        const emails = campaignCustomEmails.split(',').map(e => e.trim()).filter(e => e);
        if (campaignAudience === 'custom' && emails.length === 0) {
            return alert('Please enter at least one custom email.');
        }
        
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-campaigns/dispatch`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
                },
                body: JSON.stringify({
                    template_key: selectedTemplate.template_key,
                    audience: campaignAudience,
                    custom_emails: emails
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setShowCampaignModal(false);
            } else {
                alert(data.detail || 'Dispatch failed');
            }
        } catch (e) {
            alert('Failed to dispatch campaign');
        }
    };

    const handleSave = async () => {
        const method = selectedTemplate ? 'PUT' : 'POST';
        const url = selectedTemplate 
            ? `${API_BASE}/admin-system/email-templates/${selectedTemplate.template_key}`
            : `${API_BASE}/admin-system/email-templates`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Saved successfully');
                fetchTemplates();
                setIsEditing(false);
            } else {
                const err = await res.json();
                alert(err.detail || 'Error saving template');
            }
        } catch (e) {
            alert('Failed to save template');
        }
    };

    const handleSaveBranding = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-branding`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
                },
                body: JSON.stringify(branding)
            });
            if (res.ok) alert('Branding saved successfully');
        } catch (e) {
            alert('Failed to save branding');
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
                <button onClick={() => setActiveTab('templates')} style={{ background: activeTab === 'templates' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'templates' ? '#fff' : '#3c4043', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Templates</button>
                <button onClick={() => setActiveTab('branding')} style={{ background: activeTab === 'branding' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'branding' ? '#fff' : '#3c4043', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Global Branding</button>
                <button onClick={() => setActiveTab('logs')} style={{ background: activeTab === 'logs' ? '#1a73e8' : '#f1f3f4', color: activeTab === 'logs' ? '#fff' : '#3c4043', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Delivery Logs</button>
            </div>

            {activeTab === 'templates' && !isEditing && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Email Templates</h2>
                        <button onClick={handleCreateNew} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} /> New Template
                        </button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {templates.map(t => (
                            <div key={t.id} onClick={() => handleSelect(t)} style={{ padding: '16px', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#202124' }}>{t.name}</div>
                                    <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>Key: {t.template_key} | Subject: {t.subject}</div>
                                </div>
                                <div style={{ background: t.enabled ? '#e6f4ea' : '#fce8e6', color: t.enabled ? '#137333' : '#c5221f', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {t.enabled ? 'ACTIVE' : 'DISABLED'}
                                </div>
                            </div>
                        ))}
                        {templates.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#5f6368' }}>No templates found.</div>}
                    </div>
                </div>
            )}

            {activeTab === 'templates' && isEditing && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedTemplate ? 'Edit Template' : 'New Template'}</h3>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Template Key</label>
                                <input type="text" value={formData.template_key || ''} onChange={e => setFormData({...formData, template_key: e.target.value})} disabled={!!selectedTemplate} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="e.g. AUTH_LOGIN_OTP" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Name</label>
                                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Login Verification Code" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Subject</label>
                                <input type="text" value={formData.subject || ''} onChange={e => setFormData({...formData, subject: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Your HideWin login code is {{otpCode}}" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Preheader</label>
                                <input type="text" value={formData.preheader || ''} onChange={e => setFormData({...formData, preheader: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Use this code to securely sign in..." />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Body HTML</label>
                                <textarea value={formData.body_html || ''} onChange={e => setFormData({...formData, body_html: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '200px', fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Hi {{firstName}},</p><br/>..." />
                            </div>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.enabled ?? true} onChange={e => setFormData({...formData, enabled: e.target.checked})} />
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Enabled</span>
                            </label>

                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button onClick={handleSave} style={{ flex: 1, background: '#1a73e8', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Save size={18} /> Save Template
                                </button>
                                {(formData.category === 'MARKETING' || formData.category === 'CUSTOM') && (
                                    <button onClick={() => setShowCampaignModal(true)} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Send size={18} /> Dispatch Campaign
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="card" style={{ background: '#f8f9fa', height: '100%' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={18} /> Live Preview</h3>
                        <div style={{ background: branding.background_color || '#f1f3f4', padding: '32px', borderRadius: '8px', border: '1px solid #e0e0e0', minHeight: '500px' }}>
                            <div style={{ maxWidth: '600px', margin: '0 auto', background: branding.card_background || '#ffffff', borderRadius: '8px', border: `1px solid ${branding.border_color || '#e0e0e0'}`, padding: '32px' }}>
                                {branding.logo_light ? (
                                    <img src={branding.logo_light} alt="HideWin" style={{ maxHeight: '36px', marginBottom: '24px' }} />
                                ) : (
                                    <h2 style={{ color: branding.text_color || '#000', marginBottom: '24px', marginTop: 0 }}>HideWin</h2>
                                )}
                                
                                <div style={{ color: branding.text_color || '#3c4043', fontSize: '15px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: (formData.body_html || '<p style="color: #9aa0a6;">Enter HTML content to preview...</p>').replace('{{firstName}}', 'Aditya').replace('{{otpCode}}', '482931') }} />
                            </div>
                            <div style={{ textAlign: 'center', color: branding.muted_text_color || '#9aa0a6', fontSize: '13px', marginTop: '24px' }}>
                                <p>{branding.footer_text || "You're receiving this email because you have an account or activity associated with HideWin."}</p>
                                <p>&copy; {new Date().getFullYear()} HideWin. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'branding' && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Global Email Branding</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Company Name</label>
                                <input type="text" value={branding.company_name || ''} onChange={e => setBranding({...branding, company_name: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Support Email</label>
                                <input type="email" value={branding.support_email || ''} onChange={e => setBranding({...branding, support_email: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Primary Color</label>
                                <input type="color" value={branding.primary_color || '#0A6FB7'} onChange={e => setBranding({...branding, primary_color: e.target.value})} style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', height: '40px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Footer Text</label>
                                <textarea value={branding.footer_text || ''} onChange={e => setBranding({...branding, footer_text: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }} />
                            </div>
                            <button onClick={handleSaveBranding} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Save size={18} /> Save Global Branding
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Delivery Logs</h2>
                    <p style={{ color: '#5f6368', marginBottom: '16px' }}>Showing recent email dispatch attempts. OTPs and secure tokens are redacted.</p>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 16px' }}>Date</th>
                                    <th style={{ padding: '12px 16px' }}>Recipient</th>
                                    <th style={{ padding: '12px 16px' }}>Template</th>
                                    <th style={{ padding: '12px 16px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? logs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                        <td style={{ padding: '12px 16px', color: '#5f6368' }}>{new Date(log.created_at).toLocaleString()}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: '500' }}>{log.recipient}</td>
                                        <td style={{ padding: '12px 16px' }}>{log.template_key}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ background: log.status === 'DELIVERED' || log.status === 'SENT' ? '#e6f4ea' : log.status === 'FAILED' ? '#fce8e6' : '#fef7e0', color: log.status === 'DELIVERED' || log.status === 'SENT' ? '#137333' : log.status === 'FAILED' ? '#c5221f' : '#b06000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#5f6368' }}>No recent logs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        
            {showCampaignModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Dispatch Campaign</h3>
                        <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '16px' }}>Send <strong>{selectedTemplate?.name}</strong> to the selected audience.</p>
                        
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Select Audience</label>
                        <select value={campaignAudience} onChange={e => setCampaignAudience(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="all_active_users">All Active Users</option>
                            <option value="premium_users">Premium Users Only</option>
                            <option value="free_users">Free Users Only</option>
                            <option value="custom">Custom List</option>
                        </select>
                        
                        {campaignAudience === 'custom' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Custom Emails (comma separated)</label>
                                <textarea value={campaignCustomEmails} onChange={e => setCampaignCustomEmails(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} placeholder="user1@example.com, user2@example.com" />
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setShowCampaignModal(false)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            <button onClick={handleDispatchCampaign} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Send Now</button>
                        </div>
                    </div>
                </div>
            )}
</div>
    );
}
