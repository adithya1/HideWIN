const { _electron: electron } = require('playwright');
const path = require('path');

async function run() {
    const app = await electron.launch({ args: [path.join(__dirname, '../src/index.js')] });
    const window = await app.firstWindow();
    
    window.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
    
    await window.waitForLoadState('domcontentloaded');
    await new Promise(r => setTimeout(r, 3000));
    await app.close();
}
run().catch(console.error);
