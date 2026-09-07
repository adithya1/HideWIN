import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the createChannel connection logic
old_logic = """        // Connect to local backend for testing
        const host = this.dnsDomain ? this.dnsDomain : `${this.dnsIP}:${this.dnsPort}`;
        const protocol = this.dnsDomain ? 'wss' : 'ws';
        
        this.ws = new WebSocket(`${protocol}://${host}/ws/signaling/host/${this.activeChannelId}`);
        
        this.ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            this.showToast(`Error connecting to Signaling Server at ${host}. Make sure the Python server is running and accessible.`, 'error');
            this.activeChannelId = null;
            this.hostToken = null;
            this.requestUpdate();
        };"""

new_logic = """        // ALWAYS connect Host via 127.0.0.1 to avoid local firewall blocks, 
        // but generate the public invite link using the configured DNS settings.
        const localHost = `127.0.0.1:${this.dnsPort}`;
        
        this.ws = new WebSocket(`ws://${localHost}/ws/signaling/host/${this.activeChannelId}`);
        
        this.ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            this.showToast(`Error connecting to local Signaling Server at ${localHost}. Is Uvicorn running?`, 'error');
            this.activeChannelId = null;
            this.hostToken = null;
            this.requestUpdate();
        };"""

if "localHost = `127.0.0.1" not in text:
    text = text.replace(old_logic, new_logic)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed Host WebSocket to always use localhost while preserving public DNS for invite links!")
else:
    print("Already applied!")
