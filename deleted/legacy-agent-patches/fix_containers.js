const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'sharedPageStyles.js');
let text = fs.readFileSync(p, 'utf8');

const containerCss = `
    .notes-container, .profiles-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--space-md);
        gap: var(--space-md);
        box-sizing: border-box;
    }
`;

if (!text.includes('.notes-container, .profiles-container')) {
    text = text.replace("    /* EXACT NOTES LIST/GRID UI", containerCss + "\n    /* EXACT NOTES LIST/GRID UI");
    fs.writeFileSync(p, text, 'utf8');
}
console.log("Added generic container padding to sharedPageStyles!");
