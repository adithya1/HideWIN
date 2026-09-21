import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Simplify the Configuration Sidebar Button to NOT have an accordion
old_config_btn = """                <div style={{ margin: '24px 16px 12px 16px', fontSize: '11px', fontWeight: '600', color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SETTINGS
                </div>

                <div 
                    onClick={() => { setActiveTab('settings'); if (!activeSettingsTab) setActiveSettingsTab('security'); }}
                    style={{
                        display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                        cursor: 'pointer', color: activeTab === 'settings' ? '#202124' : '#5f6368',
                        background: 'transparent', border: 'none', fontWeight: '500', fontSize: '15px', textAlign: 'left', width: '100%'
                    }}
                >
                    <Settings size={18} style={{ marginRight: '16px', color: activeTab === 'settings' ? '#202124' : '#5f6368' }} />
                    <span style={{ flex: 1 }}>Configuration</span>
                    {activeTab === 'settings' ? <ChevronDown size={16} color="#5f6368" /> : <ChevronRight size={16} color="#5f6368" />}
                </div>

                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
                        {[
                            { id: 'security', label: 'Security & Auth' },
                            { id: 'ai_models', label: 'AI Models & Keys' },
                            { id: 'transcription', label: 'Live Transcription' },
                            { id: 'architecture', label: 'Architecture' },
                            { id: 'dns', label: 'DNS & Network' },
                            { id: 'email_templates', label: 'Email Templates' },
                            { id: 'branding', label: 'Branding & Logos' }
                        ].map(sub => {
                            const isActive = activeSettingsTab === sub.id;
                            return (
                                <button key={sub.id} onClick={() => setActiveSettingsTab(sub.id)} style={{
                                    display: 'block', padding: '10px 16px 10px 50px', borderRadius: '6px',
                                    border: 'none', background: isActive ? '#f0f4ff' : 'transparent',
                                    color: isActive ? '#1a73e8' : '#6c7f93',
                                    fontWeight: isActive ? '500' : '400', fontSize: '14px', textAlign: 'left', cursor: 'pointer', width: '100%'
                                }}>
                                    {sub.label}
                                </button>
                            );
                        })}
                    </div>
                )}"""

new_config_btn = """                <div style={{ margin: '24px 16px 12px 16px', fontSize: '11px', fontWeight: '600', color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SETTINGS
                </div>

                <button 
                    onClick={() => { setActiveTab('settings'); if (!activeSettingsTab) setActiveSettingsTab('security'); }}
                    style={{
                        display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                        cursor: 'pointer', color: activeTab === 'settings' ? '#1a73e8' : '#5f6368',
                        backgroundColor: activeTab === 'settings' ? '#f0f4ff' : 'transparent',
                        border: 'none', fontWeight: activeTab === 'settings' ? '600' : '500', fontSize: '15px', textAlign: 'left', width: '100%', position: 'relative'
                    }}
                >
                    {activeTab === 'settings' && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                    <Settings size={18} style={{ marginRight: '16px', color: activeTab === 'settings' ? '#1a73e8' : '#5f6368' }} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
                    <span style={{ flex: 1 }}>Configuration</span>
                </button>"""

if "Configuration</span>" in text and "ChevronDown" in text:
    text = text.replace(old_config_btn, new_config_btn)

# 2. Inject horizontal tabs when activeTab === 'settings' inside the main content area
old_settings_main = """        {activeTab === 'settings' && (
          <div className="tab-content fade-in">
            {activeSettingsTab === 'security' && (
              <div className="card">"""

new_settings_main = """        {activeTab === 'settings' && (
          <div className="tab-content fade-in">
            {/* Horizontal Tabs for Admin Settings */}
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
            </div>

            {activeSettingsTab === 'security' && (
              <div className="card">"""

if "Horizontal Tabs for Admin Settings" not in text:
    text = text.replace(old_settings_main, new_settings_main)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Refactored Admin.jsx to use horizontal tabs for settings!")
