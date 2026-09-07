const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('disconnectedCallback')) {
    const insertPos = content.indexOf('createChannel() {');
    const inject = `
    disconnectedCallback() {
        if (this.ws) {
            this.ws.close();
        }
        super.disconnectedCallback();
    }
    `;
    content = content.slice(0, insertPos) + inject + content.slice(insertPos);
    fs.writeFileSync(path, content);
    console.log("Added disconnectedCallback");
} else {
    console.log("Already has disconnectedCallback");
}
