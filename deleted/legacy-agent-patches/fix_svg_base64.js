const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'utils', 'window.js');
let content = fs.readFileSync(filePath, 'utf8');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>`;
const base64Svg = Buffer.from(svgContent).toString('base64');
const newBgImage = `background-image:url('data:image/svg+xml;base64,${base64Svg}');`;

// We need to replace the old broken background-image line
// It currently looks like: background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="white" stroke-width="1" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"/></svg>');

const brokenRegex = /background-image:url\('data:image\/svg\+xml;utf8,<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[\s\S]*?<\/svg>'\);/g;

content = content.replace(brokenRegex, newBgImage);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Replaced SVG with Base64!");
