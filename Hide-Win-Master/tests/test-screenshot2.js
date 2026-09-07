const { _electron: electron } = require('playwright');
const path = require('path');

async function run() {
    const app = await electron.launch({ args: [path.join(__dirname, '../src/index.js')] });
    
    await new Promise(r => setTimeout(r, 3000));
    
    const windows = await app.windows();
    console.log('Total windows:', windows.length);
    
    for (let i = 0; i < windows.length; i++) {
        const w = windows[i];
        const title = await w.title().catch(() => 'no title');
        const url = await w.url();
        console.log(`Window ${i}: title="${title}", url="${url}"`);
        if (url.includes('index.html')) {
            console.log('Found main window!');
            
            const appHtml = await w.evaluate(() => {
                const a = document.querySelector('hide-win-app');
                return a && a.shadowRoot ? a.shadowRoot.innerHTML.substring(0, 500) : 'NO SHADOW ROOT';
            });
            console.log('APP HTML:', appHtml);
            await w.screenshot({ path: `screenshot_main.png` });
        }
    }
    
    await app.close();
}
run().catch(console.error);
