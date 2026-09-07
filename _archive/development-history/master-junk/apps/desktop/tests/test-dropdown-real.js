const { _electron: electron } = require('playwright-core');

(async () => {
    console.log('Launching Electron app...');
    const electronApp = await electron.launch({
        args: ['.'],
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('networkidle');

    console.log('Clicking inside Shadow DOM...');
    const success = await window.evaluate(() => {
        const app = document.querySelector('hide-win-app');
        if(!app || !app.shadowRoot) return false;
        const main = app.shadowRoot.querySelector('main-view');
        if(!main || !main.shadowRoot) return false;
        const wrapper = main.shadowRoot.querySelector('.pill-dropdown-wrapper');
        if(!wrapper) return false;
        
        wrapper.click();
        return true;
    });

    console.log('Click successful:', success);
    await window.waitForTimeout(500);

    const isVisible = await window.evaluate(() => {
        const app = document.querySelector('hide-win-app');
        const main = app.shadowRoot.querySelector('main-view');
        const child = main.shadowRoot.querySelector('.child-dropdown');
        return child ? window.getComputedStyle(child).display !== 'none' : false;
    });
    
    console.log('Child dropdown visible:', isVisible);

    await electronApp.close();
    process.exit(0);
})();
