import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

parts = text.split("{/* BRANDING & LOGOS */}")
print("End of part 1:", repr(parts[1][-200:]))
print("Start of part 2:", repr(parts[2][:200]))
