import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\gemini.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

intent_classifier_logic = r"""        console.log('Processing question:', trimmedText);

        // --- NEW: Intent Classifier ---
        try {
            sendToRenderer('update-status', 'Classifying intent...');
            const classifierPrompt = `You are a real-time speech intent classifier for a job interview application.
Given the following transcribed speech, determine if it is:
1) "QUESTION": The interviewer is asking a question, making a statement, or greeting the candidate.
2) "EXPLANATION": The candidate is answering a question, explaining their background, or speaking about themselves.

Reply with EXACTLY ONE WORD: "QUESTION" or "EXPLANATION". Do not output anything else.

Text to classify: "${trimmedText}"`;
            
            // Use fast tier (e.g. Llama-3-8B) for ultra-low latency classification
            const classResponse = await sendToAiProxy(classifierPrompt, 'fast', 'You are an intent classifier.');
            let intent = (classResponse.text || 'QUESTION').trim().toUpperCase();
            
            // Cleanup any punctuation or extra text the LLM might have hallucinated
            if (intent.includes('EXPLANATION')) intent = 'EXPLANATION';
            else intent = 'QUESTION'; // Default to question

            console.log(`[Intent Classifier] Classified as: ${intent}`);

            if (intent === 'EXPLANATION') {
                sendToRenderer('append-explanation', trimmedText);
                sendToRenderer('update-status', 'Listening...');
                return { success: true, intent: 'EXPLANATION' };
            }
            
            // If it's a QUESTION, emit the placeholder immediately so the UI responds instantly
            sendToRenderer('new-response', {
                question: trimmedText,
                answer: '⏳ *Generating response...*'
            });
            
        } catch (err) {
            console.error('[Intent Classifier] Error:', err);
            // If it fails, silently default to QUESTION to prevent breaking the flow
            sendToRenderer('new-response', {
                question: trimmedText,
                answer: '⏳ *Generating response...*'
            });
        }
        // ------------------------------
"""

# Find `console.log('Processing question:', trimmedText);` in ipcMain.handle('send-text-message'
target = r"        console\.log\('Processing question:', trimmedText\);"

content = re.sub(target, intent_classifier_logic, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Intent Classifier injected into gemini.js")
