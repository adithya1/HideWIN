with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

fetch_effect = """
  useEffect(() => {
    if (activeSettingsTab === 'email_templates' && emailTemplates.length === 0) {
      fetch('http://localhost:8000/api/admin/email-templates', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}` }})
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
                'Authorization': `Bearer ${localStorage.getItem('hidewin_token')}`
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
content = content.replace("  const fetchAiData = async () => {", fetch_effect + "\n  const fetchAiData = async () => {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected fetch hooks!")
