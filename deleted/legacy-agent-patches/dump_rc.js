const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js', 'utf8');
const lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('remote-control')) {
        console.log("Found remote-control at line " + i);
        for(let j=Math.max(0, i-10); j<Math.min(lines.length, i+10); j++) {
            console.log(lines[j]);
        }
        break;
    }
}
