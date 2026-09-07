with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state property for leave modal
if "showLeaveModal: { type: Boolean }" not in content:
    content = content.replace("meetingSeconds: { type: Number }", "meetingSeconds: { type: Number },\n        showLeaveModal: { type: Boolean }")
    content = content.replace("this.meetingSeconds = 0;", "this.meetingSeconds = 0;\n        this.showLeaveModal = false;")

# 2. Add confirmLeave function
confirm_leave_fn = """    confirmLeave() {
        if (this.participants.length > 1) {
            this.showLeaveModal = true;
        } else {
            this.executeLeave();
        }
    }
    
    executeLeave() {
        this.showLeaveModal = false;
        if(this.ws) this.ws.close(); 
        this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
    }
"""
if "confirmLeave()" not in content:
    content = content.replace("render() {", confirm_leave_fn + "\n    render() {")

# 3. Change Leave button click
old_leave = """<button class="leave-btn" @click=${() => { if(this.ws) this.ws.close(); this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true })); }}>Leave</button>"""
new_leave = """<button class="leave-btn" @click=${() => this.confirmLeave()}>Leave</button>"""
content = content.replace(old_leave, new_leave)

# 4. Add the leave modal to the HTML (at the end of posh-meeting-container)
leave_modal = """
                                ${this.showLeaveModal ? html`
                                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
                                        <div style="background: white; border-radius: 12px; padding: 24px; width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); animation: scaleIn 0.2s ease-out;">
                                            <div style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 8px;">End Meeting?</div>
                                            <div style="font-size: 14px; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">There are still <b>${this.participants.length - 1} guests</b> in this session. Are you sure you want to disconnect and end the meeting for everyone?</div>
                                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                                <button style="background: white; border: 1px solid #d1d5db; color: #374151; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;" @click=${() => this.showLeaveModal = false}>Cancel</button>
                                                <button style="background: #ef4444; border: none; color: white; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;" @click=${() => this.executeLeave()}>End Meeting</button>
                                            </div>
                                        </div>
                                    </div>
                                    <style>@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }</style>
                                ` : ''}
"""
content = content.replace("                            </div>\n                        </div>\n                    `) : html`", leave_modal + "                            </div>\n                        </div>\n                    `) : html`")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected leave modal")
