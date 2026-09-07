import re

with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    history = f.read()

history_mobile_css = """
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; }
            .search-box input { width: 100% !important; }
            .grid-viewport { padding: 16px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            .session-card { flex-direction: column; align-items: flex-start; }
            .detail-top { padding: 16px !important; }
            .detail-info { font-size: 18px !important; }
        }
"""

history = re.sub(r'(`;\s*)(?=\}\s*render\(\))', history_mobile_css + r'\1', history, count=1)

with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(history)
print("History fixed!")
