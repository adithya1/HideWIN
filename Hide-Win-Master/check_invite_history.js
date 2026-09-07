const fs = require('fs');
const lines = fs.readFileSync('C:/Users/akula/.gemini/antigravity/brain/212ef657-5e3a-4e07-a36e-79cca9f7fb5c/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
for (let line of lines) {
    if (line.includes('InviteView.js')) {
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                for (let t of data.tool_calls) {
                    const name = t.name;
                    const args = t.args;
                    if (args && args.TargetFile && args.TargetFile.includes('InviteView.js')) {
                        console.log('FOUND:', name, 'File:', args.TargetFile, 'Length:', args.CodeContent ? args.CodeContent.length : (args.ReplacementContent ? args.ReplacementContent.length : 0));
                    }
                }
            }
        } catch(e) {}
    }
}
