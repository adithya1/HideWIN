const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js', 'utf8');
const lines = content.split('\n');
let inFunc = false;
let depth = 0;
for(let i=0; i<lines.length; i++) {
    const line = lines[i];
    if(line.includes('render() {')) {
        inFunc = true;
    }
    if(inFunc) {
        console.log(line);
        if(line.includes('{')) depth += (line.match(/\{/g) || []).length;
        if(line.includes('}')) depth -= (line.match(/\}/g) || []).length;
        if(depth === 0 && line.includes('}')) {
            break;
        }
    }
}
