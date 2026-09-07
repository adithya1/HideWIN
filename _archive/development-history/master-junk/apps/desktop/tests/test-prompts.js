const assert = require('assert');
const { getSystemPrompt, getTokenBudget, modeCategoryPrompts, profilePrompts } = require('../src/utils/prompts.js');

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

console.log('--- Running test-prompts.js ---');

runTest('PROMPT-01: getSystemPrompt with modeCategory=mcq returns short concise prompt', () => {
    const prompt = getSystemPrompt('interview', '', false, 'mcq');
    assert(prompt.includes('MCQ MODE — ULTRA SHORT'), 'Prompt should include MCQ format requirements');
    assert(prompt.includes('SHORTEST POSSIBLE'), 'Prompt should include MCQ intro');
});

runTest('PROMPT-02: getSystemPrompt with modeCategory=coding returns APPROACH/CODE/HOW IT WORKS sections', () => {
    const prompt = getSystemPrompt('interview', '', false, 'coding');
    assert(prompt.includes('CODING / ARCHITECTURE MODE'), 'Prompt should include CODING format requirements');
    assert(prompt.includes('1. **APPROACH**'), 'Prompt should include APPROACH section');
    assert(prompt.includes('2. **CODE**'), 'Prompt should include CODE section');
});

runTest('PROMPT-03: getSystemPrompt with modeCategory=oral returns spoken-style format', () => {
    const prompt = getSystemPrompt('interview', '', false, 'oral');
    assert(prompt.includes('ORAL / GENERAL MODE'), 'Prompt should include ORAL format requirements');
    assert(prompt.includes('natural spoken style'), 'Prompt should include oral instructions');
});

runTest('PROMPT-04: getSystemPrompt with no modeCategory falls back to profile keyword matching', () => {
    const prompt = getSystemPrompt('interview', '', false, '');
    assert(prompt.includes('interview assistant'), 'Prompt should include interview intro');
});

runTest('PROMPT-05: getSystemPrompt with modeCategory=mcq AND customPrompt includes context', () => {
    const custom = "My custom context string 123";
    const prompt = getSystemPrompt('interview', custom, false, 'mcq');
    assert(prompt.includes(custom), 'Prompt should include the custom prompt');
    assert(prompt.includes('CRITICAL: PROFILE DATA GROUNDING RULES'), 'Prompt should include grounding instructions');
});

runTest('PROMPT-06: getSystemPrompt with unknown modeCategory falls back gracefully to optional', () => {
    const prompt = getSystemPrompt('interview', '', false, 'unknown-mode-xyz');
    // It should fall back to profile match 'interview' because 'unknown-mode-xyz' isn't in modeCategoryPrompts
    assert(prompt.includes('interview assistant'), 'Should fallback to profile match');
});

runTest('PROMPT-07: getSystemPrompt with null profile and empty modeCategory uses optional', () => {
    const prompt = getSystemPrompt(null, '', false, '');
    assert(prompt.includes('all-purpose AI assistant'), 'Should fallback to optional default');
});

runTest('PROMPT-08: getTokenBudget returns 256 for mcq', () => {
    assert.strictEqual(getTokenBudget('mcq', 'interview'), 256);
});

runTest('PROMPT-09: getTokenBudget returns 2048 for coding', () => {
    assert.strictEqual(getTokenBudget('coding', 'interview'), 2048);
});

runTest('PROMPT-10: getTokenBudget returns 768 for oral', () => {
    assert.strictEqual(getTokenBudget('oral', 'interview'), 768);
});

runTest('PROMPT-11: getTokenBudget returns 1024 default for unknown mode', () => {
    assert.strictEqual(getTokenBudget('unknown', 'unknown'), 1024);
});

runTest('PROMPT-12: getTokenBudget with profile containing interview returns 1500', () => {
    assert.strictEqual(getTokenBudget('', 'my-interview-profile'), 1500);
});

runTest('PROMPT-13: All 3 modeCategoryPrompts exist', () => {
    assert(modeCategoryPrompts.mcq, 'mcq mode missing');
    assert(modeCategoryPrompts.coding, 'coding mode missing');
    assert(modeCategoryPrompts.oral, 'oral mode missing');
});

runTest('PROMPT-14: profilePrompts has at least optional and interview keys', () => {
    assert(profilePrompts.optional, 'optional profile missing');
    assert(profilePrompts.interview, 'interview profile missing');
});

console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
