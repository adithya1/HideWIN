import sys, re

with open("src/components/views/AssistantView.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace all var(--bg-elevated) used as text color with var(--text-primary)
code = re.sub(r'color:\s*var\(--bg-elevated\)', 'color: var(--text-primary)', code)

# Find the "Window Size" section in the modal and inject the Theme Toggle right before it
theme_toggle_html = """
                                <div style="margin-top: 8px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                                    <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--text-primary);">Theme</h4>
                                    <div style="display: flex; gap: 8px;">
                                        <button @click=${() => this.changeTheme('system')} style="flex: 1; padding: 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); cursor: pointer;">Auto</button>
                                        <button @click=${() => this.changeTheme('light')} style="flex: 1; padding: 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); cursor: pointer;">Light</button>
                                        <button @click=${() => this.changeTheme('dark')} style="flex: 1; padding: 8px; background: var(--bg-hover); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); cursor: pointer;">Dark</button>
                                    </div>
                                </div>
"""

# Find the Window Size section
window_size_pattern = r'(<h4 style="[^"]*">Window\s*Size</h4>)'
code = re.sub(window_size_pattern, theme_toggle_html + r'\n                                  \1', code, count=1)

# Ensure changeTheme exists
change_theme_method = """
    changeTheme(theme) {
        if (window.hideWin && window.hideWin.storage) {
            window.hideWin.storage.updatePreference('theme', theme);
        }
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'system') {
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
        this.requestUpdate();
    }
"""
if "changeTheme" not in code:
    # Insert it before render()
    code = code.replace("render() {", change_theme_method + "\n    render() {", 1)

with open("src/components/views/AssistantView.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated AssistantView.js to fix colors and add Theme toggle.")
