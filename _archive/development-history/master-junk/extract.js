const fs = require('fs');
const data = JSON.parse(fs.readFileSync('recovered_shared.json', 'utf8'));

// The step content is inside data.content or data.tool_calls
// Let's just stringify the whole JSON and regex it
let str = JSON.stringify(data);

// Because it's JSON, newlines are \\n and quotes are \"
// We need to carefully extract the CSS block
const idxStart = str.indexOf('export const unifiedPageStyles = css`');
if (idxStart !== -1) {
    const substr = str.substring(idxStart);
    const idxEnd = substr.indexOf('`;');
    if (idxEnd !== -1) {
        let cssBlock = substr.substring(0, idxEnd + 2);
        
        // Unescape JSON stringified formatting (naive approach)
        cssBlock = cssBlock.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        
        const finalCode = "import { css } from '../../assets/lit-core-2.7.4.min.js';\n\n" + cssBlock;
        fs.writeFileSync('src/components/views/sharedPageStyles.js', finalCode);
        console.log("Successfully restored sharedPageStyles.js! Length:", finalCode.length);
    } else {
        console.log("Found start but not end");
    }
} else {
    console.log("Could not find start");
}
