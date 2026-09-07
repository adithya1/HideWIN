path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

css_inject = """
    /* Editor Images */
    .full-note-editor img, .editor-content img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin: 8px 0;
        display: block;
    }
"""

# add it near the end before the last closing backtick
idx = content.rfind("`;")
if idx > -1:
    content = content[:idx] + css_inject + content[idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
