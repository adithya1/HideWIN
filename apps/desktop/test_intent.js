const {sendToAiProxy} = require('./src/utils/ai_proxy_client.js'); 
async function test() { 
    try {
        const res = await sendToAiProxy('Text to classify: "Tell me about yourself"\nReply with EXACTLY ONE WORD: "QUESTION" or "EXPLANATION".', 'fast'); 
        console.log('RESULT:', res); 
    } catch(e) {
        console.error('ERROR:', e);
    }
} 
test();
