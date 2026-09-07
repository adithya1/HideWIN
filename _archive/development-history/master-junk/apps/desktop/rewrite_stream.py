import sys

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# I will inject a custom manual streaming fetch function and replace ai.models.generateContentStream calls with it.
custom_stream_func = """
// --- CUSTOM NATIVE STREAMING BYPASS ---
// The @google/genai SDK incorrectly formats AQ. API keys as OAuth tokens.
// This function bypasses the SDK and uses standard fetch with X-goog-api-key header.
async function manualGenerateContentStream(apiKey, requestBody) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${requestBody.model}:streamGenerateContent?alt=sse`;
    
    const fetch = (await import('node-fetch')).default;
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

    // Return an async generator to perfectly mimic the SDK's response
    return (async function* () {
        const { createParser } = await import('eventsource-parser');
        let resolveNext;
        let rejectNext;
        const queue = [];
        let isFinished = false;

        const parser = createParser((event) => {
            if (event.type === 'event') {
                try {
                    const data = JSON.parse(event.data);
                    if (data.candidates && data.candidates.length > 0) {
                        const parts = data.candidates[0].content?.parts;
                        if (parts && parts.length > 0) {
                            const chunkText = parts[0].text || '';
                            queue.push({ text: chunkText });
                            if (resolveNext) {
                                resolveNext();
                                resolveNext = null;
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error parsing SSE event', e);
                }
            }
        });

        // Read stream
        response.body.on('data', (chunk) => {
            parser.feed(chunk.toString());
        });
        
        response.body.on('end', () => {
            isFinished = true;
            if (resolveNext) resolveNext();
        });

        response.body.on('error', (err) => {
            isFinished = true;
            if (rejectNext) rejectNext(err);
        });

        // Yield chunks
        while (!isFinished || queue.length > 0) {
            if (queue.length > 0) {
                yield queue.shift();
            } else {
                await new Promise((resolve, reject) => {
                    resolveNext = resolve;
                    rejectNext = reject;
                });
            }
        }
    })();
}
"""

if "manualGenerateContentStream" not in code:
    # Inject it near the top but after requires
    code = code.replace("const { getAvailableModel", custom_stream_func + "\nconst { getAvailableModel")

# Now replace `ai.models.generateContentStream` with our manual one!
code = code.replace("await ai.models.generateContentStream", "await manualGenerateContentStream(apiKey, ")
# We need to fix the closing brace since we wrapped the argument in a new function call
# `await ai.models.generateContentStream({...});` becomes `await manualGenerateContentStream(apiKey, {...});`
code = code.replace("        });", "        });") # Wait, replacing `ai.models.generateContentStream` with `manualGenerateContentStream(apiKey, ` is enough, but wait, the syntax was:
# await ai.models.generateContentStream({ model: ..., contents: ... });
# So replacing `await ai.models.generateContentStream` with `await manualGenerateContentStream(apiKey` won't close the parenthesis correctly if I just do string replacement!
# Actually, `await ai.models.generateContentStream({` -> `await manualGenerateContentStream(apiKey, {` works perfectly without touching the end parenthesis!

code = code.replace("await ai.models.generateContentStream({", "await manualGenerateContentStream(apiKey, {")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Rewrote gemini.js to use manual SSE fetch instead of @google/genai SDK for streaming!")
