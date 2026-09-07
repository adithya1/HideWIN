const { _electron: electron } = require('playwright-core');
const path = require('path');
const os = require('os');

(async () => {
    console.log('Launching app with custom user data dir...');
    const electronApp = await electron.launch({ 
        args: ['.', '--user-data-dir=' + path.join(os.tmpdir(), 'playwright-electron')], 
        cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master' 
    });
    
    const window = await electronApp.firstWindow();
    
    const logs = [];
    window.on('console', msg => {
        if(msg.type() === 'error') logs.push('ERR: ' + msg.text());
    });
    window.on('pageerror', err => logs.push('PAGE_ERR: ' + err.message));
    
    await window.waitForLoadState('networkidle');
    await window.waitForTimeout(2000);
    
    console.log('Logs captured:');
    logs.forEach(l => console.log(l));

    await electronApp.close();
    process.exit(0);
})();
