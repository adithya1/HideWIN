import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

# Fix the missing inline style on pill-dropdown-inner for Mode Select
main = main.replace(
    '<div class="pill-dropdown-inner">\n                            <svg',
    '<div class="pill-dropdown-inner" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; width: 100%; gap: 8px;">\n                            <svg'
)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Fixed missing style on Mode Select inner wrapper.")
