const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'sharedPageStyles.js');
let text = fs.readFileSync(p, 'utf8');

if (text.includes("`;\r\n\r\n\r\n    /* EXACT NOTES LIST/GRID UI")) {
    text = text.replace("`;\r\n\r\n\r\n    /* EXACT NOTES LIST/GRID UI", "    /* EXACT NOTES LIST/GRID UI");
    text = text + "\n`;";
    fs.writeFileSync(p, text, 'utf8');
    console.log("Fixed sharedPageStyles.js syntax!");
} else if (text.includes("`;\n\n\n    /* EXACT NOTES LIST/GRID UI")) {
    text = text.replace("`;\n\n\n    /* EXACT NOTES LIST/GRID UI", "    /* EXACT NOTES LIST/GRID UI");
    text = text + "\n`;";
    fs.writeFileSync(p, text, 'utf8');
    console.log("Fixed sharedPageStyles.js syntax! (LF)");
} else {
    // regex fallback
    const regex = /`;\s*\/\* EXACT NOTES LIST\/GRID UI/s;
    if (regex.test(text)) {
        text = text.replace(regex, "    /* EXACT NOTES LIST/GRID UI");
        text = text + "\n`;";
        fs.writeFileSync(p, text, 'utf8');
        console.log("Fixed sharedPageStyles.js syntax! (regex)");
    } else {
        console.log("Could not find the syntax error.");
    }
}
