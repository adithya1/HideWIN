import os
p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add a diagnostic status display
debug_ui = """
          <div style="margin-bottom: 24px; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; background: #1e1e1e; color: #00ff00;">
              [DIAGNOSTICS]<br>
              Target WS URL: ${this.dnsDomain ? 'wss' : 'ws'}://${this.dnsDomain ? this.dnsDomain : (this.dnsIP + ':' + this.dnsPort)}/ws/signaling/host/${this.activeChannelId}<br>
              Host Token: ${this.hostToken ? this.hostToken : 'UNDEFINED (Not connected)'}<br>
              DNS Prefs: IP=${this.dnsIP}, Port=${this.dnsPort}, Domain=${this.dnsDomain}
          </div>
          
          <div class="section-card">
              <div class="card-title">ACTIVE CHANNEL</div>
"""

if "[DIAGNOSTICS]" not in text:
    text = text.replace("""<div class="section-card">\n              <div class="card-title">ACTIVE CHANNEL</div>""", debug_ui)
    
    # Also, update the alert to be more specific
    old_alert = "alert('Error: Not connected to Signaling Server! Please ensure your Python backend is running on the correct IP and Port, then try creating the channel again.');"
    new_alert = "alert('Error: Not connected to Signaling Server!\\n\\nURL Tried: ' + (this.dnsDomain ? 'wss' : 'ws') + '://' + (this.dnsDomain ? this.dnsDomain : (this.dnsIP + ':' + this.dnsPort)) + '\\n\\nAre you sure Uvicorn is running on port ' + this.dnsPort + '?');"
    text = text.replace(old_alert, new_alert)
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected diagnostics")
