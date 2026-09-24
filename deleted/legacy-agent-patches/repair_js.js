const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    const newHtml = content.substring(0, scriptStart + 8) + '\n' + process.env.NEW_JS + '\n    ' + content.substring(scriptEnd);
    fs.writeFileSync(path, newHtml);
    console.log("Completely repaired all JS in index.html!");
} else {
    console.log("Could not find script tags!");
}
