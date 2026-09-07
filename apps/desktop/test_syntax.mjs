import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('./src/components/views').filter(f => f.endsWith('.js'));
files.push('../app/HideWinApp.js');
files.push('../index.js');

async function testFiles() {
    for (const file of files) {
        const fullPath = path.resolve(file.startsWith('..') ? `./src/components/${file}` : `./src/components/views/${file}`);
        try {
            await import(`file:///${fullPath.replace(/\\/g, '/')}`);
        } catch (e) {
            console.log(`ERROR in ${file}:`);
            console.log(e.message);
            if (e.stack) {
                const stackLine = e.stack.split('\n').find(l => l.includes('.js:'));
                console.log(stackLine);
            }
        }
    }
}
testFiles();
