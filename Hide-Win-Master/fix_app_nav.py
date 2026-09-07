import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update the mobile-drawer content (remove the map over items, put static secondary items)
old_drawer_nav = """                <nav class="drawer-nav">
                    ${items.map(item => html`
                        <button class="drawer-nav-item ${this.currentView === item.id ? 'active' : ''}" @click=${() => { this.navigate(item.id); this.isMobileMenuOpen = false; }}>
                            <div class="drawer-icon">${item.icon}</div>
                            <div class="drawer-label">${item.label}</div>
                        </button>
                    `)}
                </nav>"""

new_drawer_nav = """                <nav class="drawer-nav">
                    <button class="drawer-nav-item ${this.currentView === 'ai-customize' ? 'active' : ''}" @click=${() => { this.navigate('ai-customize'); this.isMobileMenuOpen = false; }}>
                        <div class="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div class="drawer-label">Profile Settings</div>
                    </button>
                    <button class="drawer-nav-item ${this.currentView === 'invite' ? 'active' : ''}" @click=${() => { this.navigate('invite'); this.isMobileMenuOpen = false; }}>
                        <div class="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <div class="drawer-label">Invite Friends</div>
                    </button>
                    <button class="drawer-nav-item ${this.currentView === 'help' ? 'active' : ''}" @click=${() => { this.navigate('help'); this.isMobileMenuOpen = false; }}>
                        <div class="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div class="drawer-label">Help & Support</div>
                    </button>
                </nav>"""

code = code.replace(old_drawer_nav, new_drawer_nav)

# 2. Add bottom nav HTML
old_content_html = """                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>"""
                
new_content_html = """                <div class="content">
                    <div class="content-inner ${isLive ? 'live' : ''}">
                        ${this.renderCurrentView()}
                    </div>
                </div>
                
                <!-- MOBILE BOTTOM NAV -->
                <nav class="mobile-bottom-nav">
                    <button class="bottom-nav-item ${this.currentView === 'main' ? 'active' : ''}" @click=${() => this.navigate('main')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Home</span>
                    </button>
                    <button class="bottom-nav-item ${this.currentView === 'notes' ? 'active' : ''}" @click=${() => this.navigate('notes')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>Notes</span>
                    </button>
                    <button class="bottom-nav-item ${this.currentView === 'history' ? 'active' : ''}" @click=${() => this.navigate('history')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>History</span>
                    </button>
                    <button class="bottom-nav-item ${this.currentView === 'browse' ? 'active' : ''}" @click=${() => this.navigate('browse')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span>Browse</span>
                    </button>
                </nav>"""

code = code.replace(old_content_html, new_content_html)

# 3. Add bottom nav CSS
bottom_nav_css = """
        .mobile-bottom-nav {
            display: none;
        }

        @media (max-width: 768px) {
            .mobile-bottom-nav {
                display: flex;
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100vw;
                height: 60px;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-top: 1px solid rgba(0, 0, 0, 0.06);
                z-index: 900;
                align-items: center;
                justify-content: space-around;
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
            :host-context(html[data-theme='dark']) .mobile-bottom-nav,
            html[data-theme='dark'] .mobile-bottom-nav {
                background: rgba(30, 41, 59, 0.85);
                border-top: 1px solid rgba(255, 255, 255, 0.06);
            }
            .bottom-nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: transparent;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                gap: 4px;
            }
            .bottom-nav-item svg {
                width: 24px;
                height: 24px;
                stroke-width: 1.5;
            }
            .bottom-nav-item span {
                font-size: 11px;
                font-weight: 500;
            }
            .bottom-nav-item.active {
                color: #3b82f6;
            }
            .bottom-nav-item.active svg {
                stroke-width: 2;
            }
            .content {
                padding-bottom: 60px !important;
            }
        }
"""
code = code.replace("/* RESPONSIVE LAYOUT */", bottom_nav_css + "\n/* RESPONSIVE LAYOUT */")

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added bottom nav and updated drawer.")
