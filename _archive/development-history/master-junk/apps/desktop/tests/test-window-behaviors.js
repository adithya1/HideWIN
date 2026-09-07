const assert = require('assert');

// Mock electron before requiring window.js
require.cache[require.resolve('electron')] = {
    exports: {
        BrowserWindow: class {},
        globalShortcut: {
            register: () => {},
            unregisterAll: () => {}
        },
        ipcMain: {
            handle: () => {},
            on: () => {},
            removeAllListeners: () => {}
        },
        screen: {
            getPrimaryDisplay: () => ({ workAreaSize: { width: 1920, height: 1080 } }),
            getCursorScreenPoint: () => ({ x: 0, y: 0 }),
            getAllDisplays: () => [{ bounds: { x: 0, y: 0, width: 1920, height: 1080 } }]
        }
    }
};

const { getDefaultKeybinds } = require('../src/utils/window.js');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
        passed++;
    } catch (e) {
        console.error(`[FAIL] ${name}`);
        console.error(e);
        failed++;
    }
}

console.log('--- Running test-window-behaviors.js ---');

runTest('WIN-01: getDefaultKeybinds returns an object with toggleClickThrough key', () => {
    const keybinds = getDefaultKeybinds();
    assert(keybinds.hasOwnProperty('toggleClickThrough'), 'Missing toggleClickThrough key');
});

runTest('WIN-02: getDefaultKeybinds returns Ctrl+M for Windows', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });
    const keybinds = getDefaultKeybinds();
    assert.strictEqual(keybinds.toggleClickThrough, 'Ctrl+M');
    Object.defineProperty(process, 'platform', { value: originalPlatform });
});

runTest('WIN-03: getDefaultKeybinds returns Cmd+M for macOS', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    const keybinds = getDefaultKeybinds();
    assert.strictEqual(keybinds.toggleClickThrough, 'Cmd+M');
    Object.defineProperty(process, 'platform', { value: originalPlatform });
});

runTest('WIN-04: getDefaultKeybinds has all required keys', () => {
    const keybinds = getDefaultKeybinds();
    const requiredKeys = ['moveUp', 'moveDown', 'toggleVisibility', 'toggleMouseVisibility', 'nextStep'];
    for (const key of requiredKeys) {
        assert(keybinds.hasOwnProperty(key), `Missing required key: ${key}`);
    }
});

runTest('WIN-05: getDefaultKeybinds does NOT return undefined for any key', () => {
    const keybinds = getDefaultKeybinds();
    for (const [key, value] of Object.entries(keybinds)) {
        assert.notStrictEqual(value, undefined, `Key ${key} is undefined`);
    }
});

runTest('WIN-06: All shortcut values are non-empty strings', () => {
    const keybinds = getDefaultKeybinds();
    for (const [key, value] of Object.entries(keybinds)) {
        assert.strictEqual(typeof value, 'string', `Key ${key} is not a string`);
        assert(value.length > 0, `Key ${key} is empty`);
    }
});

console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
