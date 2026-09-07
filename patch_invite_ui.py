import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the HTML block entirely for the active channel!
old_render_block_regex = r"\${!this\.activeChannelId \? html`[\s\S]*?</div>\s*`\s*}"

new_render_block = """${!this.activeChannelId ? html`
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
                    ` : html`
                        <div class="posh-meeting-container">
                            <div class="meeting-top-bar">
                                <div class="top-bar-left">
                                    <div class="meeting-timer">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        ${this.formatMeetingTime()}
                                    </div>
                                </div>
                                
                                <div class="top-bar-center">
                                    <button class="meeting-action-btn ${this.activeSidebar === 'people' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'people' ? null : 'people'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        <span>People</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.localStream ? 'active' : ''}" @click=${() => this.localStream ? this.stopSharing() : this.startScreenShare()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="M8 17l4-4 4 4"></path></svg>
                                        <span>Share</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.activeSidebar === 'settings' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'settings' ? null : 'settings'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                        <span>More</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn" title="Copy Invite Link" @click=${(e) => this.copyInviteLink()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        <span>Link</span>
                                    </button>
                                </div>
                                
                                <div class="top-bar-right">
                                    <button class="leave-btn" @click=${() => { if(this.ws) this.ws.close(); this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true })); }}>Leave</button>
                                </div>
                            </div>
                            
                            <div class="meeting-main-area">
                                <div class="meeting-stage">
                                    <div class="avatar-circle">
                                        ${this.channelName ? this.channelName.substring(0, 2).toUpperCase() : 'HW'}
                                    </div>
                                    <div class="waiting-text">
                                        ${this.localStream ? 'You are sharing your screen.' : (this.participants.length > 0 ? 'Meeting is Active.' : 'Waiting for others to join...')}
                                    </div>
                                    <div style="margin-top: 8px; color: #6b7280; font-size: 13px;">Meeting ID: ${this.activeChannelId}</div>
                                </div>
                                
                                ${this.activeSidebar === 'people' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Participants (${this.participants.length})</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content participant-list" style="padding: 16px;">
                                            ${this.participants.length === 0 ? html`<div style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">No participants yet.</div>` : ''}
                                            ${this.participants.map(p => html`
                                                <div class="participant-item" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                                        <div style="display: flex; align-items: center; gap: 8px;">
                                                            <div class="status-dot ${p.status} ${p.isTalking ? 'talking' : ''}"></div>
                                                            <span class="participant-name" style="font-weight: 500; font-size: 14px;">${p.name}</span>
                                                        </div>
                                                        <div style="display: flex; gap: 4px;">
                                                            ${this.activeControllerId === p.id ? html`<span title="Has Control" style="font-size:12px; background:#e0e7ff; color:#4338ca; padding: 2px 6px; border-radius: 4px;">Control</span>` : ''}
                                                            ${this.controlRequests.has(p.id) && this.activeControllerId !== p.id ? html`
                                                                <button style="background:#e0e7ff; color:#4338ca; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Grant Control" @click=${() => this.grantControl(p.id)}>Grant</button>
                                                            ` : ''}
                                                            ${p.status === 'active' && p.id !== 'me' ? html`
                                                                <button style="background:transparent; border:none; cursor:pointer; color:#ef4444;" title="Mute Participant" @click=${() => this.ws.send(JSON.stringify({type: 'mute_user', target: p.id}))}>
                                                                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                                                </button>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                    ${p.status === 'waiting' ? html`
                                                        <div class="actions" style="display: flex; gap: 8px;">
                                                            <button class="action-btn accept" style="flex: 1; background: #10b981; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;" @click=${() => this.acceptParticipant(p.id)}>Admit</button>
                                                            <button class="action-btn reject" style="flex: 1; background: #ef4444; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;" @click=${() => this.rejectParticipant(p.id)}>Deny</button>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${this.activeSidebar === 'settings' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Sharing Permissions</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content" style="padding: 20px;">
                                            <div class="sharing-grid" style="display: flex; flex-direction: column; gap: 16px;">
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.screen} @change=${() => this.toggleSharing('screen')}>
                                                    Screen Sharing
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.audio} @change=${() => this.toggleSharing('audio')}>
                                                    System Audio
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.mic} @change=${() => this.toggleSharing('mic')}>
                                                    Microphone
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.transcription} @change=${() => this.toggleSharing('transcription')}>
                                                    Live Transcription
                                                </label>
                                                <div style="border-top: 1px solid #e5e7eb; margin: 8px 0;"></div>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.remoteMouse} @change=${() => this.toggleSharing('remoteMouse')}>
                                                    Remote Mouse Control
                                                </label>
                                                <label class="checkbox-label" style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; cursor: pointer;">
                                                    <input type="checkbox" style="width: 16px; height: 16px;" .checked=${this.sharingOptions.remoteKeyboard} @change=${() => this.toggleSharing('remoteKeyboard')}>
                                                    Remote Keyboard Control
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `}"""

content = re.sub(old_render_block_regex, new_render_block, content)

# Inject CSS for the new layout
css_to_inject = """
            .posh-meeting-container {
                display: flex;
                flex-direction: column;
                height: 100vh;
                background: white;
                margin: -24px; /* offset the .invite-container padding */
            }
            .meeting-top-bar {
                height: 60px;
                background: white;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                z-index: 20;
            }
            .top-bar-left { display: flex; align-items: center; gap: 12px; width: 200px; }
            .top-bar-center { display: flex; align-items: center; gap: 4px; justify-content: center; flex: 1; }
            .top-bar-right { display: flex; align-items: center; gap: 12px; width: 200px; justify-content: flex-end; }

            .meeting-timer {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .meeting-action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                color: #4b5563;
                min-width: 68px;
                height: 52px;
                border-radius: 8px;
                transition: background 0.15s ease;
            }
            .meeting-action-btn:hover, .meeting-action-btn.active {
                background: #f3f4f6;
                color: #111827;
            }
            .meeting-action-btn svg { width: 20px; height: 20px; margin-bottom: 4px; }
            .meeting-action-btn span { font-size: 11px; font-weight: 500; }

            .leave-btn {
                background: #ef4444;
                color: white;
                border-radius: 6px;
                padding: 6px 16px;
                font-weight: 600;
                font-size: 14px;
                border: none;
                cursor: pointer;
                transition: background 0.15s ease;
            }
            .leave-btn:hover { background: #dc2626; }

            .meeting-main-area {
                display: flex;
                flex: 1;
                background: #f3f2f1;
                position: relative;
                overflow: hidden;
            }

            .meeting-stage {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .avatar-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: #fce7f3;
                color: #831843;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                font-weight: 500;
                margin-bottom: 24px;
            }
            .waiting-text {
                font-size: 18px;
                color: #374151;
                font-weight: 500;
            }

            .meeting-sidebar {
                width: 320px;
                background: white;
                border-left: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
                box-shadow: -4px 0 15px rgba(0,0,0,0.03);
                z-index: 10;
            }
            .sidebar-header {
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .sidebar-close {
                background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 4px;
                display: flex; align-items: center; justify-content: center;
            }
            .sidebar-close:hover { background: #f3f4f6; color: #111827; }
            .sidebar-content {
                flex: 1;
                overflow-y: auto;
            }
"""
content = content.replace(".invite-container {", css_to_inject + "\n            .invite-container {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected HTML & CSS for MS Teams Layout")
