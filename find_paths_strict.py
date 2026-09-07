import os
import re

search_dirs = [
    r"C:\Users\akula\Downloads\Hide-WIN\services\api",
    r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master"
]
pattern = re.compile(r"c:[\\/]users[\\/]akula", re.IGNORECASE)

excludes = [".git", ".venv", "node_modules", "_archive", "__pycache__"]
matches = []

for s_dir in search_dirs:
    for root, dirs, files in os.walk(s_dir):
        dirs[:] = [d for d in dirs if d not in excludes]
        for file in files:
            if file.endswith((".py", ".js", ".json", ".md", ".env", ".ts", ".jsx", ".tsx", ".sh", ".bat")):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        for i, line in enumerate(f):
                            if pattern.search(line):
                                matches.append((filepath, i+1, line.strip()))
                except Exception:
                    pass

for match in matches:
    print(f"{match[0]}:{match[1]}: {match[2][:100]}")

print(f"Total matches found: {len(matches)}")
