import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the chunk from `<div class="invite-container">` up to `<div class="posh-meeting-container">`
regex = r"<div class=\"invite-container\">[\s\S]*?<div class=\"posh-meeting-container\">"

correct_chunk = """<div class="invite-container">

                    ${!this.activeChannelId ? (this.prefillChannelId ? html`
                        <div style="display: flex; height: 100vh; align-items: center; justify-content: center; flex-direction: column; margin-top: -60px;">
                            <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>
                            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                            <div style="font-size: 16px; font-weight: 500; color: #374151;">Connecting to Meeting...</div>
                        </div>
                    ` : html`
                        <div class="section-card">
                            <div class="section-title">Create Collaboration Channel</div>
                            
                            <div class="input-group">
                                <label class="input-label">Channel Name</label>
                                <input type="text" class="text-input" 
                                    placeholder="e.g. Client Presentation" 
                                    .value=${this.channelName} 
                                    @input=${e => this.channelName = e.target.value}
                                    @keyup=${e => e.key === 'Enter' && this.createChannel()}>
                            </div>
                            
                            <button class="primary-btn" @click=${(e) => this.createChannel()}>Create Channel</button>
                        </div>
                    `) : html`
                        <div class="posh-meeting-container">"""

content = re.sub(regex, correct_chunk, content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed syntax error")
