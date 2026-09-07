import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add isMobileMenuOpen to properties
if 'isMobileMenuOpen: { type: Boolean }' not in text:
    text = text.replace('isAuthenticated: { type: Boolean },', 'isAuthenticated: { type: Boolean },\n        isMobileMenuOpen: { type: Boolean },')

# 2. Add to constructor
if 'this.isMobileMenuOpen = false;' not in text:
    text = text.replace('this.isAuthenticated = false;', 'this.isAuthenticated = false;\n        this.isMobileMenuOpen = false;')

# 3. Add CSS for responsive layout
responsive_css = """
        /* RESPONSIVE LAYOUT */
        @media (max-width: 900px) {
            .app-shell {
                flex-direction: row;
            }
            .top-toolbar {
                flex-direction: column;
                width: 64px;
                height: 100vh;
                border-bottom: none;
                border-right: 1px solid var(--border);
                padding: 16px 8px;
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: visible;
                align-items: flex-start;
                z-index: 1000;
                background: var(--bg-surface);
            }
            .top-toolbar:hover {
                width: 200px;
                box-shadow: 4px 0 16px rgba(0,0,0,0.2);
            }
            .horizontal-nav {
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
                gap: 12px;
                margin-top: 32px;
            }
            .nav-item {
                width: 100%;
                justify-content: flex-start;
                padding: 10px 12px;
                border-radius: 8px;
            }
            .nav-item svg {
                min-width: 18px;
                margin-right: 8px;
            }
            .toolbar-right {
                flex-direction: column;
                margin-top: auto;
                align-items: flex-start !important;
                gap: 16px !important;
                width: 100%;
                overflow: hidden;
            }
            .main-content {
                flex: 1;
                width: calc(100vw - 64px);
            }
        }

        @media (max-width: 600px) {
            .top-toolbar {
                position: absolute;
                left: 0;
                top: 0;
                width: 220px !important;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .top-toolbar.mobile-open {
                transform: translateX(0);
                box-shadow: 4px 0 24px rgba(0,0,0,0.4);
            }
            .main-content {
                width: 100vw;
            }
            .mobile-hamburger {
                display: flex !important;
            }
        }
        
        .mobile-hamburger {
            display: none;
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 999;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }
        .mobile-hamburger:hover {
            background: var(--bg-app);
        }
"""
text = text.replace('</style>', responsive_css + '\n    </style>')

# 4. Add hamburger button and apply class
hamburger_html = """
            <button class="mobile-hamburger" @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div class="top-toolbar ${this._isLiveMode() ? 'hidden' : ''} ${this.isMobileMenuOpen ? 'mobile-open' : ''}">
"""
text = text.replace("""<div class="top-toolbar ${this._isLiveMode() ? 'hidden' : ''}">""", hamburger_html)


with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated HideWinApp.js for responsiveness!")
