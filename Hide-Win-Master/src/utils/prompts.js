'use strict';
// Prompt selection and assembly logic
const { profilePrompts, modeCategoryPrompts, modeCategoryTokenBudgets } = require('./prompts.data');

function getTokenBudget(modeCategory, profile) {
    if (modeCategory && modeCategoryTokenBudgets[modeCategory]) {
        return modeCategoryTokenBudgets[modeCategory];
    }
    
    const targetString = (modeCategory || profile || '').toLowerCase();
    for (const [key, val] of Object.entries(modeCategoryTokenBudgets)) {
        if (targetString.includes(key)) return val;
    }
    
    return modeCategoryTokenBudgets.optional;
}

function buildSystemPrompt(promptParts, customPrompt = '', googleSearchEnabled = true) {
    const sections = [promptParts.intro, '\n\n', promptParts.formatRequirements];

    // Only add search usage section if Google Search is enabled
    if (googleSearchEnabled) {
        sections.push('\n\n', promptParts.searchUsage);
    }

    const candidateProfileInstruction = `
**CRITICAL: PROFILE DATA GROUNDING RULES (MUST FOLLOW FOR EVERY ANSWER):**
1. **YOUR IDENTITY = THE PROFILE BELOW**:
   - You ARE the person described in the 'User-provided context' below. Every answer MUST be grounded in that profile data.
   - The context contains the user's Resume/CV, Job Description (JD), Business Deck, Sales Materials, Meeting Notes, or reference documents.
2. **ALWAYS USE PROFILE DATA FOR ANSWERS**:
   - For ANY question (technical, behavioral, situational, "tell me about yourself", "what's your experience", "walk me through your background", etc.):
   - EXTRACT specific details from the Resume/CV: technologies, years of experience, company names, project names, achievements, metrics.
   - ALIGN answers with the JD/Meeting Agenda/Reference Document requirements.
   - NEVER give generic textbook answers. ALWAYS personalize with the profile's real experience, projects, and skills.
3. **FIRST-PERSON SPOKEN FORM**:
   - ALWAYS respond in FIRST PERSON ("I have 5 years of experience in...", "In my recent project at...", "My approach to this is...") as if you are the person speaking naturally.
4. **DYNAMIC LENGTH & RELEVANCE**:
   - ADJUST LENGTH dynamically based on the question. Short answers for simple questions.
   - For complex questions about projects, technical approaches, or experience, provide DETAILED, COMPREHENSIVE explanations of architecture, contributions, and implementation.
   - If asked to write code or a program, provide the FULL, complete, functional code.
   - NO filler, NO generic advice. Only profile-grounded, highly relevant responses.
`;

    sections.push('\n\n', promptParts.content, '\n\n', candidateProfileInstruction, '\n\nUser-provided context\n-----\n', customPrompt, '\n-----\n\n', promptParts.outputInstructions);

    return sections.join('');
}

/**
 * Build the system prompt based on mode category (from home-page dropdown) AND profile.
 * Mode category takes priority over profile-name keyword matching.
 *
 * @param {string} profile - The selected profile name (e.g., "My Interview Profile")
 * @param {string} customPrompt - The profile's custom text content
 * @param {boolean} googleSearchEnabled - Whether to include search instructions
 * @param {string} [modeCategory=''] - The mode selected on the home page: 'mcq' | 'coding' | 'oral' | ''
 */
function getSystemPrompt(profile, customPrompt = '', googleSearchEnabled = true, modeCategory = '') {
    // 1. Mode category from the legacy mode dictionary
    if (modeCategory && modeCategoryPrompts[modeCategory]) {
        const promptParts = modeCategoryPrompts[modeCategory];
        if (customPrompt) {
            return buildSystemPrompt(promptParts, customPrompt, googleSearchEnabled);
        }
        const sections = [promptParts.intro, '\n\n', promptParts.formatRequirements];
        if (googleSearchEnabled) sections.push('\n\n', promptParts.searchUsage);
        sections.push('\n\n', promptParts.content, '\n\n', promptParts.outputInstructions);
        return sections.join('');
    }

    // 2. Map Mode UI categories to system prompt keys
    let modeKey = 'optional';
    if (modeCategory) {
        const normalizedMode = modeCategory.toLowerCase();
        if (normalizedMode.includes('interview')) modeKey = 'interview';
        else if (normalizedMode.includes('sales')) modeKey = 'sales';
        else if (normalizedMode.includes('meeting')) modeKey = 'meeting';
        else if (normalizedMode.includes('presentation')) modeKey = 'presentation';
        else if (normalizedMode.includes('negotiation')) modeKey = 'negotiation';
        else if (normalizedMode.includes('exam')) modeKey = 'exam';
    } 
    
    // 3. Fall back to profile-keyword matching if mode didn't provide a specific key
    if (modeKey === 'optional' && profile) {
        const normalized = profile.toLowerCase();
        if (normalized.includes('interview')) modeKey = 'interview';
        else if (normalized.includes('sales')) modeKey = 'sales';
        else if (normalized.includes('meeting')) modeKey = 'meeting';
        else if (normalized.includes('presentation')) modeKey = 'presentation';
        else if (normalized.includes('negotiation')) modeKey = 'negotiation';
        else if (normalized.includes('exam')) modeKey = 'exam';
        else if (profilePrompts[profile]) modeKey = profile;
    }

    const promptParts = profilePrompts[modeKey] || profilePrompts.optional;
    return buildSystemPrompt(promptParts, customPrompt, googleSearchEnabled);
}

module.exports = {
    profilePrompts,
    modeCategoryPrompts,
    modeCategoryTokenBudgets,
    getTokenBudget,
    getSystemPrompt,
};
