import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

new_logic = """
    async firstUpdated() {
        if (window.require) {
            try {
                // First try to fetch from the React Admin Panel's centralized FastAPI database
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
                } catch (err) {
                    console.warn("Could not fetch from FastAPI Admin DB, falling back to Electron preferences.");
                }

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
        }
    }
"""

text = re.sub(r'async firstUpdated\(\)\s*\{[\s\S]*?\}\s*\}', new_logic.strip(), text, count=1)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Successfully injected fetch logic into InviteView.js!")
