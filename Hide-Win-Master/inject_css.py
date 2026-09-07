import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to insert the CSS inside the css`...` block.
css_to_insert = """
            .editor-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 8px 12px;
                background: #1e1e1e;
                border-bottom: 1px solid #3e3e42;
                align-items: center;
            }
            .toolbar-group {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .toolbar-btn {
                background: transparent;
                border: 1px solid transparent;
                color: #d4d4d4;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
            }
            .toolbar-btn:hover {
                background: #2d2d2d;
                border-color: #3e3e42;
            }
            .toolbar-btn.active {
                background: #007acc;
                color: white;
            }
            .toolbar-select {
                background: #2d2d2d;
                color: #d4d4d4;
                border: 1px solid #3e3e42;
                padding: 4px;
                border-radius: 4px;
            }
            .full-note-view {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: #1e1e1e;
            }
            .full-note-header {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                background: #2d2d2d;
                border-bottom: 1px solid #3e3e42;
            }
            .full-note-title-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #ffffff;
                font-size: 16px;
                font-weight: 600;
                margin: 0 12px;
                outline: none;
            }
            .full-note-body-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .full-note-editor {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                outline: none;
                background: #1e1e1e;
                color: #d4d4d4;
                font-family: inherit;
                line-height: 1.5;
            }
            .notes-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                padding: 16px;
                overflow-y: auto;
                flex: 1;
            }
            .note-card {
                background: #2d2d2d;
                border: 1px solid #3e3e42;
                border-radius: 6px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                transition: transform 0.1s, border-color 0.1s;
                position: relative;
                min-height: 120px;
            }
            .note-card:hover {
                transform: translateY(-2px);
                border-color: #555;
            }
            .note-card.pinned {
                border-color: #007acc;
            }
            .note-title {
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
                color: #fff;
            }
            .note-preview {
                font-size: 12px;
                color: #969696;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                flex: 1;
            }
            .note-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 12px;
                font-size: 11px;
                color: #666;
            }
            .note-actions {
                display: flex;
                gap: 4px;
            }
            .action-btn {
                background: transparent;
                border: none;
                color: #969696;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .action-btn:hover {
                background: #3e3e42;
                color: #fff;
            }
            .action-btn.delete:hover {
                background: #ef4444;
                color: #fff;
            }
            .action-btn.pinned {
                color: #007acc;
            }
            .file-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: #3e3e42;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                color: #fff;
            }
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                flex: 1;
                color: #666;
                text-align: center;
                padding: 32px;
            }
            .notes-toolbar {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                background: #2d2d2d;
                border-bottom: 1px solid #3e3e42;
                gap: 8px;
            }
            .toolbar-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .notes-btn {
                background: #3e3e42;
                border: 1px solid transparent;
                color: #fff;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
            }
            .notes-btn:hover {
                background: #4a4a4f;
            }
            .notes-btn.primary {
                background: #007acc;
            }
            .notes-btn.primary:hover {
                background: #0098ff;
            }
            .search-box {
                flex: 1;
                display: flex;
                align-items: center;
                background: #1e1e1e;
                border: 1px solid #3e3e42;
                border-radius: 4px;
                padding: 0 8px;
                max-width: 400px;
            }
            .search-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #fff;
                padding: 6px;
                outline: none;
                font-size: 13px;
            }
            .search-box svg {
                width: 14px;
                height: 14px;
                color: #969696;
            }
            .icon-btn {
                background: transparent;
                border: none;
                color: #969696;
                cursor: pointer;
                padding: 6px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .icon-btn:hover {
                background: #3e3e42;
                color: #fff;
            }
            .icon-btn.active {
                background: #3e3e42;
                color: #007acc;
            }
"""

text = text.replace('position: relative;\n            }\n        `', 'position: relative;\n            }\n' + css_to_insert + '\n        `')

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Injected missing CSS!')
