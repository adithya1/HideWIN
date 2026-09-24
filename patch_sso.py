import re
with open('Hide-Win-Master/src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_sso = '''    _handleSSO(provider) {
        const cm = window.configManager || (window.require ? window.require('./utils/configManager.js') : null);
        const apiBaseUrl = cm?.getApiBaseUrl?.() || 'http://127.0.0.1:8000';
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', ${apiBaseUrl}/auth/sso//login);
        } else {
            window.location.href = ${apiBaseUrl}/auth/sso//login;
        }
    }'''

text = re.sub(r'    _handleSSO\(provider\) \{[\s\S]*?    \}', new_sso, text)

with open('Hide-Win-Master/src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(text)
