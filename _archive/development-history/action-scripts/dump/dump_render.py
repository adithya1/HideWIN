import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

render_part = content.split('render() {')[1]
print(render_part[:3000])
