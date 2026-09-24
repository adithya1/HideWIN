import re
with open('Hide-Win-Master/src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's fix the entire _handleSSO function
new_sso = '''    _handleSSO(provider) {
        const cm = window.configManager || (window.require ? window.require('./utils/configManager.js') : null);
        const apiBaseUrl = cm?.getApiBaseUrl?.() || 'http://127.0.0.1:8000';
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', `${apiBaseUrl}/auth/sso/${provider.toLowerCase()}/login`);
        } else {
            window.location.href = `${apiBaseUrl}/auth/sso/${provider.toLowerCase()}/login`;
        }
    }'''

text = re.sub(r'    _handleSSO\(provider\) \{[\s\S]*?    \} else \{[\s\S]*?    \} else \{[\s\S]*?    \}', new_sso, text)

# Just in case, replace any malformed blocks
text = re.sub(r'    _handleSSO\(provider\) \{[\s\S]*?(\n    render\(\) \{)', new_sso + r'\n\n\1', text)

with open('Hide-Win-Master/src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(text)
