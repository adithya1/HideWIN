import os

target_dir = r"C:\Users\akula\Downloads"
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.lower() == "index.html" or file.lower() == "join.html":
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if "Security Token" in content or "Security" in content:
                        print(f"FOUND OLD UI: {filepath}")
            except:
                pass
print("Done searching.")
