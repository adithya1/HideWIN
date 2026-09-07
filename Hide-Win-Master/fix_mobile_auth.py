import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove the avatar button from the mobile header
code = re.sub(
    r'<div class="mobile-header-btn avatar-btn"[^>]*>.*?</div>',
    '',
    code,
    flags=re.DOTALL
)

# 2. Add auth buttons to the bottom of the drawer navigation
auth_html = """
                    <div style="height: 1px; background: var(--border); margin: 8px 16px;"></div>
                    ${this.isAuthenticated ? html`
                        <button class="drawer-nav-item" style="color: #ef4444;" @click=${async () => {
                            if (window.hideWin && window.hideWin.storage) {
                                const creds = await window.hideWin.storage.getCredentials();
                                await window.hideWin.storage.setCredentials({ ...creds, jwtToken: '', hashkey: '', user: null });
                            }
                            this.isAuthenticated = false;
                            this.isMobileMenuOpen = false;
                            this.currentView = 'main';
                            this.requestUpdate();
                        }}>
                            <div class="drawer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </div>
                            <div class="drawer-label">Sign Out</div>
                        </button>
                    ` : html`
                        <button class="drawer-nav-item" style="color: var(--accent);" @click=${() => {
                            this.isAuthenticated = false; 
                            this.isMobileMenuOpen = false;
                            this.requestUpdate();
                        }}>
                            <div class="drawer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                            </div>
                            <div class="drawer-label">Sign In / Sign Up</div>
                        </button>
                    `}
"""

code = code.replace(
    '<div class="drawer-label">Help & Support</div>\n                    </button>\n                </nav>',
    '<div class="drawer-label">Help & Support</div>\n                    </button>\n' + auth_html + '                </nav>'
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Moved Auth buttons to Mobile Drawer and removed top-right AV button.")
