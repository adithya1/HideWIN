const fs = require('fs');

const notesContent = fs.readFileSync('src/components/views/NotesView.js', 'utf8');

// Extract list styles from NotesView
const listStylesRegex = /(\.notes-list \{[\s\S]*?)(?=\n\s*\.empty-state|\n\s*\/\* Markdown)/;
const match = notesContent.match(listStylesRegex);

if (match) {
    const listStyles = match[1];
    let sharedStyles = fs.readFileSync('src/components/views/sharedPageStyles.js', 'utf8');
    if (!sharedStyles.includes('.notes-list {')) {
        sharedStyles = sharedStyles.replace('export const unifiedPageStyles = css`', 'export const unifiedPageStyles = css`\n\n' + listStyles + '\n');
        fs.writeFileSync('src/components/views/sharedPageStyles.js', sharedStyles);
        console.log('Moved list/grid styles to sharedPageStyles.js');
    }
}
