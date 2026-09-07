import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add currentSettingsTab property
code = code.replace(
    'expandedDrawerMenus: { type: Object, state: true },',
    'expandedDrawerMenus: { type: Object, state: true },\n        currentSettingsTab: { type: String },'
)

# Initialize in constructor
code = code.replace(
    "this.expandedDrawerMenus = { profile: false, settings: false };",
    "this.expandedDrawerMenus = { profile: false, settings: false };\n        this.currentSettingsTab = 'general';"
)

# Pass property to customize-view
code = code.replace(
    '<customize-view\n                        .theme=${this.themeMain}\n                        @onboarding-complete=${() => {',
    '<customize-view\n                        .theme=${this.themeMain}\n                        .activeTab=${this.currentSettingsTab}\n                        @onboarding-complete=${() => {'
)
code = code.replace(
    '<customize-view\n                                      .theme=${this.themeMain}\n                                      @onboarding-complete=${() => {',
    '<customize-view\n                                      .theme=${this.themeMain}\n                                      .activeTab=${this.currentSettingsTab}\n                                      @onboarding-complete=${() => {'
)

# Update App Settings drawer html
old_html = """                    <!-- App Settings (Parent) -->
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
                    </div>"""

new_html = """                    <!-- App Settings (Parent) -->
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
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'general') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'general'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
                                General
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'theme') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'theme'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>
                                Theme
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'keybinds') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'keybinds'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg></div>
                                Keybinds
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'security') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'security'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                Security
                            </button>
                        </div>
                    </div>"""

code = code.replace(old_html, new_html)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("HideWinApp drawer patched.")
