import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# First, fix the divider HTML so it has a class we can hide!
content = content.replace(
    '<div style="width: 1px; height: 32px; background: var(--border); margin: 0 20px;"></div>',
    '<div class="action-divider" style="width: 1px; height: 32px; background: var(--border); margin: 0 20px;"></div>'
)

# Also fix any top margins in the wrapper
content = content.replace(
    '<div style="display: flex; flex-direction: column; align-items: center; margin: 16px 0; width: 100%;">',
    '<div style="display: flex; flex-direction: column; align-items: center; margin: 0; padding: 0; width: 100%;">'
)

# We will rewrite the media queries to be pure 2026 sleek horizontal
new_media = '''
        /* Responsive Sleek 2026 UI */
        
        .action-bar-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: var(--bg-surface);
            padding: 8px 16px;
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            border: 1px solid rgba(100, 116, 139, 0.2) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
            gap: 16px;
            transition: all 0.3s ease;
        }

        .action-dropdown-content {
            padding: 6px 12px !important;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .action-dropdown-content:hover {
            background: rgba(100, 116, 139, 0.05);
        }

        .primary-action-btn {
            border-radius: 50% !important;
            padding: 0 !important;
            width: 36px !important;
            height: 36px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .primary-action-btn span { display: none; }
        .primary-action-btn svg { margin: 0 !important; width: 16px; height: 16px; }

        @media (max-width: 650px) {
            :host { padding: 4px !important; }
            .home-container { padding: 4px !important; }
            .home-header { margin-bottom: 8px !important; display: none !important; } /* Hide empty header to save space */
            
            /* Sleek perfectly centered horizontal bar */
            .action-bar-wrapper {
                padding: 4px 8px !important;
                gap: 6px !important;
                border-radius: 8px !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
            
            /* 40% smaller dropdowns */
            .action-dropdown { flex: 0 1 auto !important; max-width: 120px !important; }
            .action-dropdown-content { 
                padding: 4px 8px !important; 
                gap: 4px !important; 
                border: 1px solid rgba(100, 116, 139, 0.2); 
                background: var(--bg-surface);
            }
            .action-dropdown-content span { font-size: 12px !important; }
            .action-dropdown-content svg:not([viewBox="0 0 24 24"]) { display: none !important; } 
            
            .action-divider { display: none !important; }
            
            .mouse-toggle-wrapper { transform: scale(0.7); margin: 0 !important; }
            
            .action-buttons-wrapper { margin: 0 !important; gap: 4px !important; }
            .primary-action-btn { width: 30px !important; height: 30px !important; }
        }

        /* Tiny Pinned Shortcuts */
        @media (max-width: 650px) {
            .pinned-shortcuts-container { 
                padding: 4px !important; 
                gap: 6px !important; 
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
                justify-content: center !important;
                margin-top: 4px !important;
            }
            .pinned-shortcut-card { 
                width: 32px !important; 
                height: 32px !important; 
                padding: 0 !important; 
                border-radius: 6px !important; 
                justify-content: center !important; 
                border: 1px solid rgba(100, 116, 139, 0.2) !important;
            }
            .pinned-shortcut-card:hover { transform: none !important; background: var(--bg-hover) !important; }
            .pinned-shortcut-card svg { margin: 0 !important; width: 14px; height: 14px; }
            .pinned-shortcut-card span, .pinned-shortcut-card .timestamp { display: none !important; }
            .home-subtext { display: none !important; } /* Hide "Pinned Shortcuts" text to save top space */
        }
        
        /* Always keep popup menus readable */
        .child-dropdown { min-width: 180px !important; max-width: 250px !important; border: 1px solid rgba(100, 116, 139, 0.2) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
'''

content = re.sub(r'/\*\s*Medium Window \(Tablet\)\s*\*\/[\s\S]*?/\*\s*Always keep popup menus readable\s*\*/[\s\S]*?\.child-dropdown[^\n]*\n', new_media.strip() + '\n\n', content)

# Remove the inline inline styles of action-bar-wrapper that conflict
content = re.sub(r'<div class="action-bar-wrapper" style="[^"]*">', '<div class="action-bar-wrapper">', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js layout logic!")
