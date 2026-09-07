import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

if ".home-container {" in code and "overflow: hidden" not in code:
    code = code.replace(".home-container {", ".home-container {\n            overflow: hidden !important;")
    with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Locked main window overflow!")
