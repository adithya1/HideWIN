const { _electron: electron } = require('playwright-core');

(async () => {
    console.log('Launching Electron app...');
    const electronApp = await electron.launch({
        args: ['.'],
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('networkidle');

    console.log('Finding wrapper...');
    const loc = window.locator('.pill-dropdown-wrapper').first();
    const isVisible = await loc.isVisible();
    console.log('Is Visible:', isVisible);
    
    if (isVisible) {
        console.log('Clicking...');
        await loc.click();
        await window.waitForTimeout(500);
        const dropdown = window.locator('.child-dropdown').first();
        console.log('Dropdown visible after click:', await dropdown.isVisible());
    }

    await electronApp.close();
    process.exit(0);
})();
