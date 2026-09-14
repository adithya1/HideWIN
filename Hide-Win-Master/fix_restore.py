import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Restore the original large-window layout, but add a strict @media query for the small window requirements.

css = '''
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Or center if you prefer, but original was flex-start */
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 850px;
            margin-bottom: 24px;
        }

        .action-bar-wrapper {
            display: flex;
            align-items: center;
            border-radius: 8px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 850px;
            margin: 16px 0;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .action-dropdown-content {
            padding: 6px 12px;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            background: transparent; /* No borders on big window, just sleek text */
        }
        
        .action-dropdown-content:hover {
            background: rgba(100, 116, 139, 0.05);
        }

        .action-dropdown-content span {
            font-size: 15px;
            font-weight: 500;
        }

        .action-divider { width: 1px; height: 32px; background: var(--border); margin: 0 20px; }

        .mouse-toggle-wrapper {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .action-buttons-wrapper {
            margin-left: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .primary-action-btn {
            border-radius: 8px;
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-weight: 600;
            font-size: 14px;
        }
        .primary-action-btn span { display: block; }
        .primary-action-btn svg { width: 16px; height: 16px; }

        /* Pinned Shortcuts Container */
        .pinned-shortcuts-container {
            width: 100%;
            max-width: 850px;
            display: flex;
            gap: 16px;
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--bg-surface);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-top: 8px;
            overflow-x: auto;
        }

        .pinned-shortcut-card {
            flex-shrink: 0;
            width: 100px;
            height: 100px;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .pinned-shortcut-card:hover { transform: translateY(-4px); background: rgba(100, 116, 139, 0.05); }

        .child-dropdown {
            min-width: 200px;
            max-width: 280px;
        }

        /* ---------------------------------------------------- */
        /* SMALL WINDOW ONLY - 40% SMALLER DROPDOWNS & COMPACT */
        /* ---------------------------------------------------- */
        @media (max-width: 650px) {
            .home-container {
                padding: 12px 16px !important;
                align-items: center !important; /* Center the layout horizontally when small */
            }
            .home-header { display: none !important; }
            
            .action-bar-wrapper {
                padding: 6px 12px !important;
                max-width: fit-content !important; /* Hug perfectly to center it */
                margin: 4px auto !important; /* Very little top space */
                gap: 8px !important;
                justify-content: center !important;
            }
            
            /* 40% Smaller Dropdowns on Small Window */
            .action-dropdown {
                flex: 0 1 auto !important;
                max-width: 130px !important; /* Reduced from 220px inline style */
                min-width: 110px !important;
            }
            
            .action-dropdown-content {
                padding: 4px 8px !important;
                border: 1px solid rgba(100, 116, 139, 0.2) !important; /* Eye-catching border for small window */
                border-radius: 6px !important;
            }
            
            .action-dropdown-content span { font-size: 13px !important; }
            .action-dropdown-content svg:not([viewBox="0 0 24 24"]) { display: none !important; }
            
            .action-divider { display: none !important; }
            
            .mouse-toggle-wrapper {
                transform: scale(0.75);
                margin-left: 0 !important;
                margin-right: 4px !important;
            }
            
            .action-buttons-wrapper { margin-left: 0 !important; gap: 4px !important; }
            
            .primary-action-btn {
                border-radius: 50% !important; /* Make it a circular icon button */
                padding: 0 !important;
                width: 32px !important;
                height: 32px !important;
            }
            .primary-action-btn span { display: none !important; }
            .primary-action-btn svg { margin: 0 !important; }

            .pinned-shortcuts-container {
                padding: 8px !important;
                gap: 8px !important;
                max-width: fit-content !important;
                margin: 8px auto !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            
            .pinned-shortcut-card {
                width: 40px !important;
                height: 40px !important;
                padding: 0 !important;
            }
            .pinned-shortcut-card svg { margin: 0 !important; }
            .pinned-shortcut-card span, .pinned-shortcut-card .timestamp { display: none !important; }
            
            .home-subtext { display: none !important; } /* Hide Pinned Shortcuts text */
        }
'''

content = re.sub(r'/\*\s*True Responsive 2026 Fluid UI\s*\*\/[\s\S]*?@keyframes errorShake', css.strip() + '\n\n        @keyframes errorShake', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored original big window layout, kept compact styling for small window.")
