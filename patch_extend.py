import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add properties
if "meetingData: { type: Object }" not in content:
    content = content.replace("showLeaveModal: { type: Boolean }", "showLeaveModal: { type: Boolean },\n        meetingData: { type: Object },\n        showExtendModal: { type: Boolean },\n        customExtMinutes: { type: Number }")
    content = content.replace("this.showLeaveModal = false;", "this.showLeaveModal = false;\n        this.showExtendModal = false;\n        this.customExtMinutes = 15;")

# 2. Update timer logic
old_timer = "this._meetingTimer = setInterval(() => { this.meetingSeconds++; }, 1000);"
new_timer = """this._meetingTimer = setInterval(() => { 
            if (this.meetingData && this.meetingData.end_time) {
                const diff = new Date(this.meetingData.end_time).getTime() - Date.now();
                this.meetingSeconds = Math.max(0, Math.floor(diff / 1000));
                
                // If meeting expired and modal not shown yet, show it!
                if (this.meetingSeconds === 0 && !this.showExtendModal && this.meetingData.id) {
                    // Check if we just joined an already expired meeting, show it immediately
                    this.showExtendModal = true;
                }
            } else {
                this.meetingSeconds++;
            }
            this.requestUpdate();
        }, 1000);"""
content = content.replace(old_timer, new_timer)

# 3. Add extendMeeting function
extend_fn = """    async extendMeeting(mins) {
        if (!this.meetingData || !this.meetingData.id) return;
        const currentEnd = new Date(this.meetingData.end_time).getTime();
        const newEnd = new Date(Math.max(currentEnd, Date.now()) + mins * 60000);
        
        try {
            let token = '';
            if (window.hideWin && window.hideWin.storage) {
                const creds = await window.hideWin.storage.getCredentials();
                if (creds) token = creds.jwtToken;
            }
            if (token) {
                const updatedMeeting = { ...this.meetingData, end_time: newEnd.toISOString() };
                const res = await fetch(`${this.invite_url_base.split('/invite')[0]}/api/meetings/${this.meetingData.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedMeeting)
                });
                if (res.ok) {
                    this.meetingData.end_time = newEnd.toISOString();
                    this.showExtendModal = false;
                    this.showToast(`Meeting extended by ${mins} minutes!`, "success");
                    
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify({ type: 'time_extended', end_time: this.meetingData.end_time }));
                    }
                    this.requestUpdate();
                } else {
                    this.showToast("Failed to extend meeting", "error");
                }
            }
        } catch (e) {
            console.error(e);
            this.showToast("Error extending meeting", "error");
        }
    }
"""
if "extendMeeting(" not in content:
    content = content.replace("render() {", extend_fn + "\n    render() {")

# 4. Add Extend Modal HTML
extend_modal = """
                                ${this.showExtendModal ? html`
                                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                                        <div style="background: white; border-radius: 12px; padding: 24px; width: 420px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: scaleIn 0.2s ease-out;">
                                            <div style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                Meeting Time Expired
                                            </div>
                                            <div style="font-size: 14px; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">
                                                Your scheduled meeting time has concluded. Would you like to extend the session?
                                            </div>
                                            
                                            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                                                <button style="flex: 1; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'" @click=${() => this.extendMeeting(30)}>
                                                    + 30 Mins
                                                </button>
                                                <button style="flex: 1; background: #f3f4f6; border: 1px solid #e5e7eb; color: #1f2937; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'" @click=${() => this.extendMeeting(60)}>
                                                    + 60 Mins
                                                </button>
                                            </div>
                                            
                                            <div style="display: flex; gap: 8px; align-items: center; background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #f3f4f6;">
                                                <span style="font-size: 13px; font-weight: 500; color: #4b5563;">Custom:</span>
                                                <input type="number" min="5" max="300" style="width: 70px; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; font-size: 14px;" .value=${this.customExtMinutes} @input=${e => this.customExtMinutes = parseInt(e.target.value) || 15}>
                                                <span style="font-size: 13px; color: #6b7280;">mins</span>
                                                <button style="margin-left: auto; background: #3b82f6; border: none; color: white; padding: 6px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;" @click=${() => this.extendMeeting(this.customExtMinutes)}>Extend</button>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
"""
content = content.replace("                            </div>\n                        </div>\n                    `) : html`", extend_modal + "                            </div>\n                        </div>\n                    `) : html`")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Extend Meeting Modal and Timer Logic")
