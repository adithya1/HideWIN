const { _electron: electron } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

(async () => {
    try {
        console.log("Launching Electron app via Playwright...");
        const app = await electron.launch({
            args: ['.'],
            cwd: 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master'
        });

        const window = await app.firstWindow();
        await window.waitForLoadState('networkidle');
        console.log("App loaded.");

        await window.evaluate(() => {
            const appRoot = document.getElementById('appRoot');
            appRoot.navigate('notes');
        });
        await window.waitForTimeout(1000);
        
        await window.evaluate(() => {
            const appRoot = document.getElementById('appRoot');
            const notesView = appRoot.shadowRoot.querySelector('notes-view');
            notesView.notes = [
                { id: 'test-123', title: 'Test Note', content: 'test', pinned: false, createdAt: new Date().toISOString() }
            ];
            notesView.requestUpdate();
        });
        await window.waitForTimeout(1000);
        
        await window.evaluate(() => {
            const appRoot = document.getElementById('appRoot');
            const notesView = appRoot.shadowRoot.querySelector('notes-view');
            // Mock the pin event
            notesView.pinToHome(notesView.notes[0]);
        });
        await window.waitForTimeout(2000);
        
        const desktopPath = path.join(os.homedir(), 'OneDrive', 'Desktop');
        const files = fs.readdirSync(desktopPath);
        const lnkFiles = files.filter(f => f.startsWith('HideWin Note - Test Note') && f.endsWith('.lnk'));
        console.log(`Found ${lnkFiles.length} shortcuts:`, lnkFiles);

        await app.close();
        console.log("Test 3 finished.");
    } catch (e) {
        console.error("Test 3 error:", e);
    }
})();
