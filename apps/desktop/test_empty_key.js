const fetch = require('node-fetch');

async function test() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=`;
    const payload = {"contents": [{"parts": [{"text": "Say hi"}]}]};
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(`Empty Key -> ${res.status}`);
        const text = await res.text();
        console.log(text.substring(0, 300));
    } catch (e) {
        console.error(e);
    }
}

test();
