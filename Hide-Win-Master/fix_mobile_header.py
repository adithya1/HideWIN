import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add properties
props = """
        isMobileNavOpen: { type: Boolean },
        isMobileUserOpen: { type: Boolean },
"""
code = code.replace("    static properties = {\n", "    static properties = {\n" + props)

# 2. Add constructor state
constructor_state = """
        this.isMobileNavOpen = false;
        this.isMobileUserOpen = false;
"""
code = code.replace("        this.isInitializing = false;\n", "        this.isInitializing = false;\n" + constructor_state)

# 3. Add CSS
mobile_css = """
        .mobile-header {
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
        }
"""
styles_idx = code.find('static styles = css`')
styles_end = code.find('    `;', styles_idx)
code = code[:styles_end] + mobile_css + '\n' + code[styles_end:]

# 4. Add HTML
mobile_html = """
                <!-- Mobile Header -->
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
                </div>
"""

home_header_idx = code.find('<div class="home-header">')
code = code[:home_header_idx] + mobile_html + '\n                ' + code[home_header_idx:]

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated MainView.js!")
