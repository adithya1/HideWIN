import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. CSS for the bottom sheet
mobile_css_add = """
            .child-dropdown {
                position: fixed !important;
                top: auto !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                max-height: 60vh !important;
                border-radius: 24px 24px 0 0 !important;
                padding: 24px 16px calc(24px + env(safe-area-inset-bottom, 0px)) 16px !important;
                z-index: 9999 !important;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.2) !important;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                background: var(--bg-surface) !important;
                border: none !important;
                box-sizing: border-box;
            }
            .mobile-sheet-backdrop {
                display: block !important;
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.4);
                backdrop-filter: blur(2px);
                z-index: 9998;
                animation: fadeIn 0.2s ease;
            }
            .sheet-header {
                display: flex !important;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 16px;
                margin-bottom: 8px;
                border-bottom: 1px solid var(--border);
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
            }
            .sheet-close-btn {
                background: rgba(120,120,120,0.1);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-secondary);
            }
"""

global_css_add = """
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .mobile-sheet-backdrop { display: none; }
        .sheet-header { display: none; }
"""

# Insert CSS
code = code.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */" + global_css_add)
code = code.replace("/* Pinned grid fix for mobile */", mobile_css_add + "\n            /* Pinned grid fix for mobile */")

# 2. Update Mode Dropdown HTML
old_mode_dropdown = """                        ${this.isModeMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">"""
                            
new_mode_dropdown = """                        ${this.isModeMenuOpen ? html`
                            <div class="mobile-sheet-backdrop" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = false; this.requestUpdate(); }}></div>
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                <div class="sheet-header">
                                    <span>Select Mode</span>
                                    <button class="sheet-close-btn" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = false; this.requestUpdate(); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>"""
code = code.replace(old_mode_dropdown, new_mode_dropdown)

# 3. Update Profile Dropdown HTML
old_profile_dropdown = """                        ${this.isProfileMenuOpen ? html`
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">"""

new_profile_dropdown = """                        ${this.isProfileMenuOpen ? html`
                            <div class="mobile-sheet-backdrop" @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = false; this.requestUpdate(); }}></div>
                            <div class="child-dropdown" style="position: absolute; top: calc(100% + 16px); left: -12px; width: calc(100% + 24px); background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; z-index: 100; max-height: 280px; overflow-y: auto; padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);">
                                <div class="sheet-header">
                                    <span>Select Profile</span>
                                    <button class="sheet-close-btn" @click=${(e) => { e.stopPropagation(); this.isProfileMenuOpen = false; this.requestUpdate(); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>"""
code = code.replace(old_profile_dropdown, new_profile_dropdown)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added mobile bottom sheet styling and logic.")
