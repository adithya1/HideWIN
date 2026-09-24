import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove drag from .auth-right
content = content.replace("background-position: center;\n            -webkit-app-region: drag;", "background-position: center;")

# 2. Add drag-region CSS back
drag_css = """
        .drag-region {
            position: absolute;
            top: 0;
            left: 0;
            right: 140px;
            height: 48px;
            -webkit-app-region: drag;
            z-index: 90;
        }
"""
# insert before .window-controls
content = content.replace(".window-controls {", drag_css + "\n        .window-controls {")

# 3. Restructure HTML: put drag-region and window-controls at root
old_auth_right = r'<div class="auth-right">\s*<div class="window-controls">\s*<button class="control-btn" @click=\$\{this._handleMinimize\} aria-label="Minimize">\s*<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>\s*</button>\s*<button class="control-btn" @click=\$\{this._handleMaximize\} aria-label="Maximize">\s*<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>\s*</button>\s*<button class="control-btn close" @click=\$\{this._handleClose\} aria-label="Close">\s*<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>\s*</button>\s*</div>\s*<!-- The background image handles the visual -->\s*</div>'

new_auth_right = '<div class="auth-right">\n                    <!-- The background image handles the visual -->\n                </div>'

content = re.sub(old_auth_right, new_auth_right, content, flags=re.DOTALL)

# Add them before auth-layout
old_auth_layout = '<div class="auth-layout">'
new_auth_layout = """<div class="drag-region"></div>
            <div class="window-controls">
                <button class="control-btn" @click=${this._handleMinimize} aria-label="Minimize">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <button class="control-btn" @click=${this._handleMaximize} aria-label="Maximize">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                </button>
                <button class="control-btn close" @click=${this._handleClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="auth-layout">"""

content = content.replace(old_auth_layout, new_auth_layout)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
