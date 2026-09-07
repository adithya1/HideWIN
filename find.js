const fs = require('fs');
const readline = require('readline');
async function findIt() {
    const fileStream = fs.createReadStream('C:\\Users\\akula\\.gemini\\antigravity\\brain\\2947a1cf-0d7e-4cb4-8f65-61810883ac2e\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    let best = '';
    for await (const line of rl) {
        try {
            const obj = JSON.parse(line);
            if (obj.content && obj.content.includes('class InviteView') && obj.content.includes('grantRole')) {
                if (obj.content.length > best.length) {
                    best = obj.content;
                }
            }
        } catch(e) {}
    }
    fs.writeFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\recovered_invite.txt', best);
    console.log("Done. Length:", best.length);
}
findIt();
