with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a state for showing the "Add Template" modal or form
add_state = """  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ action_trigger: '', title: '', subject: '', body_html: '' });"""
content = content.replace("  const [selectedTemplate, setSelectedTemplate] = useState(null);", add_state)

add_func = """
  const createTemplate = async () => {
    if (!newTemplate.action_trigger || !newTemplate.title) return alert("Trigger and Title are required");
    try {
        const res = await fetch(`http://localhost:8000/api/admin/email-templates`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
            },
            body: JSON.stringify(newTemplate)
        });
        if (res.ok) {
            const created = await res.json();
            setEmailTemplates([...emailTemplates, created]);
            setIsAddingTemplate(false);
            setSelectedTemplate(created);
            setNewTemplate({ action_trigger: '', title: '', subject: '', body_html: '' });
            alert("Template created successfully!");
        }
        else {
            const err = await res.json();
            alert("Failed to create template: " + (err.detail || 'Unknown error'));
        }
    } catch (e) {
        alert("Error creating template.");
    }
  };
"""
content = content.replace("  const saveTemplate = async () => {", add_func + "\n  const saveTemplate = async () => {")

add_btn = """
                      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            className="btn-primary" 
                            onClick={() => { setIsAddingTemplate(true); setSelectedTemplate(null); }}
                            style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            + Add Template
                        </button>
"""
content = content.replace("                      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>", add_btn)

add_ui = """
                      <div style={{ flex: 1 }} className="card">
                        {isAddingTemplate ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Action Trigger (e.g. user_login)</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="No spaces, use underscores"
                                        value={newTemplate.action_trigger} 
                                        onChange={e => setNewTemplate({...newTemplate, action_trigger: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Template Title</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={newTemplate.title} 
                                        onChange={e => setNewTemplate({...newTemplate, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Subject</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={newTemplate.subject} 
                                        onChange={e => setNewTemplate({...newTemplate, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Body (Rich HTML)</label>
                                    <RichTextEditor 
                                        value={newTemplate.body_html} 
                                        onChange={val => setNewTemplate({...newTemplate, body_html: val})}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                    <button className="btn-secondary" onClick={() => setIsAddingTemplate(false)}>Cancel</button>
                                    <button className="btn-primary" onClick={createTemplate}>Create Template</button>
                                </div>
                            </div>
                        ) : selectedTemplate ? (
"""
content = content.replace("""                      <div style={{ flex: 1 }} className="card">
                        {selectedTemplate ? (""", add_ui)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Add Template UI to Admin.jsx")
