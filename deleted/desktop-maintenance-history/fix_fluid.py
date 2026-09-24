import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace all CSS rules between /* Responsive Sleek 2026 UI */ and @keyframes errorShake
# with a true fluid layout system.

fluid_css = '''
        /* True Responsive 2026 Fluid UI */
        
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: clamp(8px, 4vh, 40px) clamp(8px, 4vw, 60px) !important;
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
            margin-bottom: clamp(8px, 2vh, 24px) !important;
        }

        .action-bar-wrapper {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: var(--bg-surface);
            padding: clamp(8px, 1.5vh, 12px) clamp(12px, 3vw, 24px) !important;
            width: 100%;
            max-width: fit-content !important; /* Hug contents tightly, no giant gaps! */
            margin: clamp(4px, 1.5vh, 16px) auto !important; /* Fluid top margin */
            border: 1px solid rgba(100, 116, 139, 0.2) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
            gap: clamp(8px, 2vw, 16px) !important;
            transition: all 0.3s ease;
        }

        .action-dropdown {
            /* 40% smaller target: max 150px, fluid down to 120px */
            flex: 0 1 clamp(120px, 25vw, 160px) !important;
            min-width: 120px !important;
        }

        .action-dropdown-content {
            padding: 6px 12px !important;
            border-radius: 8px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(100, 116, 139, 0.2);
            background: var(--bg-app);
        }
        
        .action-dropdown-content:hover {
            background: rgba(100, 116, 139, 0.05);
        }

        .action-dropdown-content span {
            font-size: clamp(12px, 1.5vw, 14px) !important;
            font-weight: 500;
        }

        .action-divider { display: none !important; }

        .mouse-toggle-wrapper {
            margin: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: scale(0.85); /* Slightly compact */
        }

        .action-buttons-wrapper {
            margin: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .primary-action-btn {
            border-radius: 50% !important; /* Circular like Antigravity */
            padding: 0 !important;
            width: clamp(32px, 4vw, 36px) !important;
            height: clamp(32px, 4vw, 36px) !important;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .primary-action-btn span { display: none !important; }
        .primary-action-btn svg { margin: 0 !important; width: 16px; height: 16px; }

        /* Pinned Shortcuts Container */
        .pinned-shortcuts-container {
            width: 100%;
            max-width: fit-content !important;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: clamp(8px, 2vw, 16px) !important;
            margin: clamp(8px, 2vh, 16px) auto !important;
            padding: clamp(8px, 1.5vw, 16px) !important;
            border: 1px solid rgba(100, 116, 139, 0.2) !important;
            border-radius: 12px !important;
            background: var(--bg-surface) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
        }

        .pinned-shortcut-card {
            width: clamp(36px, 8vw, 60px) !important;
            height: clamp(36px, 8vw, 60px) !important;
            padding: clamp(4px, 1vw, 8px) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(100, 116, 139, 0.2) !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .pinned-shortcut-card:hover {
            transform: translateY(-2px) !important;
            background: rgba(100, 116, 139, 0.05) !important;
        }

        /* Responsive Popups */
        .child-dropdown {
            min-width: 180px !important;
            max-width: 250px !important;
            border: 1px solid rgba(100, 116, 139, 0.2) !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
            border-radius: 8px !important;
            padding: 4px !important;
        }
'''

# Use regex to replace from /* Responsive Sleek 2026 UI */ to @keyframes errorShake
content = re.sub(r'/\*\s*Responsive Sleek 2026 UI\s*\*\/[\s\S]*?@keyframes errorShake', fluid_css.strip() + '\n\n        @keyframes errorShake', content)

# Also remove the inline style of home-container if it exists
content = re.sub(r'\.home-container\s*\{[^}]*\}', '', content, count=1) # The first one is from standard styles

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js with fluid CSS layout.")
