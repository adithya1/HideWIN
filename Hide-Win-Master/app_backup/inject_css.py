import re

css = """
            .notes-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-sm);
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                padding: var(--space-sm) var(--space-md);
                border-radius: 16px;
                border: 1px solid rgba(59, 130, 246, 0.2);
                box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5);
                flex-wrap: wrap;
                color: #0f172a;
                margin-bottom: var(--space-md);
            }

            .toolbar-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .notes-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: var(--font-size-xs);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                background: var(--bg-surface);
                border: 1px solid var(--border);
                color: var(--text-primary);
            }

            .notes-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border-color: rgba(99, 102, 241, 0.3);
            }

            .notes-btn.primary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                border: none;
                color: white;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .notes-btn.primary:hover {
                background: linear-gradient(135deg, #4f8cf6 0%, #3b82f6 100%);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
            }

            .notes-btn svg {
                width: 14px;
                height: 14px;
            }

            .search-box {
                flex: 1;
                min-width: 200px;
                max-width: 400px;
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 6px 12px;
                transition: all 0.2s;
            }

            .search-box:focus-within {
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .search-box svg {
                width: 16px;
                height: 16px;
                color: var(--text-muted);
                margin-right: 8px;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                width: 100%;
            }

            .notes-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding-bottom: 20px;
                width: 100%;
            }

            .list-row {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px 16px;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.2s;
            }

            .list-row:hover {
                border-color: rgba(99, 102, 241, 0.4);
                background: rgba(99, 102, 241, 0.05);
                transform: translateX(4px);
            }

            .list-row-icon {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .list-row-title {
                font-weight: 600;
                font-size: 14px;
                color: var(--text-primary);
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .list-row-type {
                font-size: 11px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
                background: var(--bg-body);
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .profiles-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                padding-bottom: 20px;
                width: 100%;
            }

            .profile-card, .session-card {
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

            .profile-card:hover, .session-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px -8px rgba(59, 130, 246, 0.15);
                border-color: rgba(99, 102, 241, 0.4);
                background: rgba(255, 255, 255, 0.95);
            }
"""

def inject_css(path, hook):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove existing conflicting classes to avoid duplicates
    classes_to_remove = ['.notes-toolbar', '.toolbar-actions', '.notes-btn', '.search-box', '.search-input', '.notes-list', '.list-row', '.profiles-grid', '.profile-card', '.session-card']
    for cls in classes_to_remove:
        content = re.sub(r'\\' + cls + r'\s*\{.*?\}', '', content, flags=re.DOTALL)
        content = re.sub(r'\\' + cls + r':hover\s*\{.*?\}', '', content, flags=re.DOTALL)
        content = re.sub(r'\\' + cls + r':focus-within\s*\{.*?\}', '', content, flags=re.DOTALL)
        content = re.sub(r'\\' + cls + r'\.primary\s*\{.*?\}', '', content, flags=re.DOTALL)
        content = re.sub(r'\\' + cls + r' svg\s*\{.*?\}', '', content, flags=re.DOTALL)

    content = content.replace(hook, css + "\n" + hook)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

inject_css('src/components/views/HistoryView.js', '.history-container {')
inject_css('src/components/views/AICustomizeView.js', '.profiles-container {')

print("CSS injected into both files.")
