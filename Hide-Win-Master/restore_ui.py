import re

# 1. Restore MainView.js from backup, but modify inline styles to classes for responsiveness
with open('src/components/views/MainView_backup.js', 'r', encoding='utf-8') as f:
    main_view = f.read()

# Refactor the action bar inline styles to a class
main_view = main_view.replace(
    '<div style="display: flex; align-items: center; border: 1px solid ; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ; border-radius: 50px; background: var(--bg-surface); padding: 8px 12px 8px 24px; width: 100%; max-width: 850px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);">',
    '<div class="action-bar-pill" style="border: 1px solid ; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ;">'
)

# Add CSS for action-bar-pill
css_to_add = '''
        .action-bar-pill {
            display: flex;
            align-items: center;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 850px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .action-bar-divider {
            width: 1px; height: 32px; background: var(--border); margin: 0 12px;
        }

        .action-bar-btn {
            height: 44px; padding: 0 32px; border-radius: 22px; font-size: 15px;
        }

        @media (max-width: 768px) {
            .action-bar-pill {
                flex-direction: column;
                border-radius: 16px;
                padding: 16px;
                gap: 16px;
                max-width: 100%;
            }
            .action-bar-pill > div {
                width: 100% !important;
                max-width: 100% !important;
            }
            .action-bar-divider {
                width: 100%;
                height: 1px;
                margin: 8px 0;
            }
            .action-bar-btn {
                width: 100%;
            }
            .mouse-toggle-container {
                flex-direction: row !important;
                justify-content: space-between !important;
                width: 100% !important;
                max-width: 100% !important;
            }
        }
'''

main_view = main_view.replace('</style>', css_to_add + '\\n    </style>')

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main_view)

print("Restored MainView.js successfully!")
