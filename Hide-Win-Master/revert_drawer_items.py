import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

bad_btns = """                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'security') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'security'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                Security
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'language') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'language'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
                                Language
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'dns') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'dns'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg></div>
                                DNS & Network
                            </button>
                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'billing') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'billing'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg></div>
                                Billing
                            </button>"""

good_security_btn = """                            <button class="drawer-child-btn ${(this.currentView === 'customize' && this.currentSettingsTab === 'security') ? 'active' : ''}" @click=${() => { this.currentSettingsTab = 'security'; this.navigate('customize'); this.isMobileMenuOpen = false; }}>
                                <div class="drawer-child-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                                Security
                            </button>"""

code = code.replace(bad_btns, good_security_btn)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Reverted drawer items")
