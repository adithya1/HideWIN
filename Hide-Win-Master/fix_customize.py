import re

with open('src/components/views/CustomizeView.js', 'r', encoding='utf-8') as f:
    code = f.read()

mobile_css = """
        @media (max-width: 768px) {
            .sidebar-layout {
                flex-direction: column !important;
                height: 100% !important;
                background: var(--bg-app) !important;
            }
            .sidebar {
                width: 100% !important;
                height: auto !important;
                flex-direction: row !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                border-right: none !important;
                border-bottom: 1px solid var(--border) !important;
                padding: 12px 16px !important;
                background: var(--bg-surface) !important;
                /* Hide scrollbar for cleaner look */
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .sidebar::-webkit-scrollbar {
                display: none;
            }
            .sidebar-group {
                display: flex !important;
                flex-direction: row !important;
                margin-bottom: 0 !important;
                align-items: center !important;
            }
            .sidebar-group-title {
                display: none !important;
            }
            .sidebar-item {
                padding: 8px 16px !important;
                border-radius: 20px !important;
                margin-bottom: 0 !important;
                margin-right: 8px !important;
                white-space: nowrap !important;
                background: transparent !important;
                font-size: 14px !important;
            }
            .sidebar-item.active {
                background: var(--accent) !important;
                color: #fff !important;
            }
            .sidebar-item.active svg {
                color: #fff !important;
            }
            .main-content {
                padding: 16px !important;
                flex: 1 !important;
                overflow-y: auto !important;
                background: var(--bg-app) !important;
            }
            .legacy-settings-wrapper {
                padding: 0 !important;
            }
            .setting-row {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
            }
            .setting-row > div:last-child {
                width: 100% !important;
            }
            .setting-row input, .setting-row select {
                width: 100% !important;
            }
        }
"""

# Inject before the closing backtick in the css block
code = code.replace("        `\n    ];", mobile_css + "\n        `\n    ];")

# Also fix the hardcoded colors in CustomizeView to use theme variables
code = code.replace("background: #F9FAFB;", "background: var(--bg-app);")
code = code.replace("color: #111827;", "color: var(--text-primary);")
code = code.replace("background: #F3F4F6;", "background: var(--bg-surface);")
code = code.replace("border-right: 1px solid #E5E7EB;", "border-right: 1px solid var(--border);")
code = code.replace("color: #4B5563;", "color: var(--text-secondary);")
code = code.replace("color: #6B7280;", "color: var(--text-muted);")
code = code.replace("background: #E5E7EB;", "background: var(--bg-hover);")
code = code.replace("background: #F9FAFB", "background: var(--bg-app)")

with open('src/components/views/CustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied mobile fixes to CustomizeView.js")
