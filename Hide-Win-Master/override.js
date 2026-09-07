const crypto = require('crypto');

// --- CUSTOM NATIVE STREAMING BYPASS VIA PROXY ---
async function manualGenerateContentStream(apiKey, requestBody) {
    // We ignore the apiKey completely now, relying on the backend proxy!
    // But we still need the HMAC signature
    
    // Fallback to localhost if backendUrl isn't set, though it should be
    let backendUrl = 'http://localhost:8000';
    try {
        const storage = require('../storage');
        const prefUrl = storage.getPreference('backendUrl');
        if (prefUrl) backendUrl = prefUrl;
    } catch(e) {}
    
    const url = `${backendUrl}/api/ai-proxy/stream`;
    const HMAC_SECRET = 'hw_desktop_secret_998877';

    // The proxy expects `contents` array and optionally `tier`
    const bodyObj = {
        contents: requestBody.contents,
        tier: 'fast' // Or pass from somewhere if needed
    };
    const bodyStr = JSON.stringify(bodyObj);

    const hmac = crypto.createHmac('sha256', HMAC_SECRET);
    hmac.update(bodyStr);
    const signature = hmac.digest('hex');
    
    let fetchFn;
    try { fetchFn = require('node-fetch'); } catch(e) { fetchFn = (...args) => import('node-fetch').then(({default: f}) => f(...args)); }
    
    const response = await fetchFn(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-HideWin-Signature': signature
        },
        body: bodyStr
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proxy stream error: got status: ${response.status}. Details: ${errorText}`);
    }

    return (async function* () {
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        
        for await (const chunk of response.body) {
            buffer += decoder.decode(chunk, { stream: true });
            
            let lines = buffer.split('\n');
            buffer = lines.pop(); // keep the last incomplete line in the buffer
            
            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') continue;
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        if (data.candidates && data.candidates.length > 0) {
                            const parts = data.candidates[0].content?.parts;
                            if (parts && parts.length > 0) {
                                yield { text: parts[0].text || '' };
                            }
                        }
                    } catch (e) {
                        // ignore malformed chunks unless it's the custom error thrown above
                        if(e.message && e.message.startsWith('Google API Error')) throw e;
                    }
                }
            }
        }
    })();
}
