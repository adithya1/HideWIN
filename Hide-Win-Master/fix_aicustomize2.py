import re

with open('src/components/views/AICustomizeView.js', 'r', encoding='utf-8') as f:
    code = f.read()

mobile_css = """
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .search-box {
                width: 100% !important;
                max-width: 100% !important;
                order: 2;
            }
            .toolbar-actions {
                width: 100% !important;
                justify-content: flex-end;
                order: 1;
            }
            .notes-btn {
                width: 100% !important;
                justify-content: center !important;
            }
            .grid-viewport {
                padding: 16px !important;
            }
            .notes-grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
            }
            .note-card {
                height: auto !important;
                min-height: 120px !important;
            }
            .list-row {
                padding: 16px !important;
                gap: 12px !important;
                flex-wrap: wrap;
            }
            .list-row-title { font-size: 16px !important; }
            .list-row-preview { font-size: 13px !important; display: block; width: 100%; margin-top: 4px; }
            
            /* Profile Modal Fixes */
            .modal-content {
                width: 100% !important;
                height: 100% !important;
                max-width: 100% !important;
                border-radius: 0 !important;
                border: none !important;
            }
            .form-grid {
                grid-template-columns: 1fr !important;
            }
        }
"""

# Find the end of the css block by looking for the last backtick before a semi-colon or just replacing the last backtick.
code = code.replace("        `\n    ];", mobile_css + "\n        `\n    ];")

with open('src/components/views/AICustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied mobile fixes to AICustomizeView.js")
