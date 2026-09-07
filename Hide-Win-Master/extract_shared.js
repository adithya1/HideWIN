const fs = require('fs');
const lines = fs.readFileSync('C:/Users/akula/.gemini/antigravity/brain/212ef657-5e3a-4e07-a36e-79cca9f7fb5c/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
let maxLen = 0;
let bestStr = '';
for (let line of lines) {
    if (line.includes('export const unifiedPageStyles = css')) {
        try {
            let data = JSON.parse(line);
            function search(obj) {
                if(typeof obj==='string') {
                    if (obj.includes('export const unifiedPageStyles = css')) {
                        if(obj.length > maxLen && !obj.includes('Set-Content extract_shared')) {
                            maxLen = obj.length;
                            bestStr = obj;
                        }
                    }
                } else if(Array.isArray(obj)) obj.forEach(search);
                else if(typeof obj==='object' && obj) Object.values(obj).forEach(search);
            }
            search(data);
        } catch(e){}
    }
}
console.log('Best length:', maxLen);
if (maxLen > 1000) {
    fs.writeFileSync('src/components/views/sharedPageStyles.js', bestStr);
}
