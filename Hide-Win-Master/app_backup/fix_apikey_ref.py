import sys, re

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Define apiKey as a dummy string in the functions that were using it
code = re.sub(r'(async function processAccumulatedOralAudio\(\) \{)', r'\1\n    const apiKey = "proxy-mode";', code)
code = re.sub(r'(async function sendAudioToGemini\([^)]*\)\s*\{)', r'\1\n    const apiKey = "proxy-mode";', code)
code = re.sub(r'(ipcMain\.handle\([^)]*\)\s*=>\s*\{)', r'\1\n    const apiKey = "proxy-mode";', code)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed apiKey ReferenceError.")
