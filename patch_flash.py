with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove 500ms delay in firstUpdated
content = content.replace("setTimeout(() => this.createChannel(), 500);", "this.createChannel();")

# 2. Change the toast messages in createChannel
old_toast = """this.showToast("Starting channel creation...", "success");"""
new_toast = """this.showToast(this.prefillChannelId ? "Connecting to meeting..." : "Starting channel creation...", "success");"""
content = content.replace(old_toast, new_toast)

# 3. Change the render logic so the Create Channel form isn't shown if prefillChannelId exists
old_render = """${!this.activeChannelId ? html`
                        <div class="section-card">
                            <div class="section-title">Create Collaboration Channel</div>"""

new_render = """${!this.activeChannelId ? (this.prefillChannelId ? html`
                        <div style="display: flex; height: 100vh; align-items: center; justify-content: center; flex-direction: column;">
                            <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>
                            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                            <div style="font-size: 16px; font-weight: 500; color: #374151;">Connecting to Meeting...</div>
                        </div>
                    ` : html`
                        <div class="section-card">
                            <div class="section-title">Create Collaboration Channel</div>`)"""
content = content.replace(old_render, new_render)

# Because I added an open parenthesis `(this.prefillChannelId ? html... : html... )`, I need to close it where it switches to the active channel UI!
old_active = """</button>
                        </div>
                    ` : html`
                        <div class="posh-meeting-container">"""
new_active = """</button>
                        </div>
                    `) : html`
                        <div class="posh-meeting-container">"""
content = content.replace(old_active, new_active)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Create Channel flash and updated messages")
