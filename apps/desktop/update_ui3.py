import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Make the font family extremely explicitly Arial/Helvetica for the exact plain sans-serif look in the images.
# Also change the live-caption styling to look like a user-transcription block.

css_replacements = {
    r"font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;": r"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;",
    r"\.history-time \{\s*font-size: 12px;\s*color: #9aa0a6;\s*font-weight: 700;\s*\}": r".history-time {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n            font-size: 12px;\n            color: #9aa0a6;\n            font-weight: 700;\n            margin-bottom: 2px;\n        }",
    r"\.history-question \{\s*font-size: 15\.5px;\s*font-weight: 800;\s*color: #ffffff;\s*line-height: 1\.4;\s*\}": r".history-question {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n            font-size: 15.5px;\n            font-weight: 800;\n            color: #ffffff;\n            line-height: 1.4;\n        }",
    r"\.response-title \{\s*font-size: 20px;\s*font-weight: 800;\s*color: #ffffff;\s*margin-bottom: 24px;\s*\}": r".response-title {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n            font-size: 20px;\n            font-weight: 800;\n            color: #ffffff;\n            margin-bottom: 24px;\n        }",
    r"\.response-content \{\s*font-size: 16\.5px;\s*color: #e8eaed;\s*font-weight: 600;\s*line-height: 1\.6;\s*\}": r".response-content {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n            font-size: 16.5px;\n            color: #e8eaed;\n            font-weight: 600;\n            line-height: 1.6;\n        }",
    r"\.live-caption \{\s*font-size: 13\.5px;\s*color: var\(--text-secondary\);\s*font-style: italic;\s*padding: 8px 12px;\s*margin-top: 12px;\s*background: rgba\(0,0,0,0\.1\);\s*border-radius: 6px;\s*border: 1px dashed var\(--bg-hover\);\s*\}": r".live-caption {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;\n            font-size: 14.5px;\n            color: #d1d5db;\n            font-style: normal;\n            padding: 12px 16px;\n            margin-top: 16px;\n            background: #2a2b2f;\n            border-radius: 8px;\n            border-left: 3px solid #6366f1;\n            line-height: 1.5;\n        }",
    r"\.live-caption-title \{\s*font-size: 11px;\s*color: var\(--danger\);\s*\}": r".live-caption-title {\n            font-size: 11px;\n            color: #9aa0a6;\n            font-weight: 700;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n            margin-bottom: 4px;\n        }"
}

for pattern, repl in css_replacements.items():
    content = re.sub(pattern, repl, content)

# Modify the live-caption HTML block to label it appropriately as "TRANSCRIPTION:" 
html_pattern = r"<div class=\"live-caption-title\">Live Transcript\.\.\.</div>"
html_repl = r"<div class=\"live-caption-title\">🗣️ Transcription</div>"
content = content.replace(html_pattern, html_repl)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("AssistantView exact font and live-caption logic updated.")
