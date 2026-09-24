import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the grid-based architecture with a Flex-based architecture per user's explicit request
new_architecture = '''
        /* --------------------------------------------------------- */
        /* TOOLBAR (FLEX-BASED RESPONSIVE) */
        /* --------------------------------------------------------- */
        .action-bar-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
            gap: clamp(12px, 2vw, 24px);
            width: 100%;
            max-width: 1200px;
            margin: 0 auto clamp(16px, 3vh, 24px) auto;
            padding: 10px 24px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        }

        /* Dropdowns */
        .action-dropdown {
            flex: 0 1 auto;
            min-width: 160px;
            max-width: 220px;
            position: relative;
        }

        .action-dropdown-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px 12px;
            height: 38px;
            background: transparent;
            border-radius: 6px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .action-dropdown-content:hover, .action-dropdown-content:focus-within {
            background: rgba(100, 116, 139, 0.05);
            border: 1px solid var(--text-muted);
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

        /* Mouse Detect */
        .mouse-toggle-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding-left: clamp(12px, 2vw, 24px);
            border-left: 1px solid var(--border); /* Clean separation */
            flex-shrink: 0;
        }

        /* Start Button */
        .action-buttons-wrapper {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 0;
            flex-shrink: 0;
        }

        .primary-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0 20px;
            height: 38px;
            border-radius: 8px;
            border: none;
            background: var(--accent);
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease, transform 0.1s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            white-space: nowrap;
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
            justify-content: center;
            gap: 16px;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            background: transparent;
            border: none;
            box-shadow: none;
        }

        .pinned-shortcut-card {
            width: 100px;
            height: 90px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: var(--bg-surface);
            transition: all 0.2s ease;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        
        .pinned-shortcut-card:hover {
            transform: translateY(-2px);
            background: rgba(100, 116, 139, 0.05);
            border-color: var(--text-muted);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* --------------------------------------------------------- */
        /* RESPONSIVE BREAKPOINTS (Fluid Architecture)               */
        /* --------------------------------------------------------- */
        
        /* COMPACT (2-Row Reflow) */
        @media (max-width: 750px) {
            .action-bar-wrapper {
                flex-wrap: wrap;
                padding: 12px 16px;
                max-width: 500px;
            }
            .action-dropdown {
                flex: 1 1 40%;
                min-width: 140px;
            }
            .mouse-toggle-wrapper {
                flex: 1 1 40%;
                border-left: none;
                padding-left: 0;
                justify-content: flex-start;
            }
            .action-buttons-wrapper {
                flex: 1 1 40%;
                justify-content: flex-end;
            }
        }

        /* SMALL (Vertical Stack) */
        @media (max-width: 500px) {
            .action-bar-wrapper {
                flex-direction: column;
                align-items: stretch;
            }
            .action-dropdown {
                flex: 1 1 100%;
                max-width: 100%;
            }
            .mouse-toggle-wrapper {
                justify-content: space-between;
                margin-top: 8px;
            }
            .action-buttons-wrapper {
                justify-content: stretch;
                margin-top: 8px;
            }
            .primary-action-btn { width: 100%; }
        }
'''

content = re.sub(
    r'/\*\s*-+\s*\*/\s*/\*\s*TOOLBAR \(GRID-BASED RESPONSIVE\).*?@media \(max-width: 500px\) \{.*?\n        \}',
    new_architecture.strip(),
    content,
    flags=re.DOTALL
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated to flex-based architecture.")
