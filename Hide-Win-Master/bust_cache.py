import sys, re, time

with open("src/index.html", "r", encoding="utf-8") as f:
    code = f.read()

v = str(int(time.time()))
code = re.sub(r'src="components/app/HideWinApp.js[^"]*"', 'src="components/app/HideWinApp.js?v=' + v + '"', code)

with open("src/index.html", "w", encoding="utf-8") as f:
    f.write(code)

print("Cache busted in index.html")
