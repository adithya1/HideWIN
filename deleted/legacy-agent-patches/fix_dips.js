const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'utils', 'window.js');
let content = fs.readFileSync(filePath, 'utf8');

const replaceStr = `                    if (line.startsWith('MOVE:')) {
                        const parts = line.slice(5).split(',');
                        let dx = parseInt(parts[0], 10) || 0;
                        let dy = parseInt(parts[1], 10) || 0;
                        
                        try {
                            const { screen } = require('electron');
                            const curPos = screen.getCursorScreenPoint();
                            const display = screen.getDisplayNearestPoint(curPos);
                            dx = Math.round(dx / display.scaleFactor);
                            dy = Math.round(dy / display.scaleFactor);
                        } catch (e) {}

                        redDotDX = dx;
                        redDotDY = dy;
                    }`;

content = content.replace("                    if (line.startsWith('MOVE:')) {\r\n                        const parts = line.slice(5).split(',');\r\n                        redDotDX = parseInt(parts[0], 10) || 0;\r\n                        redDotDY = parseInt(parts[1], 10) || 0;\r\n                    }", replaceStr);

fs.writeFileSync(filePath, content, 'utf8');
