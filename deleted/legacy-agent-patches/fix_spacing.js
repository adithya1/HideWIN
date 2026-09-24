const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const injectStyles = `
                /* Spacing */
                --space-xs: 4px;
                --space-sm: 8px;
                --space-md: 16px;
                --space-lg: 24px;
                --space-xl: 32px;
                --space-2xl: 48px;
                
                --font: 'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;`;

content = content.replace("--font: 'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;", injectStyles);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Injected spacing variables into index.html!");
