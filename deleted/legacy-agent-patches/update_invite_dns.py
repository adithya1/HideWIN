import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add static properties for DNS
if "dnsDomain: { type: String }" not in text:
    text = text.replace("sharingOptions: { type: Object }", "sharingOptions: { type: Object },\n        dnsDomain: { type: String },\n        dnsIP: { type: String },\n        dnsPort: { type: String }")

# Add firstUpdated hook to load preferences
if "firstUpdated" not in text:
    first_updated = """
    async firstUpdated() {
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                const prefsStr = await ipcRenderer.invoke('get-preferences');
                const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                this.dnsDomain = prefs.dnsDomain || '';
                this.dnsIP = prefs.dnsIP || '127.0.0.1';
                this.dnsPort = prefs.dnsPort || '8001';
            } catch (e) {
                this.dnsIP = '127.0.0.1';
                this.dnsPort = '8001';
            }
        } else {
            this.dnsIP = '127.0.0.1';
            this.dnsPort = '8001';
        }
    }
"""
    text = text.replace("createChannel() {", first_updated + "\n    createChannel() {")

# Update createChannel websocket connection to use dynamic host
new_ws = """
        const host = this.dnsDomain ? this.dnsDomain : `${this.dnsIP}:${this.dnsPort}`;
        const protocol = this.dnsDomain ? 'wss' : 'ws';
        this.ws = new WebSocket(`${protocol}://${host}/ws/signaling/host/${this.activeChannelId}`);
"""
text = re.sub(r"this\.ws = new WebSocket\(`ws:\/\/127\.0\.0\.1:8001.*?`\);", new_ws.strip(), text)

# Update copyInviteLink link to use dynamic host
new_link = """
        const host = this.dnsDomain ? this.dnsDomain : `${this.dnsIP}:${this.dnsPort}`;
        const protocol = this.dnsDomain ? 'https' : 'http';
        const link = `${protocol}://${host}/invite/index.html`;
"""
text = re.sub(r"const link = `http:\/\/127\.0\.0\.1:8001.*?`;", new_link.strip(), text)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated InviteView.js to use dynamic DNS preferences")
