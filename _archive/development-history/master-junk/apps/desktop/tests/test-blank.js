const { _electron: electron } = require('playwright-core');

(async () => {
    const electronApp = await electron.launch({ args: ['.'], cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master' });
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('networkidle');

    const html = await window.content();
    if(html.includes('app-shell')) {
        console.log('App shell found. App rendered successfully.');
    } else {
        console.log('App shell NOT found. App is blank.');
    }

    const logs = [];
    window.on('console', msg => logs.push(msg.text()));
    window.on('pageerror', err => logs.push(err.message));
    
    await window.waitForTimeout(1000);
    console.log('Logs:', logs);

    await electronApp.close();
    process.exit(0);
})();
