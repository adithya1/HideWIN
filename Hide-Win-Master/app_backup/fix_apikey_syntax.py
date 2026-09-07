import sys, re

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix the redeclaration error
code = code.replace("const apiKey = \"proxy-mode\";", "")
# Re-add it safely:
code = re.sub(r'(async function processAccumulatedOralAudio\(\) \{)', r'\1\n    let apiKey = "proxy-mode";', code)
code = re.sub(r'(async function sendAudioToGemini\([^)]*\)\s*\{)', r'\1\n    apiKey = "proxy-mode";', code)
code = re.sub(r'(ipcMain\.handle\([^)]*\)\s*=>\s*\{)', r'\1\n    apiKey = "proxy-mode";', code)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed apiKey SyntaxError.")
