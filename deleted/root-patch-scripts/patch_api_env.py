with open('services/web/src/api.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'export const API_BASE = "http://127.0.0.1:8000";',
    'export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";'
)

with open('services/web/src/api.js', 'w', encoding='utf-8') as f:
    f.write(text)
