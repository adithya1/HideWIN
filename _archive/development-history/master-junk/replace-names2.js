const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /HideWin/g, to: 'WindowsCameras' },
    { from: /hideWin/g, to: 'windowsCameras' },
    { from: /hide-win/g, to: 'windows-cameras' },
    { from: /hide win/g, to: 'windows cameras' },
    { from: /hidewin/g, to: 'windowscameras' }
];

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'out') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (/\.(js|html|json|md|css|txt)$/i.test(filepath) && file !== 'replace-names2.js' && file !== 'replace-names.js') {
                filelist.push(filepath);
            }
        }
    }
    return filelist;
}

const rootDir = process.cwd();
const files = walkSync(rootDir);

let filesModified = 0;
let totalReplacements = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    for (const replacement of replacements) {
        if (replacement.from.test(content)) {
            const count = (content.match(replacement.from) || []).length;
            totalReplacements += count;
            content = content.replace(replacement.from, replacement.to);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        console.log(`Updated ${path.relative(rootDir, file)}`);
    }
}

console.log(`\nComplete! Modified ${filesModified} files with ${totalReplacements} total replacements.`);
