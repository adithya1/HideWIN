with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Mail icon import
if 'Mail,' not in content:
    content = content.replace("Globe,", "Globe, Mail,")

# Add RichTextEditor import
if 'RichTextEditor' not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport RichTextEditor from '../components/RichTextEditor';")

# Add vertical tab button
tab_btn = """              <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                <Globe size={18} /> DNS & Network
              </button>
              <button className={`settings-nav-item ${activeSettingsTab === 'email_templates' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('email_templates')}>
                <Mail size={18} /> Email Templates
              </button>"""
content = content.replace("""              <button className={`settings-nav-item ${activeSettingsTab === 'dns' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('dns')}>
                <Globe size={18} /> DNS & Network
              </button>""", tab_btn)

# Add template content state (we need to inject state hooks)
state_hooks = """  const [activeSettingsTab, setActiveSettingsTab] = useState('email_templates');
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);"""
content = content.replace("const [activeSettingsTab, setActiveSettingsTab] = useState('ai_models');", state_hooks)

# Add fetch effect
fetch_effect = """
  useEffect(() => {
    if (activeSettingsTab === 'email_templates' && emailTemplates.length === 0) {
      fetch('http://localhost:8000/api/admin/email-templates', { headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }})
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                setEmailTemplates(data);
                if(data.length > 0) setSelectedTemplate(data[0]);
            }
        })
        .catch(console.error);
    }
  }, [activeSettingsTab]);

  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    try {
        const res = await fetch(`http://localhost:8000/api/admin/email-templates/${selectedTemplate.action_trigger}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: JSON.stringify({
                title: selectedTemplate.title,
                subject: selectedTemplate.subject,
                body_html: selectedTemplate.body_html
            })
        });
        if (res.ok) alert("Template saved successfully!");
        else alert("Failed to save template.");
    } catch (e) {
        alert("Error saving template.");
    }
  };
"""
content = content.replace("  const fetchLogs = async () => {", fetch_effect + "\n  const fetchLogs = async () => {")

# Add the UI section
ui_section = """
                {/* EMAIL TEMPLATES */}
                {activeSettingsTab === 'email_templates' && (
                  <div className="fade-in">
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Email Templates</h2>
                      <p style={{ color: 'var(--text-muted)' }}>Dynamically trigger rich HTML emails for system events.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {emailTemplates.map(t => (
                            <button 
                                key={t.action_trigger}
                                onClick={() => setSelectedTemplate(t)}
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    background: selectedTemplate?.action_trigger === t.action_trigger ? 'var(--primary)' : 'var(--surface)',
                                    color: selectedTemplate?.action_trigger === t.action_trigger ? 'white' : 'var(--text)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: selectedTemplate?.action_trigger === t.action_trigger ? 'bold' : 'normal'
                                }}
                            >
                                {t.title}
                                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>Trigger: {t.action_trigger}</div>
                            </button>
                        ))}
                      </div>

                      <div style={{ flex: 1 }} className="card">
                        {selectedTemplate ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Template Title</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={selectedTemplate.title} 
                                        onChange={e => setSelectedTemplate({...selectedTemplate, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Subject</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={selectedTemplate.subject} 
                                        onChange={e => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Body (Rich HTML)</label>
                                    <RichTextEditor 
                                        value={selectedTemplate.body_html} 
                                        onChange={val => setSelectedTemplate({...selectedTemplate, body_html: val})}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <button className="btn-primary" onClick={saveTemplate}>Save Template</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Select a template to edit.
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
"""
content = content.replace("{/* DNS & NETWORK */}", ui_section + "\n                {/* DNS & NETWORK */}")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched Admin.jsx")
