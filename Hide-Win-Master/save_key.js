const fs = require('fs');
const path = 'C:\\Users\\akula\\AppData\\Roaming\\HideWin\\storage.json';
let data = {};
if (fs.existsSync(path)) {
    try { data = JSON.parse(fs.readFileSync(path, 'utf8')); } catch(e){}
}
if (!data.preferences) data.preferences = {};
data.preferences.groqApiKey = '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';
fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Saved API key');
