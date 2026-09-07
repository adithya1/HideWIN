import re

with open('src/components/views/CustomizeView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Change activeTab to a public property
code = code.replace(
    "activeTab: { type: String, state: true }",
    "activeTab: { type: String }"
)

# Hide sidebar on mobile instead of making it horizontal
old_sidebar_css = """        @media (max-width: 768px) {
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
            }"""

new_sidebar_css = """        @media (max-width: 768px) {
            .sidebar-layout {
                flex-direction: column !important;
                height: 100% !important;
                background: var(--bg-app) !important;
            }
            .sidebar {
                display: none !important; /* Moved to main drawer */
            }"""

code = code.replace(old_sidebar_css, new_sidebar_css)

with open('src/components/views/CustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("CustomizeView patched.")
