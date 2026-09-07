const { _electron: electron } = require('playwright-core');
const path = require('path');
const os = require('os');

(async () => {
    console.log('Launching...');
    const electronApp = await electron.launch({ 
        args: ['.', '--user-data-dir=' + path.join(os.tmpdir(), 'playwright-electron-2')], 
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master' 
    });
    
    const window = await electronApp.firstWindow();
    
    window.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    window.on('pageerror', err => console.log('PAGE_ERROR:', err.message));
    
    await window.waitForTimeout(2000);
    
    const hasApp = await window.evaluate(() => {
        return !!document.querySelector('hide-win-app');
    });
    console.log('Has <hide-win-app>?', hasApp);
    
    if (hasApp) {
        const hasShadow = await window.evaluate(() => {
            return !!document.querySelector('hide-win-app').shadowRoot;
        });
        console.log('Has shadow root?', hasShadow);
        if (hasShadow) {
            const inner = await window.evaluate(() => document.querySelector('hide-win-app').shadowRoot.innerHTML);
            console.log('Shadow HTML length:', inner.length);
            console.log('Preview:', inner.substring(0, 100));
        }
    }

    await electronApp.close();
    process.exit(0);
})();
