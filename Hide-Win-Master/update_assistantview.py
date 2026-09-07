import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AssistantView.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r'<div class="history-question">\$\{qText\}</div>'
replacement = r"""<div class="history-question">${qText}</div>
                                ${isObj && item.userExplanation ? html`
                                    <div class="history-explanation" style="margin-top: 10px; font-size: 13.5px; color: #9aa0a6; line-height: 1.45; padding-left: 10px; border-left: 2px solid #5f6368;">
                                        ${item.userExplanation}
                                    </div>
                                ` : ''}"""
content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("AssistantView.js updated to render user explanations")
