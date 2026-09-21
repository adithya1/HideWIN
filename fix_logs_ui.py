# -*- coding: utf-8 -*-
import re

file_path = "services/web/src/pages/EmailTemplates.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. State additions
new_states = """    const [analytics, setAnalytics] = useState(null);
    const [logSearchTerm, setLogSearchTerm] = useState('');
"""
if "const [logSearchTerm, setLogSearchTerm]" not in text:
    text = text.replace("const [logs, setLogs] = useState([]);", "const [logs, setLogs] = useState([]);\n" + new_states)

# 2. Add API calls to fetch data
fetch_analytics = """
        fetch(`${API_BASE}/admin-system/email-analytics`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
        }).then(res => res.json()).then(setAnalytics).catch(console.error);
"""
if "email-analytics" not in text:
    text = text.replace("setLogs(data);", "setLogs(data);\n" + fetch_analytics)

# 3. Handle Retry function
retry_fn = """
    const handleRetry = async (logId) => {
        try {
            const res = await fetch(`${API_BASE}/admin-system/email-logs/${logId}/retry`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            });
            const data = await res.json();
            alert(data.message || data.detail);
            
            // Refresh logs
            fetch(`${API_BASE}/admin-system/email-logs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            }).then(r => r.json()).then(setLogs);
            
            fetch(`${API_BASE}/admin-system/email-analytics`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }
            }).then(r => r.json()).then(setAnalytics);
        } catch (e) {
            alert('Failed to retry email.');
        }
    };
"""
if "const handleRetry" not in text:
    text = text.replace("const handleDispatchCampaign", retry_fn + "\n    const handleDispatchCampaign")

# 4. Filter the logs array
filter_fn = """
    const filteredLogs = logs.filter(log => 
        log.recipient.toLowerCase().includes(logSearchTerm.toLowerCase()) || 
        log.template_key.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        (log.subject && log.subject.toLowerCase().includes(logSearchTerm.toLowerCase()))
    );
"""
if "const filteredLogs" not in text:
    text = text.replace("if (loading) return", filter_fn + "\n    if (loading) return")

# 5. UI replacements for Logs tab
logs_ui_old = """                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ padding: '12px' }}>{new Date(log.created_at).toLocaleString()}</td>
                                            <td style={{ padding: '12px' }}>{log.recipient}</td>
                                            <td style={{ padding: '12px' }}>{log.template_key}</td>
                                            <td style={{ padding: '12px' }}>{log.subject || '-'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: log.status === 'DELIVERED' ? '#d1fae5' : log.status === 'FAILED' ? '#fee2e2' : '#fef3c7', color: log.status === 'DELIVERED' ? '#065f46' : log.status === 'FAILED' ? '#991b1b' : '#92400e' }}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>{log.failure_reason || '-'}</td>
                                        </tr>
                                    ))}"""

logs_ui_new = """                                    {filteredLogs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ padding: '12px' }}>{new Date(log.created_at).toLocaleString()}</td>
                                            <td style={{ padding: '12px' }}>{log.recipient}</td>
                                            <td style={{ padding: '12px' }}>{log.template_key}</td>
                                            <td style={{ padding: '12px' }}>{log.subject || '-'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: log.status === 'DELIVERED' ? '#d1fae5' : log.status === 'FAILED' ? '#fee2e2' : '#fef3c7', color: log.status === 'DELIVERED' ? '#065f46' : log.status === 'FAILED' ? '#991b1b' : '#92400e' }}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {log.status === 'FAILED' && !log.template_key.includes('OTP') && (
                                                    <button onClick={() => handleRetry(log.id)} style={{ padding: '4px 8px', fontSize: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
                                                )}
                                                {log.status === 'FAILED' && log.template_key.includes('OTP') && (
                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Expired auth email</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}"""
text = text.replace(logs_ui_old, logs_ui_new)

# 6. Inject Analytics Header and Search Bar
logs_header_old = """                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>"""
                                
logs_header_new = """
                            <div style={{ marginBottom: '24px' }}>
                                {analytics && (
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Total Sent</p>
                                            <h3 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>{analytics.total_delivered}</h3>
                                        </div>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Failed</p>
                                            <h3 style={{ margin: 0, fontSize: '24px', color: '#ef4444' }}>{analytics.total_failed}</h3>
                                        </div>
                                        <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>Success Rate</p>
                                            <h3 style={{ margin: 0, fontSize: '24px', color: '#10b981' }}>{analytics.success_rate}</h3>
                                        </div>
                                    </div>
                                )}
                                
                                <input 
                                    type="text" 
                                    placeholder="Search logs by recipient, template, or subject..." 
                                    value={logSearchTerm}
                                    onChange={e => setLogSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>"""

if "Total Sent" not in text:
    text = text.replace(logs_header_old, logs_header_new)

# Table Header replacement for "Failure Reason" -> "Actions"
text = text.replace("<th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Failure Reason</th>", "<th style={{ padding: '12px', borderBottom: '2px solid #eee' }}>Actions</th>")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected Email Analytics UI, Search, and Retry!")
