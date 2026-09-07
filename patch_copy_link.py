import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Save button
old_btn = r'<button class="btn btn-primary" @click=${this.saveMeeting}>Save</button>'
new_btn = r"""<button class="btn btn-primary" style="display:flex;align-items:center;gap:6px" @click=${this.saveMeeting}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            Save & Copy Link
                        </button>"""
content = content.replace(old_btn, new_btn)

# 2. Update the success logic in saveMeeting()
old_success = r"""            if (response.ok) {
                const data = await response.json();
                this.showToast("Meeting Scheduled Successfully!", "success");
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
                }, 1000);
            }"""

new_success = r"""            if (response.ok) {
                const data = await response.json();
                
                try {
                    const createdMeeting = Array.isArray(data) ? data[0] : data;
                    if (createdMeeting && createdMeeting.id) {
                        const cloudHost = dnsIP.includes('.loca.lt') ? dnsIP : `${dnsIP}:${dnsPort}`;
                        const protocol = dnsIP.includes('.loca.lt') ? 'https' : 'http';
                        
                        let passcode = '';
                        if (createdMeeting.recurrence && createdMeeting.recurrence !== 'none') {
                            passcode = createdMeeting.recurrence;
                        } else {
                            passcode = createdMeeting.id.split('-').pop().toLowerCase();
                        }
                        
                        const inviteLink = `${protocol}://${cloudHost}/invite/index.html?channel=${createdMeeting.id}&passcode=${passcode}`;
                        navigator.clipboard.writeText(inviteLink).catch(err => console.error("Clipboard err:", err));
                        this.showToast("Saved! Invite link copied to clipboard.", "success");
                    } else {
                        this.showToast("Meeting Scheduled Successfully!", "success");
                    }
                } catch (e) {
                    this.showToast("Meeting Scheduled Successfully!", "success");
                }
                
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
                }, 1500);
            }"""

content = content.replace(old_success, new_success)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ScheduleMeetingView.js")
