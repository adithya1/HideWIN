import sys, re

with open("src/index.html", "r", encoding="utf-8") as f:
    code = f.read()

# Remove cache bust query string
code = re.sub(r'src="components/app/HideWinApp\.js\?v=[^"]*"', 'src="components/app/HideWinApp.js"', code)

with open("src/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Reverted cache buster in index.html")
