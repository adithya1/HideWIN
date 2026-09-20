const configManager = require('./configManager.js');
const crypto = require('crypto');

const PROXY_URL = `${configManager.getApiBaseUrl()}/api/ai-proxy/generate`;
// In a real application, this should be obfuscated or fetched via an auth handshake.
// For now, it matches the backend router configuration.
const HMAC_SECRET = 'hw_desktop_secret_998877';

async function sendToAiProxy(prompt, tier = 'fast', systemInstruction = '') {
    const bodyObj = {
        prompt: prompt,
        tier: tier,
        system_instruction: systemInstruction
    };
    const bodyStr = JSON.stringify(bodyObj);

    const hmac = crypto.createHmac('sha256', HMAC_SECRET);
    hmac.update(bodyStr);
    const signature = hmac.digest('hex');

    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-HideWin-Signature': signature
        },
        body: bodyStr
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Proxy error: ${response.status} ${errText}`);
    }

    return await response.json();
}

module.exports = { sendToAiProxy };
