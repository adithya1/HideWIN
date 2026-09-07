import re
paths = [
    r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js',
    r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
]

custom_scrollbar = """    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
        border-left: 1px solid rgba(0,0,0,0.05);
    }
    ::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 10px;
        border: 3px solid #f3f3f3;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: #a8a8a8;
    }
    ::-webkit-scrollbar-button:single-button {
        background-color: transparent;
        display: block;
        height: 14px;
        width: 14px;
    }
    ::-webkit-scrollbar-button:single-button:vertical:decrement {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 14l5-5 5 5z'/></svg>");
        background-size: 12px;
        background-position: center;
        background-repeat: no-repeat;
    }
    ::-webkit-scrollbar-button:single-button:vertical:increment {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 10l5 5 5-5z'/></svg>");
        background-size: 12px;
        background-position: center;
        background-repeat: no-repeat;
    }"""

for path in paths:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We will use regex to find the scrollbar definition and replace it
    pattern = r'::-webkit-scrollbar \{.*?::-webkit-scrollbar-thumb:hover \{.*?\}'
    
    if re.search(pattern, content, flags=re.DOTALL):
        content = re.sub(pattern, custom_scrollbar.strip(), content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
