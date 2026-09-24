import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to completely replace the media queries to fix the height bug and implement proper scaling.

new_media = '''
        /* Medium Window (Tablet) */
        @media (max-width: 750px) {
            :host { padding: 12px 16px !important; }
            .home-container { padding: 12px !important; }
            
            /* Keep the pill box but make it smaller */
            .action-bar-wrapper {
                padding: 6px 12px !important;
                gap: 8px !important;
                margin: 12px 0 !important;
            }
            .action-dropdown { flex: 1 1 auto !important; max-width: 180px !important; }
            .action-dropdown-content { padding: 4px 8px !important; gap: 6px !important; }
            
            /* Make buttons a bit smaller but keep text */
            .primary-action-btn {
                padding: 8px 16px !important;
                font-size: 13px !important;
            }
        }

        /* Small Window (Mobile/Compact) */
        @media (max-width: 550px) {
            :host { padding: 8px !important; }
            .home-container { padding: 8px !important; }
            
            /* Remove pill box, go side-by-side minimalist */
            .action-bar-wrapper {
                flex-wrap: nowrap !important;
                justify-content: center !important;
                padding: 0 !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            
            .action-dropdown { max-width: 140px !important; }
            .action-dropdown-content { border-radius: 6px; border: 1px solid var(--border); background: var(--bg-surface); }
            .action-dropdown-content svg:not([viewBox="0 0 24 24"]) { display: none !important; } 
            
            .mouse-toggle-wrapper { transform: scale(0.75); margin-left: auto !important; }
            .divider { display: none !important; }
            
            .primary-action-btn {
                padding: 6px !important;
                width: 32px;
                height: 32px;
                border-radius: 50% !important;
            }
            .primary-action-btn span { display: none; }
            .primary-action-btn svg { margin: 0 !important; }
        }

        /* Ultra Narrow Windows (Vertical Stack) */
        @media (max-width: 400px) {
            .action-bar-wrapper {
                display: grid !important;
                grid-template-columns: 1fr 1fr;
                gap: 8px !important;
                width: 100% !important;
            }
            .action-bar-wrapper > .action-dropdown:nth-child(1) { grid-column: 1 / -1; max-width: 100% !important; }
            .action-bar-wrapper > .action-dropdown:nth-child(3) { grid-column: 1 / -1; max-width: 100% !important; }
            .mouse-toggle-wrapper { grid-column: 1 / 2; margin: 0 auto !important; justify-content: center; }
            .action-buttons-wrapper { grid-column: 2 / 3; margin: 0 auto !important; justify-content: center; }
            .child-dropdown { width: 100% !important; left: 0 !important; }
        }

        /* Always keep popup menus readable */
        .child-dropdown { min-width: 200px !important; max-width: 300px !important; }
'''

# Find the start of the media queries and replace everything up to @keyframes errorShake
content = re.sub(r'/\*\s*Very Small Window Responsive Rules\s*\*\/[\s\S]*?@keyframes errorShake', new_media.strip() + '\n\n        @keyframes errorShake', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js layout logic!")
