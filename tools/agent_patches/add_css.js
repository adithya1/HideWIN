const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

const mediaQuery = `
        @media (max-width: 768px) {
            .join-container { padding: 24px; border-radius: 0; box-shadow: none; height: 100%; display: flex; flex-direction: column; justify-content: center; }
            .controls-bar { width: 90%; justify-content: space-around; padding: 12px; bottom: 16px; }
            .video-container { padding: 0; }
            #remote-video { border-radius: 0; }
            .meeting-info { top: 10px; left: 10px; font-size: 12px; }
        }
`;

if (!content.includes('@media')) {
    content = content.replace('</style>', mediaQuery + '\n    </style>');
    fs.writeFileSync(path, content);
    console.log("Added mobile responsive CSS");
} else {
    console.log("Already responsive");
}
