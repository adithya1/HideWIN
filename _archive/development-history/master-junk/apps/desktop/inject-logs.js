const fs = require('fs');
let content = fs.readFileSync('src/utils/renderer.js', 'utf8');

const logCode = `
// Forward logs to main process for debugging
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
console.log = (...args) => { originalLog(...args); ipcRenderer.send('log-message', '[Renderer Log] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };
console.warn = (...args) => { originalWarn(...args); ipcRenderer.send('log-message', '[Renderer Warn] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };
console.error = (...args) => { originalError(...args); ipcRenderer.send('log-message', '[Renderer Error] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };
`;

// Insert after `const ipcRenderer = require('electron').ipcRenderer;` or at the top
content = content.replace(/(const { ipcRenderer } = require\('electron'\);)/, `$1\n${logCode}`);
fs.writeFileSync('src/utils/renderer.js', content, 'utf8');
