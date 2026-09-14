import { html } from '../../assets/lit-core-2.7.4.min.js';
export function render() {
        return html`
            <div class="notes-container">
                
            ${this.toastMessage ? html`
                <div class="toast-notification ${this.toastType}">
                    ${this.toastType === 'success' ? html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M20 6L9 17l-5-5'></path></svg>` : html`<svg width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' style='vertical-align: text-bottom; margin-right: 6px;'><path d='M18 6L6 18M6 6l12 12'></path></svg>`}${this.toastMessage}
                </div>
            ` : ''}
            <div class="invite-container">
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
                        <div class="posh-meeting-container">
                                <!-- Glassmorphism Tools Overlay -->
                                ${this.showToolsOverlay ? html`
                                    <div style="position: absolute; top: 70px; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7);  z-index: 50; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);">
                                        <div style="display: flex; background: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 0 24px;">
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'notes' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'notes' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'notes'}>AI Notes</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'browser' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'browser' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'browser'}>Browser</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'settings' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'settings' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'settings'}>Settings</button>
                                            <button style="margin-left: auto; background: transparent; border: none; cursor: pointer; color: #4b5563;" @click=${() => this.showToolsOverlay = false}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                        <div style="flex: 1; overflow: hidden; position: relative; background: rgba(249,250,251,0.5);">
                                            ${this.activeToolTab === 'notes' ? html`<notes-view></notes-view>` : ''}
                                            ${this.activeToolTab === 'browser' ? html`<browse-view></browse-view>` : ''}
                                            ${this.activeToolTab === 'settings' ? html`<settings-view></settings-view>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            <div class="meeting-top-bar">
                                <div class="top-bar-left">
                                    <div class="meeting-timer">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        ${this.formatMeetingTime()}
                                    </div>
                                </div>
                                
                                <div class="top-bar-center">
                                    <button class="meeting-action-btn ${this.activeSidebar === 'chat' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'chat' ? null : 'chat'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>Chat</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.activeSidebar === 'people' ? 'active' : ''}" @click=${() => this.activeSidebar = this.activeSidebar === 'people' ? null : 'people'}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        <span>People</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.localStream ? 'active' : ''}" @click=${() => this.localStream ? this.showToast("Screen is already in share mode!", "success") : this.startScreenShare()}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="M8 17l4-4 4 4"></path></svg>
                                        <span>Share</span>
                                    </button>
                                    
                                    <button class="meeting-action-btn ${this.showToolsOverlay ? 'active' : ''}" @click=${() => this.showToolsOverlay = !this.showToolsOverlay}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        <span>Tools</span>
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
                                
                                <div class="top-bar-right" style="display: flex; gap: 12px;">
                                    <button style="background: transparent; border: 1px solid #d1d5db; color: #4b5563; padding: 6px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;" @click=${() => this.dispatchEvent(new CustomEvent('minimize-meeting', { bubbles: true, composed: true }))}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line></svg>
                                        Minimize
                                    </button>
                                    <button class="leave-btn" @click=${() => this.confirmLeave()}>Leave</button>
                                </div>
                            </div>
                            
                            <div class="meeting-main-area">
                                <div class="meeting-stage">
                                    <div class="avatar-circle">
                                        ${this.hostInitials}
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
                                                            ${this.activeControllerId === p.id ? html`
                                                                <span title="Has Control" style="font-size:11px; background:#e0e7ff; color:#4338ca; padding: 3px 6px; border-radius: 4px; font-weight: 600;">Control</span>
                                                                <button style="background:#fee2e2; color:#ef4444; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Revoke Control" @click=${() => this.revokeControl(p.id)}>Revoke</button>
                                                            ` : ''}
                                                            ${this.controlRequests.has(p.id) && this.activeControllerId !== p.id ? html`
                                                                <button style="background:#e0e7ff; color:#4338ca; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Grant Control" @click=${() => this.grantControl(p.id)}>Grant</button>
                                                            ` : ''}
                                                            ${p.status === 'active' && p.id !== 'me' ? html`
                                                                <button style="background:#fee2e2; border:none; cursor:pointer; color:#ef4444; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Soft Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'soft_mute_mic', target: p.id})); this.showToast("Requested soft mute", "success"); }}>S-Mute</button>
                                                                <button style="background:#7f1d1d; border:none; cursor:pointer; color:white; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Hard Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'hard_mute_mic', target: p.id})); this.showToast("Forced hard mute", "success"); }}>H-Mute</button>
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
                                
                                ${this.activeSidebar === 'chat' ? html`
                                    <div class="meeting-sidebar">
                                        <div class="sidebar-header">
                                            <span>Meeting Chat</span>
                                            <button class="sidebar-close" @click=${() => this.activeSidebar = null}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                        </div>
                                        <div class="sidebar-content" style="padding: 16px; display: flex; flex-direction: column; height: 100%;">
                                            <div style="flex: 1; overflow-y: auto; margin-bottom: 12px; display: flex; flex-direction: column; gap: 12px;">
                                                ${this.chatMessages.length === 0 ? html`<div style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 20px;">No messages yet. Start the conversation!</div>` : ''}
                                                ${this.chatMessages.map(m => html`
                                                    <div style="display: flex; flex-direction: column; align-items: ${m.sender === 'You (Host)' ? 'flex-end' : 'flex-start'};">
                                                        <span style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">${m.sender} â€¢ ${m.time}</span>
                                                        <div style="background: ${m.sender === 'You (Host)' ? '#dbeafe' : '#f3f4f6'}; color: #1f2937; padding: 8px 12px; border-radius: 8px; font-size: 13px; max-width: 90%; word-break: break-word;">
                                                            ${m.text}
                                                        </div>
                                                    </div>
                                                `)}
                                            </div>
                                            <div style="display: flex; gap: 8px;">
                                                <input type="text" style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; font-size: 13px; outline: none;" placeholder="Type a message..." .value=${this.chatInput} @input=${e => this.chatInput = e.target.value} @keyup=${e => { if (e.key === 'Enter') this.sendChat(); }}>
                                                <button style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 0 16px; cursor: pointer;" @click=${() => this.sendChat()}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                                </button>
                                            </div>
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
                    `}
                </div>
            </div>
        `;
    }

