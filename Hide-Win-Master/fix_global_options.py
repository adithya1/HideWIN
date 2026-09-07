import re

path = 'src/components/views/sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = r"""
    /* Global option styling to fix native select dropdowns in Light/Dark mode */
    option {
        background-color: var(--bg-surface) !important;
        color: var(--text-primary) !important;
    }
`;
"""

content = re.sub(r'`;\s*$', replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added explicit option styling to sharedPageStyles.js!")
