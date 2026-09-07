const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Launching Electron app...");
    const electronApp = await electron.launch({ args: ['.'] });
    
    // Wait for the first window
    console.log("Waiting for app to start...");
    await new Promise(r => setTimeout(r, 3000));
    
    let mainPage = null;
    for (const win of electronApp.windows()) {
        const url = win.url();
        console.log("Found window:", url);
        if (url.includes('index.html') && !url.includes('stealth')) {
            mainPage = win;
        }
    }
    
    if (!mainPage) {
        console.error("Main page not found!");
        await electronApp.close();
        process.exit(1);
    }

    // Set mobile viewport
    await mainPage.setViewportSize({ width: 400, height: 800 });
    console.log("Set mobile viewport...");
    await new Promise(r => setTimeout(r, 1000));
    
    const screenshotPath = 'C:\\Users\\akula\\.gemini\\antigravity\\brain\\212ef657-5e3a-4e07-a36e-79cca9f7fb5c\\screenshot_main_mobile.png';
    await mainPage.screenshot({ path: screenshotPath });
    console.log("Screenshot saved to", screenshotPath);
    
    await electronApp.close();
})();
