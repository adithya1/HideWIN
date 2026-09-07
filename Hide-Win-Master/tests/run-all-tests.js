const { spawnSync } = require('child_process');
const path = require('path');

const testFiles = [
    'test-prompts.js',
    'test-window-behaviors.js',
    'test-storage.js'
];

let totalPassed = 0;
let totalFailed = 0;

console.log('=============================================');
console.log('       Hide-WIN Test Runner                  ');
console.log('=============================================');

for (const file of testFiles) {
    const filePath = path.join(__dirname, file);
    const result = spawnSync('node', [filePath], { stdio: 'inherit' });
    
    if (result.status === 0) {
        totalPassed++;
    } else {
        totalFailed++;
    }
}

console.log('=============================================');
console.log(`TEST RUN SUMMARY:`);
console.log(`Suites Passed: ${totalPassed}`);
console.log(`Suites Failed: ${totalFailed}`);
console.log('=============================================');

if (totalFailed > 0) {
    console.error('❌ Some tests failed. Please check the logs above.');
    process.exit(1);
} else {
    console.log('✅ All tests passed successfully!');
    process.exit(0);
}
