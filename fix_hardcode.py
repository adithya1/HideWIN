import os
import re

src_dir = os.path.join("services", "web", "src")
config_file = os.path.join(src_dir, "config.js")

with open(config_file, "w") as f:
    f.write('export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";\n')

for root, _, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(".jsx"):
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "http://localhost:8000" in content:
                rel_path = os.path.relpath(config_file, root).replace("\\\\", "/")
                if not rel_path.startswith("."):
                    rel_path = "./" + rel_path
                rel_path = rel_path.replace(".js", "")
                
                # Replace exact occurrences
                # Case 1: 'http://localhost:8000/...'
                content = re.sub(r"'http://localhost:8000([^']*)'", r"API_BASE + '\1'", content)
                # Case 2: "http://localhost:8000/..."
                content = re.sub(r'"http://localhost:8000([^"]*)"', r'API_BASE + "\1"', content)
                # Case 3: http://localhost:8000/...
                content = re.sub(r'http://localhost:8000([^]*)', r'${API_BASE}\1', content)
                
                # Add import
                if "import { API_BASE }" not in content:
                    content = f'import {{ API_BASE }} from "{rel_path}";\n' + content
                
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
