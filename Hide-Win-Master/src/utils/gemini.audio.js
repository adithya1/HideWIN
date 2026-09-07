'use strict';
// macOS/Windows audio capture utilities extracted from gemini.js

const { spawn } = require('child_process');
const { saveDebugAudio } = require('../audioUtils');

function killExistingSystemAudioDump() {
    return new Promise(resolve => {
        console.log('Checking for existing SystemAudioDump processes...');

        // Kill any existing SystemAudioDump processes
        const killProc = spawn('pkill', ['-f', 'SystemAudioDump'], {
            stdio: 'ignore',
        });

        killProc.on('close', code => {
            if (code === 0) {
                console.log('Killed existing SystemAudioDump processes');
            } else {
                console.log('No existing SystemAudioDump processes found');
            }
            resolve();
        });

        killProc.on('error', err => {
            console.log('Error checking for existing processes (this is normal):', err.message);
            resolve();
        });

        // Timeout after 2 seconds
        setTimeout(() => {
            killProc.kill();
            resolve();
        }, 2000);
    });
}

async function startMacOSAudioCapture(geminiSessionRef) {
    if (process.platform !== 'darwin') return false;

    // Kill any existing SystemAudioDump processes first
    await killExistingSystemAudioDump();

    console.log('Starting macOS audio capture with SystemAudioDump...');

    const { app } = require('electron');
    const path = require('path');

    let systemAudioPath;
    if (app.isPackaged) {
        systemAudioPath = path.join(process.resourcesPath, 'SystemAudioDump');
    } else {
        systemAudioPath = path.join(__dirname, '../assets', 'SystemAudioDump');
    }

    console.log('SystemAudioDump path:', systemAudioPath);

    const spawnOptions = {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
            ...process.env,
        },
    };

    systemAudioProc = spawn(systemAudioPath, [], spawnOptions);

    if (!systemAudioProc.pid) {
        console.error('Failed to start SystemAudioDump');
        return false;
    }

    console.log('SystemAudioDump started with PID:', systemAudioProc.pid);

    const CHUNK_DURATION = 0.1;
    const SAMPLE_RATE = 24000;
    const BYTES_PER_SAMPLE = 2;
    const CHANNELS = 2;
    const CHUNK_SIZE = SAMPLE_RATE * BYTES_PER_SAMPLE * CHANNELS * CHUNK_DURATION;

    let audioBuffer = Buffer.alloc(0);

    systemAudioProc.stdout.on('data', data => {
        audioBuffer = Buffer.concat([audioBuffer, data]);

        while (audioBuffer.length >= CHUNK_SIZE) {
            const chunk = audioBuffer.slice(0, CHUNK_SIZE);
            audioBuffer = audioBuffer.slice(CHUNK_SIZE);

            const monoChunk = CHANNELS === 2 ? convertStereoToMono(chunk) : chunk;

            if (currentProviderMode === 'cloud') {
                sendCloudAudio(monoChunk);
            } else if (currentProviderMode === 'local') {
                getLocalAi().processLocalAudio(monoChunk);
            } else {
                const base64Data = monoChunk.toString('base64');
                sendAudioToGemini(base64Data, geminiSessionRef);
            }

            if (process.env.DEBUG_AUDIO) {
                console.log(`Processed audio chunk: ${chunk.length} bytes`);
                saveDebugAudio(monoChunk, 'system_audio');
            }
        }

        const maxBufferSize = SAMPLE_RATE * BYTES_PER_SAMPLE * 1;
        if (audioBuffer.length > maxBufferSize) {
            audioBuffer = audioBuffer.slice(-maxBufferSize);
        }
    });

    systemAudioProc.stderr.on('data', data => {
        console.error('SystemAudioDump stderr:', data.toString());
    });

    systemAudioProc.on('close', code => {
        console.log('SystemAudioDump process closed with code:', code);
        systemAudioProc = null;
    });

    systemAudioProc.on('error', err => {
        console.error('SystemAudioDump process error:', err);
        systemAudioProc = null;
    });

    return true;
}

function convertStereoToMono(stereoBuffer) {
    const samples = stereoBuffer.length / 4;
    const monoBuffer = Buffer.alloc(samples * 2);

    for (let i = 0; i < samples; i++) {
        const leftSample = stereoBuffer.readInt16LE(i * 4);
        monoBuffer.writeInt16LE(leftSample, i * 2);
    }

    return monoBuffer;
}

function stopMacOSAudioCapture() {
    if (systemAudioProc) {
        console.log('Stopping SystemAudioDump...');
        systemAudioProc.kill('SIGTERM');
        systemAudioProc = null;
    }
}

function createWavBuffer(pcmBuffer, sampleRate = 24000) {
    const header = Buffer.alloc(44);
    const dataLen = pcmBuffer.length;
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLen, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLen, 40);
    return Buffer.concat([header, pcmBuffer]);
}

function appendOralAudioPcm(pcmBuffer) {
    if (!pcmBuffer || pcmBuffer.length === 0) return;
    oralAudioChunks.push(pcmBuffer);
    totalOralPcmBytes += pcmBuffer.length;

    // Trigger processing every ~6 seconds of continuous audio (288,000 bytes at 24kHz 16-bit mono)
    if (totalOralPcmBytes >= 288000 && !isProcessingOralAudio) {
        processAccumulatedOralAudio();
    } else if (!isProcessingOralAudio) {
        // Reset 2.5s silence gap timer so interviewer pauses mid-sentence don't cut off questions
        if (oralAudioTimer) clearTimeout(oralAudioTimer);
        oralAudioTimer = setTimeout(() => {
            oralAudioTimer = null;
            processAccumulatedOralAudio();
        }, 2500);
    }
}

async function processAccumulatedOralAudio() {
    if (oralAudioChunks.length === 0 || isProcessingOralAudio) return;

    isProcessingOralAudio = true;
    if (oralAudioTimer) {
        clearTimeout(oralAudioTimer);
        oralAudioTimer = null;
    }

    const combinedPcm = Buffer.concat(oralAudioChunks);
    oralAudioChunks = [];
    totalOralPcmBytes = 0;

    let sumSquares = 0;
    const sampleCount = Math.floor(combinedPcm.length / 2);
    // Ignore tiny audio snippets under 0.4 seconds (19,200 bytes)
    if (combinedPcm.length < 19200) {
        isProcessingOralAudio = false;
        return;
    }

    for (let i = 0; i < sampleCount; i++) {
        const val = combinedPcm.readInt16LE(i * 2);
        sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / sampleCount);

    // Ignore pure digital silence (RMS < 30). Real speech typically has RMS 40-500+.
    // Gemini's NO_QUESTION filter handles ambient noise vs real questions.
    if (rms < 30) {
        isProcessingOralAudio = false;
        return;
    }

    console.log(`[Oral Audio Processing] Analyzing ${combinedPcm.length} bytes of spoken audio (RMS: ${Math.round(rms)})...`);

    const wavBuffer = createWavBuffer(combinedPcm, 24000);
    const base64Wav = wavBuffer.toString('base64');

    const apiKey = getApiKey();
    if (!apiKey) {
        isProcessingOralAudio = false;
        return;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Resolve full profile context (resume + JD + custom prompt)
    const { promptKey, fullPromptContext, profileName } = resolveProfileContext();
    const systemPrompt = getSystemPrompt(promptKey, fullPromptContext, true);

    const audioAuditPrompt = `${systemPrompt}

AUDIO INSTRUCTION: Listen to the attached audio snippet containing the user's speech.
Transcribe the question, and then provide your 1st-person answer based on the candidate profile.
If you only hear background noise or static, just say: "[Audio unclear, please repeat]".`;

    try {
        sendToRenderer('update-status', 'Transcribing spoken question...');
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [
                    { inlineData: { mimeType: 'audio/wav', data: base64Wav } },
                    { text: audioAuditPrompt }
                ]}
            ]
        });

        let fullText = '';
        let isFirst = true;
        for await (const chunk of response) {
            if (chunk.text) {
                fullText += chunk.text;
                if (fullText.includes('[Audio unclear, please repeat]')) {
                    console.log('[Oral Audio Filter] Audio was unclear. Full transcript:', fullText);
                    isProcessingOralAudio = false;
                    return;
                }
                sendToRenderer(isFirst ? 'new-response' : 'update-response', {
                    question: '🎙️ Spoken Question',
                    answer: fullText
                });
                isFirst = false;
            }
        }
        sendToRenderer('update-status', 'Listening...');
    } catch (err) {
        console.warn('Oral audio processing error:', err.message);
        sendToRenderer('update-status', 'Listening...');
    } finally {
        isProcessingOralAudio = false;
    }
}

module.exports = { killExistingSystemAudioDump, startMacOSAudioCapture, convertStereoToMono, stopMacOSAudioCapture, createWavBuffer, appendOralAudioPcm, processAccumulatedOralAudio };
