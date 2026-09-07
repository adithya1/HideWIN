import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the previous responsive CSS with the GRID version
old_css = r'/\* RESPONSIVE LAYOUT \*/.*?\.mobile-hamburger:hover\s*\{\s*background:\s*var\(--bg-app\);\s*\}'
new_css = """
        /* RESPONSIVE LAYOUT */
        @media (max-width: 900px) {
            .app-shell {
                display: grid !important;
                grid-template-columns: 64px 1fr;
                grid-template-rows: 40px 1fr;
                grid-template-areas:
                    "drag drag"
                    "sidebar content";
            }
            .top-drag-bar {
                grid-area: drag;
                width: 100%;
            }
            .top-toolbar {
                grid-area: sidebar;
                flex-direction: column;
                width: 100% !important;
                height: 100% !important;
                border-bottom: none;
                border-right: 1px solid var(--border);
                padding: 16px 8px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                align-items: flex-start;
                z-index: 100;
                background: var(--bg-surface);
            }
            /* Hover to expand stylish sidebar */
            @media (min-width: 601px) {
                .app-shell:has(.top-toolbar:hover) {
                    grid-template-columns: 200px 1fr;
                }
            }
            .horizontal-nav {
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
                gap: 12px;
                margin-top: 16px;
            }
            .nav-item {
                width: 100%;
                justify-content: flex-start;
                padding: 10px 12px;
                border-radius: 8px;
                overflow: hidden;
                white-space: nowrap;
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
            .content {
                grid-area: content;
                overflow: hidden;
                position: relative;
            }
        }

        @media (max-width: 600px) {
            .app-shell {
                display: flex !important;
                flex-direction: column !important;
            }
            .top-toolbar {
                position: absolute;
                left: 0;
                top: 40px;
                height: calc(100vh - 40px) !important;
                width: 220px !important;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 4px 0 24px rgba(0,0,0,0.4);
            }
            .top-toolbar.mobile-open {
                transform: translateX(0);
            }
            .content {
                width: 100vw;
            }
            .mobile-hamburger {
                display: flex !important;
            }
        }
        
        .mobile-hamburger {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-primary);
            padding: 4px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
        }
        .mobile-hamburger:hover {
            color: #007acc;
        }
"""
text = re.sub(old_css, new_css, text, flags=re.DOTALL)

# Now, we need to add the hamburger button to the top-drag-bar instead of top-toolbar!
# Wait, I previously injected it into top-toolbar. Let's remove it from there.
text = text.replace("""<button class="mobile-hamburger" @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>""", "")

# Add it to top-drag-bar, near the logo.
drag_bar_start = r'<div class="top-drag-bar">'
hamburger_inject = r"""<div class="top-drag-bar">
                        <button class="mobile-hamburger" @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>"""
text = text.replace(drag_bar_start, hamburger_inject, 1)

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated HideWinApp.js for grid-based responsiveness!")
