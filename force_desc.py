path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I see it in the output:
# @input=${e => this.description = e.target.innerHTML}>${this.description}</div>

content = content.replace(
    "@input=${e => this.description = e.target.innerHTML}>${this.description}</div>",
    "@input=${e => this.description = e.target.innerHTML}\n                                .innerHTML=${this.description || ''}></div>"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
