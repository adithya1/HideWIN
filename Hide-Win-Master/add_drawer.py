import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add mobile-header HTML right before <div class="app-shell-content">
# Wait, HideWinApp.js structure:
# <div class="app-shell ...">
#   <div class="top-drag-bar ...">
#   <div class="top-toolbar ...">
#   <div class="app-shell-content ...">
#      ${this.renderView()}
#   </div>
# </div>

drawer_html = """
            <!-- Mobile App Header (Visible only on mobile/portrait) -->
            <div class="mobile-app-header">
                <div class="mobile-header-btn hamburger-btn" @click=${() => this.isMobileMenuOpen = true}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </div>
                <div class="mobile-header-title">HideWin</div>
                <div class="mobile-header-btn avatar-btn" style="border: 2px solid rgba(255,255,255,0.4); font-size: 12px; font-weight: bold;" @click=${() => this.navigate('ai-customize')}>
                    AV
                </div>
            </div>

            <!-- Mobile Drawer Overlay -->
            <div class="mobile-drawer-overlay ${this.isMobileMenuOpen ? 'open' : ''}" @click=${() => this.isMobileMenuOpen = false}></div>

            <!-- Mobile Drawer -->
            <div class="mobile-drawer ${this.isMobileMenuOpen ? 'open' : ''}">
                <div class="drawer-profile-section">
                    <div class="drawer-avatar">
                        <img src="./assets/images/media_1788628968575.png" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                        <div class="fallback-avatar" style="display: none; width: 100%; height: 100%; background: #e2e8f0; align-items: center; justify-content: center; color: #475569; font-weight: bold; font-size: 20px;">AV</div>
                    </div>
                    <div class="drawer-name">Sophia Rose</div>
                    <div class="drawer-role">UX/UI Designer</div>
                </div>
                
                <nav class="drawer-nav">
                    ${items.map(item => html`
                        <button class="drawer-nav-item ${this.currentView === item.id ? 'active' : ''}" @click=${() => { this.navigate(item.id); this.isMobileMenuOpen = false; }}>
                            <div class="drawer-icon">${item.icon}</div>
                            <div class="drawer-label">${item.label}</div>
                        </button>
                    `)}
                </nav>
            </div>
"""

# Find where to inject it. We can put it right before <div class="top-toolbar
code = code.replace('<div class="top-toolbar', drawer_html + '\n            <div class="top-toolbar')

# 2. Add CSS
drawer_css = """
        /* --- Mobile Revamp CSS --- */
        .mobile-app-header {
            display: none;
        }
        .mobile-drawer-overlay {
            display: none;
        }
        .mobile-drawer {
            display: none;
        }
        
        /* The trigger is exactly 768px for tab/mobile matching */
        @media (max-width: 768px) {
            /* Hide the desktop nav bar completely */
            .top-toolbar {
                display: none !important;
            }
            
            /* Show the beautiful blue native header */
            .mobile-app-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 60px;
                background: #3b82f6;
                padding: 0 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 100;
                flex-shrink: 0;
            }
            .mobile-header-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                cursor: pointer;
                background: transparent;
            }
            .mobile-header-title {
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: 0.5px;
                flex: 1;
                text-align: center;
            }
            
            /* Posh Side Drawer */
            .mobile-drawer-overlay {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.4);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 1000;
            }
            .mobile-drawer-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }
            
            .mobile-drawer {
                display: flex;
                flex-direction: column;
                position: fixed;
                top: 0;
                left: 0;
                width: 280px;
                height: 100vh;
                background: #ffffff;
                z-index: 1001;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 4px 0 24px rgba(0,0,0,0.15);
                overflow-y: auto;
            }
            .mobile-drawer.open {
                transform: translateX(0);
            }
            
            /* Drawer Profile Header */
            .drawer-profile-section {
                padding: 40px 24px 24px 24px;
                border-bottom: 1px solid #f1f5f9;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            .drawer-avatar {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                overflow: hidden;
                margin-bottom: 16px;
                background: #f1f5f9;
                border: 2px solid #e2e8f0;
            }
            .drawer-name {
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 4px;
            }
            .drawer-role {
                font-size: 13px;
                font-weight: 500;
                color: #64748b;
            }
            
            /* Drawer Navigation */
            .drawer-nav {
                display: flex;
                flex-direction: column;
                padding: 16px 12px;
                gap: 4px;
            }
            .drawer-nav-item {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 12px 16px;
                border-radius: 12px;
                border: none;
                background: transparent;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease;
                color: #334155;
            }
            .drawer-nav-item:hover {
                background: #f8fafc;
            }
            .drawer-nav-item.active {
                background: #f1f5f9;
                color: #0f172a;
                font-weight: 600;
            }
            .drawer-icon {
                margin-right: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: inherit;
            }
            .drawer-icon svg {
                width: 20px;
                height: 20px;
            }
            .drawer-label {
                font-size: 15px;
                color: inherit;
            }
        }
"""
code = code.replace("/* RESPONSIVE LAYOUT */", drawer_css + "\n/* RESPONSIVE LAYOUT */")

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated HideWinApp.js with posh drawer.")
