import sys

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Add vosk variables at the top of the file
if "let voskProcess = null;" not in code:
    code = "const { spawn } = require('child_process');\nlet voskProcess = null;\n" + code

# Function to write to vosk process
vosk_injector = """
function sendToVosk(pcmBuffer) {
    if (!voskProcess) {
        try {
            const path = require('path');
            voskProcess = spawn('python', ['vosk_stt.py'], { cwd: path.join(__dirname, '../..') });
            voskProcess.stdout.on('data', (data) => {
                const lines = data.toString().split('\\n');
                for (let line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.partial && parsed.partial.trim().length > 0) {
                            sendToRenderer('live-transcription', parsed.partial);
                        } else if (parsed.text && parsed.text.trim().length > 0) {
                            sendToRenderer('live-transcription', parsed.text);
                        }
                    } catch (e) {}
                }
            });
            voskProcess.on('exit', () => { voskProcess = null; });
        } catch(err) {
            console.error("Vosk spawn error", err);
        }
    }
    if (voskProcess && voskProcess.stdin && voskProcess.stdin.writable) {
        voskProcess.stdin.write(pcmBuffer);
    }
}
"""

if "function sendToVosk" not in code:
    code = code + "\n" + vosk_injector

# Insert call into send-mic-audio-content
if "sendToVosk(pcmBuffer);" not in code:
    code = code.replace("const pcmBuffer = Buffer.from(data, 'base64');", "const pcmBuffer = Buffer.from(data, 'base64');\n                sendToVosk(pcmBuffer);")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Patched gemini.js to pipe audio to Vosk")
