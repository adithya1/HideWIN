import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

error_handler = """        this.ws = new WebSocket(`${protocol}://${host}/ws/signaling/host/${this.activeChannelId}`);
        
        this.ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            this.showToast(`Error connecting to Signaling Server at ${host}. Make sure the Python server is running and accessible.`, 'error');
            this.activeChannelId = null;
            this.hostToken = null;
            this.requestUpdate();
        };
        
        this.ws.onclose = () => {
            console.warn("WebSocket closed");
        };
"""

if "this.ws.onerror =" not in text:
    text = text.replace("this.ws = new WebSocket(`${protocol}://${host}/ws/signaling/host/${this.activeChannelId}`);", error_handler)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Added WebSocket error handling!")
