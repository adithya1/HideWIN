const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirs = [
    'src/components/views',
    'src/components/app', 
    'src/utils'
];

let hasErrors = false;
for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (!f.endsWith('.js')) continue;
        const fp = path.join(dir, f);
        try {
            execSync('node --check "' + fp + '"', { stdio: 'pipe' });
            // console.log('OK: ' + fp);
        } catch(e) {
            hasErrors = true;
            console.log('SYNTAX ERROR in ' + fp + ':');
            console.log(e.stderr.toString().trim());
            console.log('---');
        }
    }
}
if (!hasErrors) console.log('All JS files passed syntax check!');
