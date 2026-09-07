const { _electron: electron } = require('playwright');
const path = require('path');

async function run() {
    const app = await electron.launch({ args: [path.join(__dirname, '../src/index.js')] });
    const window = await app.firstWindow();
    
    await window.waitForLoadState('domcontentloaded');
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if body is empty
    const bodyHtml = await window.evaluate(() => document.body.innerHTML);
    console.log('BODY HTML:', bodyHtml.substring(0, 500));
    
    const appHtml = await window.evaluate(() => {
        const app = document.querySelector('hide-win-app');
        return app ? app.shadowRoot.innerHTML.substring(0, 500) : 'NO APP';
    });
    console.log('APP HTML:', appHtml);
    
    await window.screenshot({ path: 'screenshot.png' });
    await app.close();
}
run().catch(console.error);
