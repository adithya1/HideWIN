const fs = require('fs');
let code = fs.readFileSync('Hide-Win-Master/src/utils/configManager.js', 'utf8');

code = code.replace(/function normalizeHttpUrl[\s\S]*?function getProtocolName/m, 
unction normalizeHttpUrl(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        if (name === 'HIDEWIN_WEB_URL') return 'http://127.0.0.1:5173';
        if (name === 'HIDEWIN_API_URL') return 'http://127.0.0.1:8000';
        return '';
    }
    let endpoint = value.trim();
    if (!/^https?:\\/\\//i.test(endpoint)) endpoint = 'https://' + endpoint;
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(name + ' must use HTTP or HTTPS.');
    }
    return parsed.toString().replace(/\\/+$/, '');
}

function getProtocolName);

fs.writeFileSync('Hide-Win-Master/src/utils/configManager.js', code);
