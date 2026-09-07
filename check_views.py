import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

cases = re.findall(r"case '([^']+)'", text)
print("All view cases:", sorted(set(cases)))

# Also find the main render method and see the view it's currently trying to render
# Check the top of the render method
m = re.search(r"render\(\)\s*\{(.*?)renderCurrentView", text, re.DOTALL)
if m:
    top_render = m.group(1)
    print("\n--- Top 500 chars of render() ---")
    print(top_render[:500])
