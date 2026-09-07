import re

with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    hist = f.read()

# 1. Strip ALL instances of @media (max-width: 768px) that might be lingering
hist = re.sub(r'@media\s*\(\s*max-width:\s*768px\s*\)\s*\{.*?\n        \}(?=\s*\n)', '', hist, flags=re.DOTALL)

# 2. Inject the correct hyper compact CSS into static get styles() { return css` ... ` }
hyper_history_css = """
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; height: 32px !important; }
            .search-box input { width: 100% !important; font-size: 12px !important; }
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .session-card { flex-direction: column; align-items: flex-start; padding: 10px !important; }
            .detail-top { padding: 8px !important; }
            .detail-info { font-size: 14px !important; }
            .session-profile { font-size: 14px !important; }
            .session-date { font-size: 11px !important; }
            .message-body { font-size: 12px !important; padding: 8px 12px !important; }
        }
"""
# We'll inject it just before `;\n    }\n\n    static properties` or wherever `static get styles()` ends
hist = hist.replace("        `;\n    }\n\n    static get properties() {", hyper_history_css + "\n        `;\n    }\n\n    static get properties() {")

with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(hist)

print("History view CSS fixed!")
