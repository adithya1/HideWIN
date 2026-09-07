import sys
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

import re

# Find the injected block and replace it
new_func = """
// --- CUSTOM NATIVE STREAMING BYPASS ---
// The @google/genai SDK incorrectly formats AQ. API keys as OAuth tokens.
// This function bypasses the SDK and uses standard fetch with X-goog-api-key header.
async function manualGenerateContentStream(apiKey, requestBody) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${requestBody.model}:streamGenerateContent?alt=sse`;
    
    let fetch;
    try { fetch = require('node-fetch'); } catch(e) { fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)); }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
        },
        body: JSON.stringify({ contents: requestBody.contents })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Oral audio processing error: got status: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return (async function* () {
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        
        for await (const chunk of response.body) {
            buffer += decoder.decode(chunk, { stream: true });
            
            let lines = buffer.split('\\n');
            buffer = lines.pop(); // keep the last incomplete line in the buffer
            
            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') continue;
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.candidates && data.candidates.length > 0) {
                            const parts = data.candidates[0].content?.parts;
                            if (parts && parts.length > 0) {
                                yield { text: parts[0].text || '' };
                            }
                        }
                    } catch (e) {
                        // ignore malformed chunks
                    }
                }
            }
        }
    })();
}
"""

code = re.sub(r'// --- CUSTOM NATIVE STREAMING BYPASS ---[\s\S]*?\}\)\(\);\n\}', new_func.strip(), code)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Rewrote SSE parsing to be dependency-free!")
