import os
p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("|| '8001'", "|| '8000'")
text = text.replace("placeholder=\"8001\"", "placeholder=\"8000\"")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated React Admin to 8000")
