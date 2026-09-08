import re

filepath = r"Hide-Win-Master\src\utils\renderer.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("window.ort.env.wasm.wasmPaths = rootDir + 'assets/';", "window.ort.env.wasm.wasmPaths = nativeDir + 'assets/';")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
