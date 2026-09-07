with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add state machine variables
constructor_adds = """
        this.step = 'create'; // 'create' | 'share'
        this.createdMeeting = null;
        this.showEmailDrawer = false;
"""
if "this.step = 'create';" not in content:
    content = content.replace("this.attendees = [];", constructor_adds + "\n        this.attendees = [];")

# We will modify saveMeeting to switch to 'share' step instead of closing the view
new_save = """    async saveMeeting() {
        if (!this.title) {
            this.showToast('Meeting title is required', 'error');
            return;
        }
        
        try {
            const { ipcRenderer } = window.require('electron');
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if(prefsStr) {
                 const prefs = JSON.parse(prefsStr);
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            
            const apiUrl = dnsIP.includes('.loca.lt') ? `https://${dnsIP}/api/meetings/` : `http://${dnsIP}:${dnsPort}/api/meetings/`;
            const formData = new FormData();
            
            const meetingData = {
                title: this.title,
                description: "",
                start_time: new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString(),
                end_time: new Date(`${this.endDate}T${this.endTime}:00Z`).toISOString(),
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: [],
                cc_participants: [],
                bcc_participants: [],
                invite_url_base: dnsIP.includes('.loca.lt') ? `https://${dnsIP}/invite/index.html` : `http://${dnsIP}:${dnsPort}/invite/index.html`
            };
            
            formData.append('meeting_data', JSON.stringify(meetingData));
            
            this.showToast("Generating Meeting...", "success");
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                const creds = JSON.parse(tokenResponse);
                token = creds.jwtToken || "";
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                this.createdMeeting = Array.isArray(data) ? data[0] : data;
                this.step = 'share';
                this.showToast("Meeting Generated Successfully!", "success");
                this.requestUpdate();
            } else {
                this.showToast("Failed to schedule meeting", "error");
            }
        } catch(err) {
            console.error(err);
            this.showToast("Error saving meeting: " + err.message, "error");
        }
    }
"""

import re
content = re.sub(r'async saveMeeting\(\) \{.*?(?=render\(\) \{)', new_save + '\n\n    ', content, flags=re.DOTALL)

# Now we need to rewrite render() to handle step === 'create' and step === 'share'
# I will generate this part separately to keep it clean.
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Phase 1")
