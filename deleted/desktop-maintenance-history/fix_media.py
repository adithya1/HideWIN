import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# completely rewrite the @media (max-width: 750px) block
new_media = '''
        /* Very Small Window Responsive Rules */
        @media (max-width: 750px), (max-height: 600px) {
            :host { padding: 4px !important; }
            .home-container { padding: 4px !important; }
            
            .action-bar-wrapper {
                flex-wrap: nowrap !important;
                flex-direction: row !important;
                justify-content: flex-start !important;
                padding: 0 !important;
                gap: 8px !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
                margin: 8px 0 !important;
            }
            
            .action-dropdown { flex: 0 1 auto !important; min-width: 0 !important; max-width: 130px !important; }
            .action-dropdown-content { padding: 4px !important; gap: 4px !important; border-radius: 6px; }
            .action-dropdown-content:hover { background: var(--bg-hover); }
            .action-dropdown-content svg:not([viewBox="0 0 24 24"]) { display: none !important; } 
            .action-dropdown-content span { font-size: 13px !important; font-weight: 500 !important; }
            
            .mouse-toggle-wrapper { transform: scale(0.7); transform-origin: center right; margin-left: auto !important; }
            
            .divider { display: none !important; }
            
            .action-buttons-wrapper { gap: 4px !important; margin-left: 4px !important; }
            
            .primary-action-btn {
                padding: 6px !important;
                width: 28px;
                height: 28px;
                border-radius: 50% !important;
            }
            .primary-action-btn span { display: none; }
            .primary-action-btn svg { width: 14px; height: 14px; margin: 0 !important; }
            
            .pinned-shortcuts-container { 
                padding: 4px !important; 
                gap: 6px !important; 
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            .pinned-shortcut-card { 
                width: 32px !important; 
                height: 32px !important; 
                padding: 0 !important; 
                border-radius: 6px !important; 
                justify-content: center !important; 
                border: 1px solid var(--border) !important;
            }
            .pinned-shortcut-card:hover { transform: none !important; background: var(--bg-hover) !important; }
            .pinned-shortcut-card svg { margin: 0 !important; width: 14px; height: 14px; }
            .pinned-shortcut-card span, .pinned-shortcut-card .timestamp { display: none !important; }
        }
'''

content = re.sub(r'/\*\s*Very Small Window Responsive Rules\s*\*\/[\s\S]*?@keyframes errorShake', new_media.strip() + '\n\n        @keyframes errorShake', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up media query.")
