import re

path = 'src/components/views/MainView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix .start-button to use sky blue gradient
content = re.sub(r'\.start-button:hover:not\(:disabled\)\s*{\s*transform: translateY\(-2px\);\s*background:\s*var\(--accent\);', r'.start-button:hover:not(:disabled) {\n            transform: translateY(-2px);\n            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);', content)

# Check for .start-btn-blue and ensure it has the gradient
content = content.replace('class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5); font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer;"',
'class="start-btn-blue" @click=${() => this._handleStart()} style="border-radius: 40px; padding: 14px 40px; display: flex; align-items: center; gap: 8px; border: none; outline: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5); background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"')

# Fix text color when there's a key error
content = content.replace('color: var(--bg-elevated)', 'color: white')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed MainView buttons")
