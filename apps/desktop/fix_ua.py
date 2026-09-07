import sys, re

with open("src/index.js", "r", encoding="utf-8") as f:
    code = f.read()

# Set standard Chrome user agent before creating window
if 'app.userAgentFallback =' not in code:
    code = code.replace("app.whenReady().then(() => {", "app.whenReady().then(() => {\n    app.userAgentFallback = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';")

with open("src/index.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Injected userAgentFallback into src/index.js")
