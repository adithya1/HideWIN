import { html } from '../../assets/lit-core-2.7.4.min.js';

export function render() {
        return html`
            <div class="sidebar-layout">
                <!-- Left Sidebar -->
                <div class="sidebar">
                    <div class="sidebar-group">
                        <div class="sidebar-item ${this.activeTab === 'general' ? 'active' : ''}" @click=${() => this.activeTab = 'general'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            General
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'theme' ? 'active' : ''}" @click=${() => this.activeTab = 'theme'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                            Theme
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'keybinds' ? 'active' : ''}" @click=${() => this.activeTab = 'keybinds'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>
                            Keybinds
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'profile' ? 'active' : ''}" @click=${() => this.activeTab = 'profile'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Account
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'security' ? 'active' : ''}" @click=${() => this.activeTab = 'security'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Security
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'language' ? 'active' : ''}" @click=${() => this.activeTab = 'language'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            Language
                        </div>
                        <div class="sidebar-item ${this.activeTab === 'billing' ? 'active' : ''}" @click=${() => this.activeTab = 'billing'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            Billing
                        </div>
                    </div>

                    <div class="sidebar-group" style="margin-top: auto;">
                        <div class="sidebar-group-title">Support</div>
                        <div class="sidebar-item" @click=${() => console.log('Release Notes')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Release Notes
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Help Center')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Help Center
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Contact Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Contact Support
                        </div>
                    </div>
                    
                    <div class="sidebar-group" style="margin-bottom: 0;">
                        <div class="sidebar-item" @click=${() => { this._showSignOutModal = true; this.requestUpdate(); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Sign out
                        </div>
                        <div class="sidebar-item" @click=${() => console.log('Quit HideWin')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            Quit HideWin
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="main-content">
                    ${this.activeTab === 'billing' ? this.renderBillingTab() : ''}
                    
                    ${this.activeTab === 'general' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">General Settings</h2>
                            ${this.renderApiKeysSection()}
                            ${this.renderAudioSection()}
                            ${this.renderPrivacySection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'theme' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Theme & Appearance</h2>
                            ${this.renderAppearanceSection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'language' ? html`
                        <div class="legacy-settings-wrapper">
                            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Language Settings</h2>
                            ${this.renderLanguageSection()}
                        </div>
                    ` : ''}

                    ${this.activeTab === 'keybinds' ? this.renderKeybindsTab() : ''}
                    
                    ${this.activeTab === 'profile' ? this.renderProfileTab() : ''}

                    ${['security'].includes(this.activeTab) ? html`
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                            <h2>${this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1)} configuration coming soon</h2>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${this._showSignOutModal ? html`
                <div class="modal-backdrop" @click=${() => { this._showSignOutModal = false; this.requestUpdate(); }} style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <div class="modal-content" @click=${e => e.stopPropagation()} style="background: white; width: 400px; padding: 32px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; animation: slideUp 0.2s ease-out;">
                        <h2 style="margin-top: 0; font-size: 20px; color: var(--text-primary); font-weight: 600; margin-bottom: 12px;">Sign Out</h2>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 32px; line-height: 1.5;">
                            Are you sure you want to sign out? You will need to re-authenticate with an OTP to continue using HideWin.
                        </p>
                        <div style="display: flex; justify-content: flex-end; gap: 12px;">
                            <button class="btn btn-secondary" @click=${() => { this._showSignOutModal = false; this.requestUpdate(); }} style="padding: 10px 20px; border-radius: 8px; border: 1px solid #D1D5DB; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: background 0.2s;">Cancel</button>
                            <button class="btn" style="padding: 10px 20px; border-radius: 8px; border: none; background: #ef4444; color: white; font-weight: 500; cursor: pointer; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); transition: background 0.2s;" @click=${() => {
                                this._showSignOutModal = false;
                                this.dispatchEvent(new CustomEvent('sign-out', { bubbles: true, composed: true }));
                            }}>Sign Out</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
