import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

broken_block = """    } else {
            this.dnsIP = '127.0.0.1';
            this.dnsPort = '8000';
        }
    }"""

# Since my replacement injected the correct `firstUpdated()` but left the dangling `} else { ... }`, I just need to remove the dangling `} else { ... }` and ensure the closing brace of `firstUpdated` is correct.

# Actually, the injected `firstUpdated` doesn't have an `else` for `if (window.require)`. 
# Let's completely rewrite the file's firstUpdated to be clean!

text = re.sub(r'async firstUpdated\(\)\s*\{[\s\S]*?\}\s*\} else \{[\s\S]*?\}\s*\}', """
    async firstUpdated() {
        if (window.require) {
            try {
                let usingApi = false;
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/user/public/dns-settings');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.dnsIP && data.dnsIP !== '127.0.0.1') {
                            this.dnsDomain = data.dnsDomain || '';
                            this.dnsIP = data.dnsIP || '127.0.0.1';
                            this.dnsPort = data.dnsPort || '8000';
                            usingApi = true;
                        }
                    }
                } catch (err) {}

                if (!usingApi) {
                    const { ipcRenderer } = window.require('electron');
                    const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
                    const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                    this.dnsDomain = (prefs.data && prefs.data.dnsDomain) ? prefs.data.dnsDomain : (prefs.dnsDomain || '');
                    this.dnsIP = (prefs.data && prefs.data.dnsIP) ? prefs.data.dnsIP : (prefs.dnsIP || '127.0.0.1');
                    this.dnsPort = (prefs.data && prefs.data.dnsPort) ? prefs.data.dnsPort : (prefs.dnsPort || '8000');
                }
            } catch (e) {
                this.dnsIP = '127.0.0.1';
                this.dnsPort = '8000';
            }
        } else {
            this.dnsIP = '127.0.0.1';
            this.dnsPort = '8000';
        }
    }
""", text, count=1)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed firstUpdated syntax!")
