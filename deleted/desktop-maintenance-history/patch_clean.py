import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the broken drag-region block
broken_drag = r'\s*\.drag-region \{\s*position: absolute;\s*top: 0;\s*left: 0;\s*right: 0;\s*height: 48px;\s*right: 140px;\s*\}'
# wait, it also had -webkit-app-region and z-index.
# let's just use regex to remove the second drag-region completely.
content = re.sub(r'\.drag-region\s*\{[^}]*right:\s*0;\s*height:\s*48px;[^}]*\}', '', content)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
