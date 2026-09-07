const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

const touchLogic = `
        // Mobile Touch Support for Remote Control
        video.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                sendControlEvent('mousedown', { clientX: touch.clientX, clientY: touch.clientY, button: 0 });
            }
        });
        video.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                sendControlEvent('mousemove', { clientX: touch.clientX, clientY: touch.clientY });
            }
        });
        video.addEventListener('touchend', (e) => {
            sendControlEvent('mouseup', { button: 0 });
            sendControlEvent('click', { button: 0 });
        });
`;

if (!content.includes('touchstart')) {
    content = content.replace("window.addEventListener('keydown'", touchLogic + "\n        window.addEventListener('keydown'");
    fs.writeFileSync(path, content);
    console.log("Added touch support");
} else {
    console.log("Touch support already exists");
}
