import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

parts = text.split("{/* EMAIL TEMPLATES */}")
print("Number of EMAIL TEMPLATES blocks:", len(parts))
print("Start of part 2 (new Email Templates):", repr(parts[1][:100]))
print("Start of part 3 (old Email Templates):", repr(parts[2][:100]))
print("Look for closing tags after part 3 Email Templates:")
# Find where the modal starts
modal_split = parts[2].split("{/* Global Modal Overlay */}")
print("Length of modal split:", len(modal_split))
if len(modal_split) > 1:
    print("End of part 3 before modal:", repr(modal_split[0][-200:]))
