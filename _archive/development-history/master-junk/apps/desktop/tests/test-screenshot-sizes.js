const { _electron: electron } = require('playwright');
const path = require('path');

async function run() {
    const app = await electron.launch({ args: [path.join(__dirname, '../src/index.js')] });
    await new Promise(r => setTimeout(r, 4000));
    const windows = await app.windows();
    
    // Find the main window
    let mainW = null;
    for (let i = 0; i < windows.length; i++) {
        const url = await windows[i].url();
        if (url.includes('index.html')) {
            mainW = windows[i];
            break;
        }
    }
    
    if (mainW) {
        // Screenshot PC size
        await mainW.setViewportSize({ width: 1000, height: 800 });
        await new Promise(r => setTimeout(r, 1000));
        await mainW.screenshot({ path: path.join(__dirname, '../screenshot_pc.png') });
        
        // Screenshot Mobile size
        await mainW.setViewportSize({ width: 400, height: 800 });
        await new Promise(r => setTimeout(r, 1000));
        await mainW.screenshot({ path: path.join(__dirname, '../screenshot_mobile.png') });
    }
    
    await app.close();
}
run().catch(console.error);
