const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const target = "this.pendingParticipant = { id: guestId, name: guestName };";
if (content.includes(target) && !content.includes('new Notification(')) {
    const inject = `
                this.pendingParticipant = { id: guestId, name: guestName };
                new Notification("Meeting Room", { body: guestName + " is waiting to join. Click Accept in the participant list." });
    `;
    content = content.replace(target, inject);
    fs.writeFileSync(path, content);
    console.log("Added notification");
} else {
    console.log("Notification already exists or target not found");
}
