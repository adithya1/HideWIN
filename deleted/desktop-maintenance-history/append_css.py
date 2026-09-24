import sys

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

universal_css = '''
    /* --- STEALTH UI RESPONSIVE OVERRIDES (UNIVERSAL) --- */
    
    /* 50% Reduction in standard buttons */
    .notes-btn {
        padding: 3px 7px !important;
        font-size: 11px !important;
        gap: 4px !important;
    }
    .notes-btn svg { width: 12px !important; height: 12px !important; }
    
    .icon-btn {
        width: 24px !important;
        height: 24px !important;
        border-radius: 6px !important;
    }
    .icon-btn svg { width: 14px !important; height: 14px !important; }
    
    .start-btn {
        padding: 5px 8px !important;
        font-size: 12px !important;
    }
    .start-btn svg { width: 14px !important; height: 14px !important; }
    
    .action-btn {
        width: 20px !important;
        height: 20px !important;
        padding: 2px !important;
    }
    .action-btn svg { width: 12px !important; height: 12px !important; }

    /* Very small icons, no text on buttons */
    .notes-btn, .start-btn, .action-btn {
        font-size: 0 !important; 
    }
    .notes-btn span, .start-btn span, .action-btn span {
        display: none !important;
    }
    .notes-btn {
        padding: 4px !important;
        justify-content: center;
    }
    .notes-btn svg, .start-btn svg, .action-btn svg {
        margin: 0 !important;
    }
    .start-btn {
        padding: 6px !important;
    }

    /* Orderly, highly compact layout for maximum content visibility */
    .notes-container, .profiles-container, .section {
        padding: 8px !important;
        gap: 4px !important;
    }
    .notes-toolbar {
        padding: 4px 8px !important;
        margin-bottom: 8px !important;
    }
    .notes-grid {
        grid-template-columns: 1fr !important;
        gap: 4px !important;
    }
    .note-card {
        padding: 8px !important;
        min-height: 80px !important;
        gap: 4px !important;
    }
    .card-header {
        gap: 4px !important;
    }
    .list-row {
        padding: 4px 8px !important;
        min-height: 32px !important;
        gap: 6px !important;
    }
    .list-row-icon {
        width: 20px !important;
        height: 20px !important;
    }
    .list-row-icon svg { width: 12px !important; height: 12px !important; }
    .page-header {
        margin-bottom: 4px !important;
    }
    .page-title {
        font-size: 14px !important;
    }
    .search-box {
        min-width: 120px !important;
        height: 28px !important;
        padding: 2px 6px !important;
    }
'''

# Find the last '];' or ';' and insert before it
parts = code.rsplit(';', 1)
new_code = parts[0] + universal_css + '\n;'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_code)

