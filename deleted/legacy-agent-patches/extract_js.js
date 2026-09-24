const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html', 'utf8');

// Extract the script tag content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const script = scriptMatch[1];
    fs.writeFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\test_script.js', script);
    console.log("Script extracted!");
}
