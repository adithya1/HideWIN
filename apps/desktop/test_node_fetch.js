const fetch = require('node-fetch');

const KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA";

async function test() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${KEY}`;
    const payload = {"contents": [{"parts": [{"text": "Say hi"}]}]};
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log(`URL Key -> ${res.status}`);
        const text = await res.text();
        console.log(text.substring(0, 300));
    } catch (e) {
        console.error(e);
    }
}

test();
