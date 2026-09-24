import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add pendingParticipant to properties
if "pendingParticipant: { type: Object }" not in text:
    text = text.replace("toastType: { type: String }", "toastType: { type: String },\n        pendingParticipant: { type: Object }")

# 2. Modify participant_joined handling
old_join = """            } else if(msg.type === 'participant_joined') {
                this.participants = [
                    ...this.participants,
                    { id: 'guest-' + Date.now(), name: msg.name || 'Guest', role: 'Waiting for approval', status: 'waiting' }
                ];
                this.requestUpdate();
            }"""

new_join = """            } else if(msg.type === 'participant_joined') {
                const guestId = 'guest-' + Date.now();
                const guestName = msg.name || 'Guest';
                this.participants = [
                    ...this.participants,
                    { id: guestId, name: guestName, role: 'Waiting for approval', status: 'waiting' }
                ];
                this.pendingParticipant = { id: guestId, name: guestName };
                this.requestUpdate();
            }"""

text = text.replace(old_join, new_join)

# 3. Add the admit/deny modal CSS
modal_css = """
            .admit-modal {
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                border: 1px solid #334155;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                min-width: 300px;
            }
            .admit-modal-title { font-weight: 600; color: white; font-size: 15px; }
            .admit-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
            .admit-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .admit-btn:hover { background: #2563eb; }
            .deny-btn { background: transparent; color: #cbd5e1; border: 1px solid #475569; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .deny-btn:hover { background: #334155; }
            @keyframes slideDown { from { transform: translate(-50%, -50px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            .invite-container {
"""
if ".admit-modal {" not in text:
    text = text.replace(".invite-container {", modal_css)

# 4. Add the HTML for the modal
modal_html = """
              ${this.pendingParticipant ? html`
                  <div class="admit-modal">
                      <div class="admit-modal-title">Someone wants to join this session</div>
                      <div style="color: #94a3b8; font-size: 14px; margin-bottom: 4px;"><b>${this.pendingParticipant.name}</b> is waiting in the lobby.</div>
                      <div class="admit-modal-actions">
                          <button class="deny-btn" @click=${() => {
                              this.rejectParticipant(this.pendingParticipant.id);
                              this.pendingParticipant = null;
                          }}>Deny entry</button>
                          <button class="admit-btn" @click=${() => {
                              this.acceptParticipant(this.pendingParticipant.id);
                              this.pendingParticipant = null;
                          }}>Admit</button>
                      </div>
                  </div>
              ` : ''}
              <div class="invite-container">
"""
if "admit-modal" not in text:
    text = text.replace('<div class="invite-container">', modal_html)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Injected 'Admit' popup modal into Desktop App!")
