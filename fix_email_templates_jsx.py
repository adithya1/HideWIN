import re

file_path = "services/web/src/pages/EmailTemplates.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# We'll inject a Send Campaign button when the category is MARKETING or CUSTOM
import_icons = "import { Mail, Plus, Save, Eye, RefreshCw, Layers } from 'lucide-react';"
if "import { Mail, Plus, Save, Eye, RefreshCw, Layers, Send } from 'lucide-react';" not in text:
    text = text.replace(import_icons, "import { Mail, Plus, Save, Eye, RefreshCw, Layers, Send } from 'lucide-react';")

# Add state variables for Campaign Modal
state_injections = """
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [campaignAudience, setCampaignAudience] = useState('all_active_users');
    const [campaignCustomEmails, setCampaignCustomEmails] = useState('');
"""
if "setShowCampaignModal" not in text:
    text = text.replace("const [activeTab, setActiveTab] = useState('templates');", "const [activeTab, setActiveTab] = useState('templates');" + state_injections)

# Add handler for dispatching
dispatch_handler = """
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
"""
if "handleDispatchCampaign" not in text:
    text = text.replace("const handleSave = async () => {", dispatch_handler + "\n    const handleSave = async () => {")

# Add the button in the UI next to Save Template if it's MARKETING or CUSTOM
button_injection = """
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
"""

# Find where the Save Template button is and replace it
text = re.sub(
    r"<button onClick=\{handleSave\}.*?</button>",
    button_injection,
    text,
    flags=re.DOTALL
)

# Add Modal
modal_injection = """
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
"""

# Inject modal before the final closing div
if "showCampaignModal &&" not in text:
    idx = text.rfind("</div>")
    text = text[:idx] + modal_injection + text[idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected Campaign Modal into React UI!")
