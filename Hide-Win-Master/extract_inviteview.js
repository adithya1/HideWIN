const fs = require('fs');
const lines = fs.readFileSync('C:/Users/akula/.gemini/antigravity/brain/212ef657-5e3a-4e07-a36e-79cca9f7fb5c/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
let best = '';
let max = 0;
for (let line of lines) {
    if (line.includes('InviteView') && (line.includes('New Meeting') || line.includes('write_to_file'))) {
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                for (let t of data.tool_calls) {
                    const name = t.name || (t.function && t.function.name);
                    const args = t.args || (t.function && typeof t.function.arguments === 'string' ? JSON.parse(t.function.arguments) : t.function && t.function.arguments);
                    if ((name === 'write_to_file' || name === 'default_api:write_to_file') && args && args.TargetFile && args.TargetFile.includes('InviteView.js')) {
                        if (args.CodeContent && args.CodeContent.length > max) {
                            max = args.CodeContent.length;
                            best = args.CodeContent;
                        }
                    }
                }
            }
        } catch(e) {}
    }
}
console.log('Length found:', max);
if (max > 1000) {
    fs.writeFileSync('src/components/views/InviteView_1230.js', best);
    console.log('Saved!');
}
