import re

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

grid_css = """
            .profiles-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                padding-bottom: 20px;
                width: 100%;
            }

            .session-card {
                background: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px -2px rgba(59, 130, 246, 0.05);
            }

            .session-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px -8px rgba(59, 130, 246, 0.15);
                border-color: rgba(99, 102, 241, 0.4);
                background: rgba(255, 255, 255, 0.95);
            }
"""

content = re.sub(r'\.profiles-grid\s*\{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.session-card\s*\{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.session-card:hover\s*\{.*?\}', '', content, flags=re.DOTALL)

content = content.replace(".session-left {", grid_css + "\n            .session-left {")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("HistoryView.js grid aligned")
