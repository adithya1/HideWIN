import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove old window-controls and drag-region
old_header = r'<div class="drag-region"></div>\s*<div class="window-controls">.*?</div>\s*<div class="auth-layout">'
content = re.sub(old_header, '<div class="auth-layout">', content, flags=re.DOTALL)

# Insert window-controls inside auth-right
old_auth_right = r'<div class="auth-right">\s*<!-- The background image handles the visual -->'
new_auth_right = """<div class="auth-right">
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
                    <!-- The background image handles the visual -->"""
content = content.replace('<div class="auth-right">\n                    <!-- The background image handles the visual -->', new_auth_right)

# Change placeholder text
content = content.replace('placeholder="name@company.com"', 'placeholder="name@email.com"')

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
