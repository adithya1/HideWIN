import os
import shutil

source_ui = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\invite_client\index.html"
with open(source_ui, 'r', encoding='utf-8') as f:
    new_html = f.read()

target_dir = r"C:\Users\akula\Downloads"

found = 0
for root, dirs, files in os.walk(target_dir):
    if "invite_client" in root.lower() or "invite" in root.lower():
        for file in files:
            if file.lower() == "index.html" or file.lower() == "join.html":
                filepath = os.path.join(root, file)
                # Ignore the one we are copying from
                if filepath == source_ui:
                    continue
                try:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_html)
                    print(f"OVERWRITTEN: {filepath}")
                    found += 1
                except Exception as e:
                    print(f"FAILED to overwrite {filepath}: {e}")

print(f"Total files overwritten: {found}")
