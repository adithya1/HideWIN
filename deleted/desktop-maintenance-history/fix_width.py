import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update action-bar-wrapper to be a full-width container instead of fit-content
old_bar = '''
        .action-bar-wrapper {
            display: grid;
            grid-template-columns: minmax(180px, 220px) minmax(180px, 220px) auto auto;
            align-items: center;
            gap: 16px;
            width: 100%;
            max-width: fit-content; /* Don't stretch across huge screens */
            margin: 0 auto clamp(16px, 3vh, 24px) auto;
            padding: 12px 20px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        }
'''

new_bar = '''
        .action-bar-wrapper {
            display: grid;
            grid-template-columns: minmax(200px, 1fr) minmax(200px, 1fr) auto auto;
            align-items: center;
            gap: 16px;
            width: 100%;
            max-width: 1200px; /* Sensible wide content container */
            margin: 0 auto clamp(16px, 3vh, 24px) auto;
            padding: 12px 20px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        }
'''

content = content.replace(old_bar.strip(), new_bar.strip())

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated action-bar-wrapper to fill sensible container.")
