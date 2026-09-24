const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'InviteView.js');
let text = fs.readFileSync(p, 'utf8');

const regexToRemove = /\s*copyInviteLink\(\) \{\s*if \(window\.require\) \{\s*const \{ clipboard \} = window\.require\('electron'\);\s*clipboard\.writeText\(`https:\/\/hidewin\.com\/join\/\$\{this\.activeChannelId\}`\);\s*\} else \{\s*navigator\.clipboard\.writeText\(`https:\/\/hidewin\.com\/join\/\$\{this\.activeChannelId\}`\);\s*\}\s*\}/;

if (regexToRemove.test(text)) {
    text = text.replace(regexToRemove, "");
    fs.writeFileSync(p, text, 'utf8');
    console.log("Removed duplicate copyInviteLink method.");
} else {
    console.log("Regex didn't match.");
}
