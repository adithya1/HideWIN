import re

path = 'src/components/views/MainView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_css = r"""        \.child-dropdown::-webkit-scrollbar \{
            width: 4px;
        \}
        \.child-dropdown::-webkit-scrollbar-track \{
            background: transparent;
        \}
        \.child-dropdown::-webkit-scrollbar-thumb \{
            background: var\(--border\);
            border-radius: 4px;
        \}
        \.child-dropdown::-webkit-scrollbar-thumb:hover \{
            background: var\(--text-muted\);
        \}"""

new_css = """        .child-dropdown::-webkit-scrollbar {
            width: 6px;
        }
        .child-dropdown::-webkit-scrollbar-track {
            background: transparent;
            margin: 8px 0;
        }
        .child-dropdown::-webkit-scrollbar-thumb {
            background-color: var(--text-muted, rgba(128, 128, 128, 0.4));
            border-radius: 10px;
            border: 1px solid transparent;
            background-clip: padding-box;
        }
        .child-dropdown::-webkit-scrollbar-thumb:hover {
            background-color: var(--text-secondary, rgba(128, 128, 128, 0.6));
        }"""

content = re.sub(old_css, new_css, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied stylish detached scrollbar")
