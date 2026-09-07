import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace fonts and colors to match the image precisely
css_replacements = {
    r"font-family:\s*'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;": r"font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;",
    r"\.pane-left \{\s*width: 32%;\s*min-width: 250px;\s*max-width: 400px;\s*background: var\(--bg-surface\);\s*border-right: 1px solid var\(--bg-elevated\);": r".pane-left {\n            width: 32%;\n            min-width: 280px;\n            max-width: 400px;\n            background: #202124;\n            border-right: 1px solid #3c4043;",
    r"\.pane-right \{\s*flex: 1;\s*background: var\(--bg-app\);": r".pane-right {\n            flex: 1;\n            background: #202124;",
    r"\.pane-header \{\s*padding: 14px 16px;\s*font-size: 13px;\s*font-weight: 600;\s*color: var\(--text-secondary\);\s*border-bottom: 1px solid var\(--bg-elevated\);\s*display: flex;\s*align-items: center;\s*gap: 8px;\s*background: var\(--bg-surface\);\s*\}": r".pane-header {\n            padding: 16px 20px;\n            font-size: 14px;\n            font-weight: 700;\n            color: #e8eaed;\n            border-bottom: 1px solid #3c4043;\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            background: #202124;\n        }",
    r"\.history-list \{\s*flex: 1;\s*overflow-y: auto;\s*padding: 16px 12px;\s*display: flex;\s*flex-direction: column;\s*gap: 20px;\s*\}": r".history-list {\n            flex: 1;\n            overflow-y: auto;\n            padding: 24px 20px;\n            display: flex;\n            flex-direction: column;\n            gap: 32px;\n        }",
    r"\.history-time \{\s*font-size: 11px;\s*color: var\(--text-secondary\);\s*font-weight: 600;\s*\}": r".history-time {\n            font-size: 12px;\n            color: #9aa0a6;\n            font-weight: 700;\n        }",
    r"\.history-question \{\s*font-size: 14px;\s*font-weight: 600;\s*color: var\(--text-primary\);\s*line-height: 1\.4;\s*\}": r".history-question {\n            font-size: 15.5px;\n            font-weight: 800;\n            color: #ffffff;\n            line-height: 1.4;\n        }",
    r"\.response-area \{\s*flex: 1;\s*overflow-y: auto;\s*padding: 24px;": r".response-area {\n            flex: 1;\n            overflow-y: auto;\n            padding: 32px 40px;",
    r"\.response-title \{\s*font-size: 18px;\s*font-weight: 700;\s*color: var\(--text-primary\);\s*margin-bottom: 20px;\s*\}": r".response-title {\n            font-size: 20px;\n            font-weight: 800;\n            color: #ffffff;\n            margin-bottom: 24px;\n        }",
    r"\.response-content \{\s*font-size: 15px;\s*color: var\(--text-primary\);\s*line-height: 1\.6;\s*\}": r".response-content {\n            font-size: 16.5px;\n            color: #e8eaed;\n            font-weight: 600;\n            line-height: 1.6;\n        }",
    r"\.left-footer \{\s*padding: 12px 16px;\s*border-top: 1px solid var\(--bg-elevated\);": r".left-footer {\n            padding: 16px 20px;\n            border-top: 1px solid #3c4043;",
    r"\.response-types \{\s*font-size: 10px;\s*font-weight: 700;\s*color: var\(--text-secondary\);\s*letter-spacing: 0\.5px;\s*\}": r".response-types {\n            font-size: 11px;\n            font-weight: 800;\n            color: #9aa0a6;\n            letter-spacing: 1px;\n            text-transform: uppercase;\n        }",
    r"\.type-badge \{\s*display: inline-flex;\s*align-items: center;\s*justify-content: space-between;\s*background: var\(--bg-elevated\);\s*padding: 6px 12px;\s*border-radius: 16px;\s*font-size: 12px;\s*color: var\(--text-secondary\);\s*font-weight: 600;\s*margin-top: 6px;\s*\}": r".type-badge {\n            display: inline-flex;\n            align-items: center;\n            justify-content: space-between;\n            background: #303134;\n            padding: 8px 16px;\n            border-radius: 20px;\n            font-size: 13px;\n            color: #e8eaed;\n            font-weight: 700;\n            margin-top: 8px;\n        }",
    r"\.response-content pre \{\s*background: var\(--bg-surface\);\s*border: 1px solid var\(--bg-elevated\);\s*border-radius: 8px;\s*padding: 16px;\s*overflow-x: auto;\s*margin: 16px 0;\s*\}": r".response-content pre {\n            background: #1e1e1e;\n            border: 1px solid #3c4043;\n            border-radius: 8px;\n            padding: 16px;\n            overflow-x: auto;\n            margin: 24px 0;\n        }"
}

for pattern, repl in css_replacements.items():
    content = re.sub(pattern, repl, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("AssistantView styles updated.")
