const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'app', 'HideWinApp.js');
let text = fs.readFileSync(p, 'utf8');

if (!text.includes('InviteView')) {
    text = text.replace("import { BrowseView } from '../views/BrowseView.js';", "import { BrowseView } from '../views/BrowseView.js';\nimport { InviteView } from '../views/InviteView.js';");
}

if (!text.includes("case 'invite':")) {
    text = text.replace("case 'browse':\r\n                return html`<browse-view></browse-view>`;", "case 'browse':\r\n                return html`<browse-view></browse-view>`;\r\n\r\n            case 'invite':\r\n                return html`<invite-view></invite-view>`;");
    text = text.replace("case 'browse':\n                return html`<browse-view></browse-view>`;", "case 'browse':\n                return html`<browse-view></browse-view>`;\n\n            case 'invite':\n                return html`<invite-view></invite-view>`;");
}

const inviteIcon = "{ id: 'invite', label: 'Invite', icon: html`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><line x1=\"19\" y1=\"8\" x2=\"19\" y2=\"14\"></line><line x1=\"22\" y1=\"11\" x2=\"16\" y2=\"11\"></line></svg>` },\n            ";

const browseRegex = /(\{\s*id:\s*'browse'[\s\S]*?\},)/;
if (!text.includes("{ id: 'invite'")) {
    text = text.replace(browseRegex, "$1\n            " + inviteIcon.trim());
}

fs.writeFileSync(p, text, 'utf8');
console.log("Injected Invite into HideWinApp.js");
