import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the preferences block
old_prefs = """            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
            this.dnsDomain = prefs.dnsDomain || '';
            this.dnsIP = prefs.dnsIP || '127.0.0.1';
            this.dnsPort = prefs.dnsPort || '8000';"""

new_prefs = """            // First try to fetch from the React Admin Panel's centralized FastAPI database
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/public/dns-settings');
                if (response.ok) {
                    const data = await response.json();
                    this.dnsDomain = data.dnsDomain || '';
                    this.dnsIP = data.dnsIP || '127.0.0.1';
                    this.dnsPort = data.dnsPort || '8000';
                    return;
                }
            } catch (err) {
                console.warn("Could not fetch from FastAPI Admin DB, falling back to Electron preferences.");
            }

            // Fallback to Electron preferences
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
            this.dnsDomain = prefs?.data?.dnsDomain || '';
            this.dnsIP = prefs?.data?.dnsIP || '127.0.0.1';
            this.dnsPort = prefs?.data?.dnsPort || '8000';"""

if "fetch('http://127.0.0.1:8000/api/user/public/dns-settings')" not in text:
    text = text.replace(old_prefs, new_prefs)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected FastAPI settings sync into InviteView.js!")
else:
    print("Already injected!")
