import sys, re

with open("src/utils/renderer.js", "r", encoding="utf-8") as f:
    code = f.read()

# Disable SpeechRecognition
code = code.replace("setupLocalSpeechRecognition();", "// setupLocalSpeechRecognition(); // Disabled in favor of Vosk")

with open("src/utils/renderer.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Disabled SpeechRecognition in renderer.js")
