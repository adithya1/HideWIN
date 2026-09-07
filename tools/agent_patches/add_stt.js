const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

const sttLogic = `
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript.trim() !== '') {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify({ type: 'transcript', text: finalTranscript }));
                    }
                }
            };
            recognition.start();
            this.recognition = recognition;
        }
`;

if (!content.includes('webkitSpeechRecognition')) {
    const insertPos = content.indexOf('this.startScreenShare();');
    if (insertPos !== -1) {
        content = content.slice(0, insertPos) + sttLogic + '\n' + content.slice(insertPos);
        fs.writeFileSync(path, content);
        console.log("Added STT logic");
    } else {
        console.log("Could not find startScreenShare call");
    }
} else {
    console.log("STT logic already exists");
}
