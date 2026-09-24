import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace from @media (max-width: 650px) down to the start of MASTER RESPONSIVE ARCHITECTURE
# but KEEP the * { ... } block
keep_block = '''
        * {
            font-family: var(--font);
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }
'''

content = re.sub(
    r'@media\s*\(max-width:\s*650px\)\s*\{\s*\}[\s\S]*?/\*\s*MASTER RESPONSIVE ARCHITECTURE',
    keep_block + '\n        /* MASTER RESPONSIVE ARCHITECTURE',
    content
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned redundant CSS above architecture.")
