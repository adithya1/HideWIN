import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'render() {',
    'render() {\n        try {'
)

# Find the last `return html\`` block and add catch
code = code.replace(
    '`;\n    }\n}\n\ncustomElements.define',
    '`;\n        } catch(e) { console.error("RENDER_ERROR:", e); return html`<div style="color:red; background:white; padding:20px; z-index:999999; position:absolute;"><h1>Render Error</h1><pre>${e.stack}</pre></div>`; }\n    }\n}\n\ncustomElements.define'
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched render with try-catch")
