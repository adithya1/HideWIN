import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variable
if 'expandedDrawerMenus: { type: Object, state: true }' not in code:
    code = re.sub(
        r'isMobileMenuOpen:\s*\{\s*type:\s*Boolean\s*\},',
        r'isMobileMenuOpen: { type: Boolean },\n        expandedDrawerMenus: { type: Object, state: true },',
        code
    )

if 'this.expandedDrawerMenus =' not in code:
    code = re.sub(
        r'this\.isMobileMenuOpen\s*=\s*false;',
        r'this.isMobileMenuOpen = false;\n        this.expandedDrawerMenus = { profile: false, settings: false };',
        code
    )

if 'toggleDrawerMenu(' not in code:
    # insert before render()
    code = re.sub(
        r'render\(\)\s*\{',
        r'''toggleDrawerMenu(menuId) {
        this.expandedDrawerMenus = { ...this.expandedDrawerMenus, [menuId]: !this.expandedDrawerMenus[menuId] };
        this.requestUpdate();
    }

    render() {''',
        code
    )

# 2. Add CSS
css_to_add = """
            .drawer-accordion {
                display: grid;
                grid-template-rows: 0fr;
                transition: grid-template-rows 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                overflow: hidden;
            }
            .drawer-accordion.open {
                grid-template-rows: 1fr;
            }
            .drawer-accordion-inner {
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding-left: 14px;
                margin-left: 22px;
                border-left: 2px solid var(--border);
                margin-top: 4px;
                margin-bottom: 8px;
            }
            .drawer-parent-btn {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 12px 16px;
                border-radius: 12px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease;
                color: #334155;
            }
            .drawer-parent-btn:hover { background: #f8fafc; }
            .drawer-parent-btn.active { color: #0f172a; font-weight: 600; background: #f1f5f9; }
            
            .drawer-chevron {
                transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                color: #94a3b8;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .drawer-chevron.open {
                transform: rotate(180deg);
                color: #3b82f6;
            }
            
            .drawer-child-btn {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 10px 16px;
                border-radius: 8px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #64748b;
                font-size: 14px;
            }
            .drawer-child-btn:hover { background: #f8fafc; color: #334155; }
            .drawer-child-btn.active { color: var(--accent); font-weight: 600; background: rgba(59, 130, 246, 0.05); }
            
            .drawer-child-icon {
                margin-right: 12px;
                display: flex;
                align-items: center;
                opacity: 0.8;
            }
            .drawer-child-icon svg { width: 16px; height: 16px; }
"""

if 'drawer-accordion' not in code:
    code = code.replace(
        '.drawer-label {\n                font-size: 15px;\n                color: inherit;\n            }',
        '.drawer-label {\n                font-size: 15px;\n                color: inherit;\n            }' + css_to_add
    )

# 3. Replace Nav HTML
new_nav_html = """<nav class="drawer-nav">
                    <!-- Account & Profile (Parent) -->
                    <button class="drawer-parent-btn ${this.expandedDrawerMenus.profile ? 'active' : ''}" @click=${() => this.toggleDrawerMenu('profile')}>
                        <div style="display: flex; align-items: center;">
                            <div class="drawer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div class="drawer-label">Account & Profile</div>
                        </div>
                        <div class="drawer-chevron ${this.expandedDrawerMenus.profile ? 'open' : ''}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </button>
                    <div class="drawer-accordion ${this.expandedDrawerMenus.profile ? 'open' : ''}">
                        <div class="drawer-accordion-inner">
                            <button class="drawer-child-btn ${this.currentView === 'ai-customize' ? 'active' : ''}" @click=${() => { this.navigate('ai-customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                                Profile Settings
                            </button>
                            <button class="drawer-child-btn ${this.currentView === 'invite' ? 'active' : ''}" @click=${() => { this.navigate('invite'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                                Invite Friends
                            </button>
                            ${this.isAuthenticated ? html`
                                <button class="drawer-child-btn" style="color: #ef4444;" @click=${async () => {
                                    if (window.hideWin && window.hideWin.storage) {
                                        const creds = await window.hideWin.storage.getCredentials();
                                        await window.hideWin.storage.setCredentials({ ...creds, jwtToken: '', hashkey: '', user: null });
                                    }
                                    this.isAuthenticated = false;
                                    this.isMobileMenuOpen = false;
                                    this.currentView = 'main';
                                    this.requestUpdate();
                                }}>
                                    <div class="drawer-child-icon" style="color: #ef4444;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
                                    Sign Out
                                </button>
                            ` : html`
                                <button class="drawer-child-btn" style="color: var(--accent);" @click=${() => {
                                    this.isAuthenticated = false; 
                                    this.isMobileMenuOpen = false;
                                    this.requestUpdate();
                                }}>
                                    <div class="drawer-child-icon" style="color: var(--accent);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg></div>
                                    Sign In / Sign Up
                                </button>
                            `}
                        </div>
                    </div>

                    <!-- App Settings (Parent) -->
                    <button class="drawer-parent-btn ${this.expandedDrawerMenus.settings ? 'active' : ''}" @click=${() => this.toggleDrawerMenu('settings')}>
                        <div style="display: flex; align-items: center;">
                            <div class="drawer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </div>
                            <div class="drawer-label">App Settings</div>
                        </div>
                        <div class="drawer-chevron ${this.expandedDrawerMenus.settings ? 'open' : ''}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </button>
                    <div class="drawer-accordion ${this.expandedDrawerMenus.settings ? 'open' : ''}">
                        <div class="drawer-accordion-inner">
                            <button class="drawer-child-btn ${this.currentView === 'customize' ? 'active' : ''}" @click=${() => { this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div>
                                General Preferences
                            </button>
                            <button class="drawer-child-btn" @click=${() => { this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                Security & Privacy
                            </button>
                        </div>
                    </div>

                    <div style="height: 1px; background: var(--border); margin: 8px 16px;"></div>

                    <!-- Help & Support (Flat) -->
                    <button class="drawer-parent-btn ${this.currentView === 'help' ? 'active' : ''}" @click=${() => { this.navigate('help'); this.isMobileMenuOpen = false; }}>
                        <div style="display: flex; align-items: center;">
                            <div class="drawer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <div class="drawer-label">Help & Support</div>
                        </div>
                    </button>
                </nav>"""

code = re.sub(
    r'<nav class="drawer-nav">.*?</nav>',
    new_nav_html,
    code,
    flags=re.DOTALL
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied 2026 nested mobile drawer navigation architecture.")
