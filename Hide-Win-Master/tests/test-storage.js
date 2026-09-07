const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock electron app for storage.js
require.cache[require.resolve('electron')] = {
    exports: {
        app: {
            getPath: (name) => {
                if (name === 'userData') {
                    // Use a temporary test directory for userData
                    return path.join(os.tmpdir(), 'hidewin-test-data');
                }
                return os.tmpdir();
            },
            getVersion: () => '1.0.0'
        }
    }
};

const storage = require('../src/storage.js');

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

console.log('--- Running test-storage.js ---');

runTest('STOR-04: initializeStorage does not throw', () => {
    assert.doesNotThrow(() => {
        storage.initializeStorage();
    });
});

runTest('STOR-01: getConfig returns an object with mainWindowWidth and mainWindowHeight', () => {
    const config = storage.getConfig();
    assert(config !== null && typeof config === 'object', 'getConfig should return an object');
    assert(config.hasOwnProperty('mainWindowWidth'), 'Missing mainWindowWidth');
    assert(config.hasOwnProperty('mainWindowHeight'), 'Missing mainWindowHeight');
});

runTest('STOR-02: getConfig returns numeric width >= 400 and height >= 300', () => {
    const config = storage.getConfig();
    assert(typeof config.mainWindowWidth === 'number', 'mainWindowWidth should be a number');
    assert(typeof config.mainWindowHeight === 'number', 'mainWindowHeight should be a number');
    assert(config.mainWindowWidth >= 400, 'mainWindowWidth should be >= 400');
    assert(config.mainWindowHeight >= 300, 'mainWindowHeight should be >= 300');
});

runTest('STOR-03: getKeybinds returns null or a valid object, never throws', () => {
    assert.doesNotThrow(() => {
        const keybinds = storage.getKeybinds();
        assert(keybinds === null || typeof keybinds === 'object', 'getKeybinds should return null or object');
    });
});

runTest('STOR-05: getProfiles returns an array', () => {
    const profiles = storage.getProfiles();
    assert(Array.isArray(profiles), 'getProfiles should return an array');
});

// Clean up test data
try {
    const testDir = path.join(os.tmpdir(), 'hidewin-test-data');
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
} catch (e) {
    console.warn('Failed to clean up test data:', e.message);
}

console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
