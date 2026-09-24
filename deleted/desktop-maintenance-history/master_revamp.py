import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean HTML inline styles that interfere with Grid
content = re.sub(
    r'<div class="action-dropdown"[^>]*?style="[^"]*"',
    '<div class="action-dropdown"',
    content
)

# Also ensure action-bar-wrapper has no inline styles
content = re.sub(
    r'<div class="action-bar-wrapper"[^>]*?style="[^"]*"',
    '<div class="action-bar-wrapper"',
    content
)

# 2. Re-architect the core CSS blocks
# I will find the block starting with .home-container { (the first one) 
# and replace everything up to the /* SMALL WINDOW ONLY or @keyframes with the master architecture.

master_css = '''
        /* ========================================================= */
        /* MASTER RESPONSIVE ARCHITECTURE (2026 DESKTOP UI)          */
        /* ========================================================= */
        
        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center; /* Center the layout container */
            padding: clamp(16px, 4vh, 40px) clamp(16px, 4vw, 60px);
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* --------------------------------------------------------- */
        /* HEADER & NAVIGATION */
        /* --------------------------------------------------------- */
        .home-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 1200px; /* Safe readable width */
            margin-bottom: clamp(16px, 3vh, 32px);
        }

        /* --------------------------------------------------------- */
        /* TOOLBAR (GRID-BASED RESPONSIVE) */
        /* --------------------------------------------------------- */
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

        /* Dropdowns */
        .action-dropdown {
            width: 100%;
            position: relative;
        }

        .action-dropdown-content {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: transparent;
            border-radius: 6px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .action-dropdown-content:hover, .action-dropdown-content:focus-within {
            background: rgba(100, 116, 139, 0.05);
            border: 1px solid var(--border);
        }

        .action-dropdown-content span {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Divider */
        .action-divider {
            display: none; /* Hide the weird vertical divider in grid layouts */
        }

        /* Mouse Detect */
        .mouse-toggle-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0 12px;
            border-left: 1px solid var(--border); /* Clean separation */
        }

        /* Start Button */
        .action-buttons-wrapper {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 0;
        }

        .primary-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 20px;
            height: 36px;
            border-radius: 6px;
            border: none;
            background: var(--accent);
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease, transform 0.1s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        
        .primary-action-btn:hover { background: #2563eb; }
        .primary-action-btn:active { transform: scale(0.98); }
        .primary-action-btn svg { width: 16px; height: 16px; }

        /* Popups */
        .child-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 100%;
            min-width: 200px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            z-index: 100;
            max-height: 280px;
            overflow-y: auto;
            padding: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        /* --------------------------------------------------------- */
        /* PINNED SHORTCUTS */
        /* --------------------------------------------------------- */
        .pinned-shortcuts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.02);
        }

        .pinned-shortcut-card {
            width: 120px;
            height: 90px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: transparent;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .pinned-shortcut-card:hover {
            transform: translateY(-2px);
            background: rgba(100, 116, 139, 0.05);
            border-color: var(--text-muted);
        }

        /* --------------------------------------------------------- */
        /* RESPONSIVE BREAKPOINTS (Fluid Architecture)               */
        /* --------------------------------------------------------- */
        
        /* MEDIUM (Compressed Horizontal) */
        @media (max-width: 1100px) {
            .action-bar-wrapper {
                grid-template-columns: minmax(140px, 1fr) minmax(140px, 1fr) auto auto;
                gap: 12px;
                padding: 10px 16px;
                max-width: 850px;
            }
            .action-dropdown-content { padding: 6px 8px; }
            .action-dropdown-content span { font-size: 13px; }
            .mouse-toggle-wrapper { padding: 0 8px; }
            .primary-action-btn { padding: 6px 16px; font-size: 12px; }
        }

        /* COMPACT (2-Row Reflow) */
        @media (max-width: 750px) {
            .action-bar-wrapper {
                grid-template-columns: 1fr 1fr; /* Row 1: Dropdowns, Row 2: Controls */
                grid-template-rows: auto auto;
                max-width: 500px;
            }
            
            .action-dropdown:nth-child(1) { grid-column: 1 / 2; grid-row: 1; }
            .action-dropdown:nth-child(3) { grid-column: 2 / 3; grid-row: 1; }
            .mouse-toggle-wrapper { 
                grid-column: 1 / 2; grid-row: 2; 
                border-left: none; 
                justify-content: flex-start;
                padding: 0;
            }
            .action-buttons-wrapper { 
                grid-column: 2 / 3; grid-row: 2; 
                justify-content: flex-end;
            }
        }

        /* SMALL (Vertical Stack) */
        @media (max-width: 500px) {
            .home-container { padding: 16px; }
            .home-header { display: none; } /* Save space */
            
            .action-bar-wrapper {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto auto auto;
                gap: 8px;
                padding: 12px;
                max-width: 100%;
            }
            
            .action-dropdown:nth-child(1) { grid-column: 1; grid-row: 1; }
            .action-dropdown:nth-child(3) { grid-column: 1; grid-row: 2; }
            
            .mouse-toggle-wrapper { 
                grid-column: 1; grid-row: 3; 
                justify-content: space-between;
                width: 100%;
            }
            
            .action-buttons-wrapper { 
                grid-column: 1; grid-row: 4; 
                width: 100%;
            }
            
            .primary-action-btn { width: 100%; }
        }
'''

# We want to replace all scattered old rules with our master architecture.
# We will match from the first .home-container { up to @keyframes errorShake
content = re.sub(
    r'\.home-container\s*\{[\s\S]*?@keyframes errorShake',
    master_css.strip() + '\n\n        @keyframes errorShake',
    content,
    flags=re.MULTILINE
)

# Also wipe out the duplicate .home-container if it still somehow exists at the bottom
content = re.sub(r'/\*.*NEW HOME LAYOUT.*\*/[\s\S]*?\.home-header\s*\{', '.home-header {', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Master revamp applied.")
