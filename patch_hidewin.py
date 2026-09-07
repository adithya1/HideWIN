with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "activeMeetingData: { type: Object }" not in content:
    content = content.replace("currentViewParams: { type: Object },", "currentViewParams: { type: Object },\n        activeMeetingData: { type: Object },")
    content = content.replace("this.currentViewParams = null;", "this.currentViewParams = null;\n        this.activeMeetingData = null;", 1)

# Modify the router inside renderCurrentView
old_start_meeting = """                    @start-existing-meeting=${(e) => { 
                        this.currentViewParams = e.detail;
                        this.currentView = 'active-meeting'; 
                        this.requestUpdate(); 
                    }}"""
new_start_meeting = """                    @start-existing-meeting=${(e) => { 
                        this.activeMeetingData = e.detail;
                        this.currentViewParams = e.detail;
                        this.currentView = 'active-meeting'; 
                        this.requestUpdate(); 
                    }}"""
content = content.replace(old_start_meeting, new_start_meeting)

# Remove active-meeting from switch
old_active_case = """            case 'active-meeting':
                return html`<invite-view .prefillChannelId=${this.currentViewParams?.id} .prefillPasscode=${this.currentViewParams?.passcode}></invite-view>`;"""
content = content.replace(old_active_case, "")

# Modify the render function
old_render_content = """                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>"""
new_render_content = """                    <div class="content-inner ${isLive ? 'live' : ''}" style="position: relative;">
                        ${this.activeMeetingData ? html`
                            <div style="display: ${this.currentView === 'active-meeting' ? 'block' : 'none'}; height: 100%; width: 100%; position: absolute; top: 0; left: 0; z-index: 10; background: white;">
                                <invite-view 
                                    .prefillChannelId=${this.activeMeetingData.id} 
                                    .prefillPasscode=${this.activeMeetingData.passcode}
                                    @close-meeting=${() => { this.activeMeetingData = null; this.currentView = 'invite'; this.requestUpdate(); }}>
                                </invite-view>
                            </div>
                        ` : ''}
                        
                        <div style="display: ${this.currentView === 'active-meeting' ? 'none' : 'block'}; height: 100%; width: 100%;">
                            ${this.renderCurrentView()}
                            
                            <!-- Global Widget when meeting is active but view is hidden -->
                            ${this.activeMeetingData && this.currentView !== 'active-meeting' ? html`
                                <div style="position: absolute; bottom: 24px; right: 24px; background: #1e293b; color: white; border-radius: 12px; padding: 12px 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 16px; z-index: 999; border: 1px solid #334155; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);">
                                    <div style="display: flex; flex-direction: column;">
                                        <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Meeting Active</span>
                                        <span style="font-size: 14px; font-weight: 600;">Stealth Session</span>
                                    </div>
                                    <button style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-weight: 600; cursor: pointer;" @click=${() => { this.currentView = 'active-meeting'; this.requestUpdate(); }}>Return to Meeting</button>
                                </div>
                                <style>@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }</style>
                            ` : ''}
                        </div>
                    </div>"""
content = content.replace(old_render_content, new_render_content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("HideWinApp patched for global meeting engine")
