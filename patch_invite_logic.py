import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add properties
props = """        toastMessage: { type: String },
        toastType: { type: String },
        pendingParticipant: { type: Object },
        activeSidebar: { type: String },
        meetingSeconds: { type: Number }"""
content = content.replace("""        toastMessage: { type: String },
        toastType: { type: String },
        pendingParticipant: { type: Object }""", props)

# 2. Add constructor defaults
if "this.activeSidebar = null;" not in content:
    content = content.replace("this.pendingParticipant = null;", "this.pendingParticipant = null;\n        this.activeSidebar = null;\n        this.meetingSeconds = 0;")

# 3. Add auto-join in firstUpdated
auto_join = """        }
        
        if (this.prefillChannelId) {
            setTimeout(() => this.createChannel(), 500);
        }
    }"""
content = content.replace("        }\n    }", auto_join, 1) # Replace the end of firstUpdated

# 4. Timer Logic inside createChannel
timer_logic = """        if (this._meetingTimer) clearInterval(this._meetingTimer);
        this.meetingSeconds = 0;
        this._meetingTimer = setInterval(() => { this.meetingSeconds++; }, 1000);"""
if "this._meetingTimer = setInterval" not in content:
    content = content.replace('this.showToast("Starting channel creation...", "success");', 'this.showToast("Starting channel creation...", "success");\n' + timer_logic)

# 5. Clear timer in disconnectedCallback
if "if (this._meetingTimer) clearInterval(this._meetingTimer);" not in content:
    content = content.replace('super.disconnectedCallback();', 'if (this._meetingTimer) clearInterval(this._meetingTimer);\n        super.disconnectedCallback();')

# 6. Helper for formatting time
if "formatMeetingTime()" not in content:
    helpers = """    formatMeetingTime() {
        const h = Math.floor(this.meetingSeconds / 3600);
        const m = Math.floor((this.meetingSeconds % 3600) / 60);
        const s = this.meetingSeconds % 60;
        if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }\n\n    """
    content = content.replace("render() {", helpers + "render() {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected state and logic successfully.")
