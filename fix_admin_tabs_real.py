import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

old_settings_main = r"\{activeTab === 'settings' && \(\s*<div className=\"tab-content fade-in settings-layout\">"

new_settings_main = """{activeTab === 'settings' && (
          <div className="tab-content fade-in settings-layout">
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', marginBottom: '24px', gap: '24px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {[
                    { id: 'security', label: 'Security & Auth' },
                    { id: 'ai_models', label: 'AI Models & Keys' },
                    { id: 'transcription', label: 'Live Transcription' },
                    { id: 'architecture', label: 'Architecture' },
                    { id: 'dns', label: 'DNS & Network' },
                    { id: 'email_templates', label: 'Email Templates' },
                    { id: 'branding', label: 'Branding & Logos' }
                ].map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id)}
                        style={{ 
                            padding: '12px 0', 
                            cursor: 'pointer', 
                            color: activeSettingsTab === tab.id ? '#1a73e8' : '#5f6368', 
                            fontWeight: activeSettingsTab === tab.id ? '600' : '500', 
                            borderBottom: activeSettingsTab === tab.id ? '3px solid #1a73e8' : '3px solid transparent'
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>"""

if "Horizontal Tabs for Admin Settings" not in text and "borderBottom: activeSettingsTab" not in text:
    text = re.sub(old_settings_main, new_settings_main, text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed horizontal tabs in Admin.jsx!")
