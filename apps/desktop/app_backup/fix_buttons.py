import re

css_to_inject = """
            .search-box {
                display: flex;
                align-items: center;
                gap: 6px;
                background: #ffffff;
                border: 1px solid rgba(59, 130, 246, 0.3);
                box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05);
                border-radius: 12px;
                padding: 4px 10px;
                min-width: 180px;
                transition: all 0.2s;
                height: 42px;
                box-sizing: border-box;
            }

            .search-box svg {
                width: 14px;
                height: 14px;
                color: #64748b;
                flex-shrink: 0;
            }

            .search-box:focus-within {
                border-color: #3b82f6;
                background: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05);
            }

            .search-box input {
                background: transparent;
                border: none;
                color: #0f172a;
                width: 100%;
                font-size: var(--font-size-sm);
                outline: none;
                box-shadow: none;
                padding: 0;
            }

            .search-input::placeholder {
                color: #94a3b8;
            }

            .icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                border-radius: var(--radius-md);
                border: 1px solid var(--border-strong);
                background: var(--bg-elevated);
                color: var(--text-secondary);
                cursor: pointer;
                transition: all var(--transition);
                flex-shrink: 0;
            }
            
            .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .icon-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
            .icon-btn svg { width: 15px; height: 15px; }
"""

def fix_css(path, hook):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip out the incorrect .search-box rules I added previously
    content = re.sub(r'\.search-box\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.search-box:focus-within\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.search-box svg\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.search-input\s*\{.*?\}', '', content, flags=re.DOTALL)
    
    # Strip icon-btn if it exists
    content = re.sub(r'\.icon-btn\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.icon-btn:hover\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.icon-btn\.active\s*\{.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.icon-btn svg\s*\{.*?\}', '', content, flags=re.DOTALL)

    content = content.replace(hook, css_to_inject + "\n" + hook)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_css('src/components/views/HistoryView.js', '.unified-wrap {')
fix_css('src/components/views/AICustomizeView.js', '.profiles-container {')

print("Search box and list/grid buttons updated perfectly")
