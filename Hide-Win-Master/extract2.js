const fs = require('fs');
const data = JSON.parse(fs.readFileSync('recovered_shared.json', 'utf8'));

function searchForContent(obj) {
    if (typeof obj === 'string') {
        if (obj.includes('export const unifiedPageStyles = css`')) {
            return obj;
        }
    } else if (Array.isArray(obj)) {
        for (let item of obj) {
            let res = searchForContent(item);
            if (res) return res;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            let res = searchForContent(obj[key]);
            if (res) return res;
        }
    }
    return null;
}

const content = searchForContent(data);
if (content) {
    fs.writeFileSync('src/components/views/sharedPageStyles.js', content);
    console.log("Restored exact original string! Length:", content.length);
} else {
    console.log("Could not find the exact string inside the JSON object.");
}
