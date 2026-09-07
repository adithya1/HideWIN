import sys, re

with open("src/components/views/AssistantView.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace hardcoded dark mode colors with CSS variables
code = code.replace("rgba(38, 40, 48, 0.7)", "var(--bg-elevated)")
code = code.replace("rgba(255,255,255,0.1)", "var(--border)")
code = code.replace("rgba(255,255,255,0.2)", "var(--border)")
code = code.replace("rgba(255,255,255,0.05)", "var(--bg-hover)")
code = code.replace("rgba(255,255,255,0.08)", "var(--bg-hover)")
code = code.replace("rgba(0,0,0,0.3)", "var(--text-secondary)")
code = code.replace("rgba(0,0,0,0.2)", "rgba(0,0,0,0.1)")

with open("src/components/views/AssistantView.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Replaced hardcoded rgba colors with CSS variables.")
