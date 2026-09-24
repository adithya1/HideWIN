const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'utils', 'window.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /\/\/\s*Kill the mouse blocker process\s*if \(blockerProcess\) \{\s*try \{ blockerProcess\.kill\(\); \} catch \(e\) \{\}/s;

const gracefulKill = `// Gracefully kill the mouse blocker process so it restores system cursors
        if (blockerProcess) {
            try { 
                if (blockerProcess.stdin) {
                    blockerProcess.stdin.write('\\n');
                    blockerProcess.stdin.end();
                }
                const pToKill = blockerProcess;
                setTimeout(() => {
                    try { pToKill.kill(); } catch (e) {}
                }, 200);
            } catch (e) {}`;

if (regex.test(text)) {
    text = text.replace(regex, gracefulKill);
    fs.writeFileSync(p, text, 'utf8');
    console.log("Updated stopStealthMode to gracefully exit MouseBlocker!");
} else {
    console.log("Regex didn't match.");
}
