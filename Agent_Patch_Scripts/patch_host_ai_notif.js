const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const target = "this.ws.send(JSON.stringify({ type: 'ai_answer', text: res.answer }));";
const replace = target + "\n                            new Notification('Hide-WIN AI', { body: res.answer });";

if (content.includes(target) && !content.includes("Notification('Hide-WIN AI'")) {
    content = content.replace(target, replace);
    fs.writeFileSync(path, content);
    console.log("Added OS notification for AI answer to Host.");
} else {
    console.log("Already added or target not found.");
}
