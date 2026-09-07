import sys

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace("'gemini-2.5-flash-native-audio-latest'", "'gemini-flash-latest'")
code = code.replace("'gemini-2.5-flash'", "'gemini-flash-latest'")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Replaced all gemini-2.5... references.")
