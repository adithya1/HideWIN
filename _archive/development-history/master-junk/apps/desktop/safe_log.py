with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
const _origErr = console.error;
console.error = function(...args) {
    try { require('fs').appendFileSync('C:\\\\Users\\\\akula\\\\Desktop\\\\hide_win_err.log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n'); } catch(e){}
    _origErr.apply(console, args);
};
"""

content = injection + content

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected safe logging")
