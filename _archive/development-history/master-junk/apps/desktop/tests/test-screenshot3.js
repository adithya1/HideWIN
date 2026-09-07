const { _electron: electron } = require('playwright');
const path = require('path');

async function run() {
    const app = await electron.launch({ args: [path.join(__dirname, '../src/index.js')] });
    
    await new Promise(r => setTimeout(r, 4000));
    
    const windows = await app.windows();
    for (let i = 0; i < windows.length; i++) {
        const w = windows[i];
        const title = await w.title().catch(() => 'no title');
        const url = await w.url();
        console.log(`Window ${i}: title="${title}", url="${url}"`);
        
        w.on('console', msg => console.log(`Win ${i} Console:`, msg.text()));
        w.on('pageerror', err => console.log(`Win ${i} Error:`, err));
        
        const html = await w.evaluate(() => document.body.innerHTML.substring(0, 500));
        console.log(`Win ${i} HTML:`, html);
        
        const appHtml = await w.evaluate(() => {
            const a = document.querySelector('hide-win-app');
            return a && a.shadowRoot ? a.shadowRoot.innerHTML.substring(0, 500) : 'NO SHADOW ROOT';
        });
        console.log(`Win ${i} APP HTML:`, appHtml);
    }
    
    await app.close();
}
run().catch(console.error);
