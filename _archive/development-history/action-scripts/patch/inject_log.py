with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
const fs = require('fs');
const os = require('os');
const logFile = os.homedir() + '\\Desktop\\renderer_debug.log';
const origError = console.error;
console.error = function(...args) {
    fs.appendFileSync(logFile, 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n');
    origError.apply(console, args);
};
const origLog = console.log;
console.log = function(...args) {
    fs.appendFileSync(logFile, 'LOG: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n');
    origLog.apply(console, args);
};
"""

# inject at top
content = injection + content

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected console logging")
