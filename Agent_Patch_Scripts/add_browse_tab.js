const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'app', 'HideWinApp.js');
let text = fs.readFileSync(p, 'utf8');

if (!text.includes('BrowseView')) {
    text = text.replace("import { HistoryView } from '../views/HistoryView.js';", "import { HistoryView } from '../views/HistoryView.js';\nimport { BrowseView } from '../views/BrowseView.js';");
}

if (!text.includes("case 'browse':")) {
    text = text.replace("case 'history':\n                return html`<history-view></history-view>`;", "case 'history':\n                return html`<history-view></history-view>`;\n\n            case 'browse':\n                return html`<browse-view></browse-view>`;");
    text = text.replace("case 'history':\r\n                return html`<history-view></history-view>`;", "case 'history':\r\n                return html`<history-view></history-view>`;\r\n\r\n            case 'browse':\r\n                return html`<browse-view></browse-view>`;");
}

const browseIcon = "{ id: 'browse', label: 'Browse', icon: html`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path></svg>` },";

if (!text.includes("{ id: 'browse'")) {
    text = text.replace("{ id: 'history', label: 'History', icon: html`<svg", browseIcon + "\n            { id: 'history', label: 'History', icon: html`<svg");
}

fs.writeFileSync(p, text, 'utf8');
console.log("Injected Browse into HideWinApp.js");
