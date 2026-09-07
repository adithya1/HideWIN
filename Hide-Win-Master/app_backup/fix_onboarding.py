import re

path = 'src/components/views/OnboardingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('background: var(--bg-app);', 'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Onboarding btn-primary")
