import re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

code = re.sub(r'/\* GLOBAL POSH LEAN SCROLLBAR \*/.*?::-webkit-scrollbar \{.*?\}', '/* GLOBAL POSH LEAN SCROLLBAR */\n        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; background-color: transparent !important; }', code, flags=re.DOTALL)

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)
