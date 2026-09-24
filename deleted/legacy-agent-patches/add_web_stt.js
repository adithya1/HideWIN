const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

const sttLogic = `
        // Remote User STT
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
                    const log = document.getElementById('transcript-log');
                    log.innerHTML += '<div><strong>You:</strong> ' + finalTranscript + '</div>';
                    log.scrollTop = log.scrollHeight;
                    // Could also send back to Host if Host had a view for it
                }
            };
            recognition.start();
        }
`;

if (!content.includes('webkitSpeechRecognition')) {
    content = content.replace("setupWebRTC();", "setupWebRTC();\n" + sttLogic);
    fs.writeFileSync(path, content);
    console.log("Added Web STT logic");
} else {
    console.log("Web STT logic already exists");
}
