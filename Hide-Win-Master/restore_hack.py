import sys

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

import re

# Insert manualGenerateContentStream right after the imports
custom_fetch = """
// --- CUSTOM NATIVE STREAMING BYPASS ---
// Google's SDK has a known bug with AQ. keys where it mistakenly sends them as OAuth tokens.
async function manualGenerateContentStream(apiKey, requestBody) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${requestBody.model}:streamGenerateContent?alt=sse&key=${apiKey}`;
    
    let fetch;
    try { fetch = require('node-fetch'); } catch(e) { fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)); }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents: requestBody.contents })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Manual fetch error: got status: ${response.status}. Details: ${errorText}`);
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

code = code.replace("const storage = require('../storage');", "const storage = require('../storage');\n" + custom_fetch)

# Replace ai.models.generateContentStream calls with manualGenerateContentStream
code = code.replace("await ai.models.generateContentStream({", "await manualGenerateContentStream(apiKey.trim(), {")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Restored the ?key= manual streaming bypass!")
