import re

with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    hist = f.read()

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
            .tab-btn { font-size: 11px !important; padding: 6px 12px !important; }
            .context-row { padding: 8px !important; flex-direction: column; gap: 4px; }
        }
"""
hist = re.sub(r'(\s*)(`\s*\];)', r'\1' + hyper_history_css + r'\2', hist)

with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(hist)
print("History properly fixed!")
