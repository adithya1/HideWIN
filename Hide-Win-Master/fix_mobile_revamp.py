import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update the CSS for mobile revamp
mobile_css_old = """        .mobile-header {
            display: none;
        }
        @media (max-width: 768px) {
            .home-header {
                display: none !important;
            }
            .mobile-header {
                display: flex !important;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 24px;
                position: relative;
            }
            .mobile-header-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                cursor: pointer;
            }
            .mobile-dropdown {
                position: absolute;
                top: 48px;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.2);
                width: 200px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                padding: 8px;
            }
            .mobile-dropdown.left {
                left: 0;
            }
            .mobile-dropdown.right {
                right: 0;
            }
            .mobile-dropdown-item {
                padding: 12px 16px;
                border-radius: 8px;
                color: var(--text-primary);
                font-weight: 500;
                cursor: pointer;
            }
            .mobile-dropdown-item:hover {
                background: rgba(120,120,120,0.1);
            }
            
            /* Pinned grid fix for mobile */
            .pinned-shortcuts-container {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            .pinned-shortcut-card {
                width: 100% !important;
                height: 100px !important;
            }
        }"""

mobile_css_new = """        .mobile-header {
            display: none;
        }
        @media (max-width: 768px) {
            .home-container {
                padding: 0 !important;
                background: var(--bg-app) !important;
            }
            .home-header {
                display: none !important;
            }
            .mobile-header {
                display: flex !important;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                background: var(--accent, #3b82f6) !important;
                padding: 16px 20px !important;
                position: relative;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 50;
            }
            .mobile-header-title {
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: 0.5px;
                flex: 1;
                text-align: center;
            }
            .mobile-header-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: transparent !important;
                border: none !important;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff !important;
                cursor: pointer;
            }
            .mobile-dropdown {
                position: absolute;
                top: 60px;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                width: 220px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                padding: 8px;
            }
            .mobile-dropdown.left {
                left: 12px;
            }
            .mobile-dropdown.right {
                right: 12px;
            }
            .mobile-dropdown-item {
                padding: 12px 16px;
                border-radius: 8px;
                color: var(--text-primary);
                font-weight: 500;
                cursor: pointer;
            }
            .mobile-dropdown-item:hover {
                background: rgba(120,120,120,0.1);
            }
            
            /* Action Pill as a Mobile Card */
            .action-bar-pill {
                flex-direction: column;
                border-radius: 16px;
                padding: 24px;
                gap: 20px;
                margin: 24px 16px !important;
                width: auto !important;
                max-width: none !important;
                background: var(--bg-surface) !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
                border: 1px solid var(--border) !important;
            }
            .action-bar-pill > div, .action-bar-pill > button {
                width: 100% !important;
                max-width: 100% !important;
            }
            
            /* Pinned grid fix for mobile */
            .pinned-shortcuts-container {
                grid-template-columns: repeat(2, 1fr) !important;
                margin: 0 16px 24px 16px !important;
                width: auto !important;
                box-sizing: border-box;
                padding: 16px !important;
            }
            .pinned-shortcut-card {
                width: 100% !important;
                height: 100px !important;
            }
            .home-subtext {
                margin-left: 16px !important;
                margin-right: 16px !important;
            }
        }"""

if mobile_css_old in code:
    code = code.replace(mobile_css_old, mobile_css_new)
    print("Replaced CSS.")
else:
    print("Could not find old CSS string to replace.")

# 2. Update the HTML for mobile revamp
mobile_html_old = """                <!-- Mobile Header -->
                <div class="mobile-header">
                    <div style="position: relative;">
                        <div class="mobile-header-btn" @click=${(e) => { e.stopPropagation(); this.isMobileNavOpen = !this.isMobileNavOpen; this.isMobileUserOpen = false; this.requestUpdate(); }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </div>
                        ${this.isMobileNavOpen ? html`
                            <div class="mobile-dropdown left">
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('main')}>Home</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('ai-customize')}>Profile</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('notes')}>Notes</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('history')}>History</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('browse')}>Browse</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('invite')}>Invite</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('help')}>Help</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="position: relative;">
                        <div class="mobile-header-btn" @click=${(e) => { e.stopPropagation(); this.isMobileUserOpen = !this.isMobileUserOpen; this.isMobileNavOpen = false; this.requestUpdate(); }} style="background: rgba(59, 130, 246, 0.1); border: none; color: #3b82f6; font-weight: bold; font-size: 14px;">
                            AV
                        </div>
                        ${this.isMobileUserOpen ? html`
                            <div class="mobile-dropdown right">
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('ai-customize')}>Profile Settings</div>
                                <div class="mobile-dropdown-item" @click=${() => this.dispatchEvent(new CustomEvent('sign-out', { bubbles: true, composed: true }))}>Sign Out</div>
                            </div>
                        ` : ''}
                    </div>
                </div>"""

mobile_html_new = """                <!-- Mobile Header -->
                <div class="mobile-header">
                    <div style="position: relative;">
                        <div class="mobile-header-btn" @click=${(e) => { e.stopPropagation(); this.isMobileNavOpen = !this.isMobileNavOpen; this.isMobileUserOpen = false; this.requestUpdate(); }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </div>
                        ${this.isMobileNavOpen ? html`
                            <div class="mobile-dropdown left">
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('main')}>Home</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('ai-customize')}>Profile</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('notes')}>Notes</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('history')}>History</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('browse')}>Browse</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('invite')}>Invite</div>
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('help')}>Help</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="mobile-header-title">HideWin</div>
                    
                    <div style="position: relative;">
                        <div class="mobile-header-btn" @click=${(e) => { e.stopPropagation(); this.isMobileUserOpen = !this.isMobileUserOpen; this.isMobileNavOpen = false; this.requestUpdate(); }} style="border: 2px solid rgba(255,255,255,0.4) !important; font-weight: bold; font-size: 13px;">
                            AV
                        </div>
                        ${this.isMobileUserOpen ? html`
                            <div class="mobile-dropdown right">
                                <div class="mobile-dropdown-item" @click=${() => this.onNavigate('ai-customize')}>Profile Settings</div>
                                <div class="mobile-dropdown-item" @click=${() => this.dispatchEvent(new CustomEvent('sign-out', { bubbles: true, composed: true }))}>Sign Out</div>
                            </div>
                        ` : ''}
                    </div>
                </div>"""

if mobile_html_old in code:
    code = code.replace(mobile_html_old, mobile_html_new)
    print("Replaced HTML.")
else:
    print("Could not find old HTML string to replace.")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done!")
