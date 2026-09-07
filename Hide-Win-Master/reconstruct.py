import re

with open('diff_main.txt', 'r', encoding='utf-16') as f:
    lines = f.readlines()

output = []
for line in lines:
    if line.startswith('---') or line.startswith('+++') or line.startswith('index ') or line.startswith('@@ ') or line.startswith('diff --git') or line.startswith('warning:'):
        continue
    
    if line.startswith('+'):
        output.append(line[1:])
    elif line.startswith(' '):
        output.append(line[1:])
    elif line.startswith('-'):
        pass
    else:
        if line == '\n':
            output.append('\n')

with open('src/components/views/MainView_restored.js', 'w', encoding='utf-8') as f:
    f.write("".join(output))

