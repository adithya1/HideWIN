import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

# We want to remove the `<div class="home-header"> ... </div>` completely.
# It starts with `<div class="home-header">` and ends right before `${this._renderActionBar()}`
main = re.sub(r'<div class="home-header">.*?</div>\s*(?=\$\{this\._renderActionBar\(\)\})', '', main, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Removed redundant home-header from MainView.js")
