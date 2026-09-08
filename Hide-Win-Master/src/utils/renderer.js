
function ensureQuestionMark(text) {
    if (!text) return text;
    const trimmed = text.trim();
    if (trimmed.length === 0) return trimmed;
    const lastChar = trimmed[trimmed.length - 1];
    if (['?', '.', '!'].includes(lastChar)) {
        if (lastChar === '?') return trimmed;
        return trimmed.slice(0, -1) + '?'; // Replace . or ! with ?
    }
    return trimmed + '?';
}
// renderer.js
const { ipcRenderer } = require('electron');
const { float32ToWavBlob, convertFloat32ToInt16, arrayBufferToBase64 } = require('./audioUtils.js');

// Global logger override to send all logs to main process file
const origLog = console.log;
const origErr = console.error;
const origWarn = console.warn;
console.log = (...args) => { origLog(...args); ipcRenderer.send('renderer-log', 'INFO', ...args); };
console.error = (...args) => { origErr(...args); ipcRenderer.send('renderer-log', 'ERR', ...args); };
console.warn = (...args) => { origWarn(...args); ipcRenderer.send('renderer-log', 'WARN', ...args); };

// Debug utilities
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
console.log = (...args) => { originalLog(...args); ipcRenderer.send('log-message', '[Renderer Log] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };
console.warn = (...args) => { originalWarn(...args); ipcRenderer.send('log-message', '[Renderer Warn] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };
console.error = (...args) => { originalError(...args); ipcRenderer.send('log-message', '[Renderer Error] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); };

let mediaStream = null;
let screenshotInterval = null;
let audioContext = null;
let audioProcessor = null;
let micAudioProcessor = null;
let audioBuffer = [];
const SAMPLE_RATE = 24000;
const AUDIO_CHUNK_DURATION = 0.1; // seconds
const BUFFER_SIZE = 4096; // Increased buffer size for smoother audio

let hiddenVideo = null;
let offscreenCanvas = null;
let offscreenContext = null;
let currentImageQuality = 'medium'; // Store current image quality for manual screenshots

const isLinux = process.platform === 'linux';
const isMacOS = process.platform === 'darwin';

// ============ STORAGE API ============
// Wrapper for IPC-based storage access
const storage = {
    // Config
    async getConfig() {
        const result = await ipcRenderer.invoke('storage:get-config');
        return result.success ? result.data : {};
    },
    async setConfig(config) {
        return ipcRenderer.invoke('storage:set-config', config);
    },
    async updateConfig(key, value) {
        return ipcRenderer.invoke('storage:update-config', key, value);
    },

    // Credentials
    async getCredentials() {
        const result = await ipcRenderer.invoke('storage:get-credentials');
        return result.success ? result.data : {};
    },
    async setCredentials(credentials) {
        return ipcRenderer.invoke('storage:set-credentials', credentials);
    },
    async getApiKey() {
        const result = await ipcRenderer.invoke('storage:get-api-key');
        return result.success ? result.data : '';
    },
    async setApiKey(apiKey) {
        return ipcRenderer.invoke('storage:set-api-key', apiKey);
    },
    async getGroqApiKey() {
        const result = await ipcRenderer.invoke('storage:get-groq-api-key');
        return result.success ? result.data : '';
    },
    async setGroqApiKey(groqApiKey) {
        return ipcRenderer.invoke('storage:set-groq-api-key', groqApiKey);
    },

    // Preferences
    async getPreferences() {
        const result = await ipcRenderer.invoke('storage:get-preferences');
        return result.success ? result.data : {};
    },
    async setPreferences(preferences) {
        return ipcRenderer.invoke('storage:set-preferences', preferences);
    },
    async updatePreference(key, value) {
        return ipcRenderer.invoke('storage:update-preference', key, value);
    },

    // Keybinds
    async getKeybinds() {
        const result = await ipcRenderer.invoke('storage:get-keybinds');
        return result.success ? result.data : null;
    },
    async setKeybinds(keybinds) {
        return ipcRenderer.invoke('storage:set-keybinds', keybinds);
    },

    // Sessions (History)
    async getAllSessions() {
        const result = await ipcRenderer.invoke('storage:get-all-sessions');
        return result.success ? result.data : [];
    },
    async getSession(sessionId) {
        const result = await ipcRenderer.invoke('storage:get-session', sessionId);
        return result.success ? result.data : null;
    },
    async saveSession(sessionId, data) {
        return ipcRenderer.invoke('storage:save-session', sessionId, data);
    },
    async deleteSession(sessionId) {
        return ipcRenderer.invoke('storage:delete-session', sessionId);
    },
    async deleteAllSessions() {
        return ipcRenderer.invoke('storage:delete-all-sessions');
    },
    // Notes
    async getNotes() {
        const result = await ipcRenderer.invoke('storage:get-notes');
        return result.success ? result.data : [];
    },
    async saveNotes(notes) {
        return ipcRenderer.invoke('storage:save-notes', notes);
    },

    // Profiles
    async getProfiles() {
        return ipcRenderer.invoke('get-profiles');
    },
    async saveProfiles(profiles) {
        return ipcRenderer.invoke('save-profiles', profiles);
    },

    // Clear all
    async clearAll() {
        return ipcRenderer.invoke('storage:clear-all');
    },

    // Limits
    async getTodayLimits() {
        const result = await ipcRenderer.invoke('storage:get-today-limits');
        return result.success ? result.data : { flash: { count: 0 }, flashLite: { count: 0 } };
    }
};

// Cache for preferences to avoid async calls in hot paths
let preferencesCache = null;

async function loadPreferencesCache() {
    preferencesCache = await storage.getPreferences();
    return preferencesCache;
}

// Initialize preferences cache
loadPreferencesCache();

// convertFloat32ToInt16 moved to audioUtils.js

// arrayBufferToBase64 moved to audioUtils.js

async function initializeGemini(profile = 'interview', language = 'en-US') {
    const apiKey = await storage.getApiKey();
    if (apiKey) {
        let activeCustomPrompt = '';
        let resolvedMode = profile; // Default to passing the raw string as mode
        try {
            const profiles = await storage.getProfiles().catch(() => []);
            if (profiles && profiles.length > 0) {
                const found = profiles.find(p => p.id === profile || String(p.numericId) === String(profile) || p.type === profile);
                if (found) {
                    activeCustomPrompt = found.customPrompt || '';
                    if (found.type) resolvedMode = found.type; // Extract the Mode string from the profile!
                }
            }
        } catch (e) {}

        if (!activeCustomPrompt) {
            const prefs = await storage.getPreferences();
            activeCustomPrompt = prefs.customPrompt || '';
        }

        await ipcRenderer.invoke('initialize-gemini', apiKey, activeCustomPrompt, resolvedMode, language);
        hideWin.setStatus('Listening...');
    }
}

async function initializeLocal(profile = 'interview') {
    const prefs = await storage.getPreferences();
    const ollamaHost = prefs.ollamaHost || 'http://127.0.0.1:11434';
    const ollamaModel = prefs.ollamaModel || 'llama3.1';
    const whisperModel = prefs.whisperModel || 'Xenova/whisper-small';
    
    let activeCustomPrompt = prefs.customPrompt || '';
    let resolvedMode = profile;
    try {
        const profiles = await storage.getProfiles().catch(() => []);
        if (profiles && profiles.length > 0) {
            const found = profiles.find(p => p.id === profile || String(p.numericId) === String(profile) || p.type === profile);
            if (found) {
                activeCustomPrompt = found.customPrompt || activeCustomPrompt;
                if (found.type) resolvedMode = found.type;
            }
        }
    } catch (e) {}

    const success = await ipcRenderer.invoke('initialize-local', ollamaHost, ollamaModel, whisperModel, resolvedMode, activeCustomPrompt);
    if (success) {
        hideWin.setStatus('Local AI Live');
        return true;
    } else {
        hideWin.setStatus('error');
        return false;
    }
}

async function initializeCloud(profile = 'interview') {
    const creds = await storage.getCredentials();
    const token = creds.cloudToken;
    if (!token || !token.trim()) {
        hideWin.setStatus('error');
        return false;
    }

    const prefs = await storage.getPreferences();
    const success = await ipcRenderer.invoke('initialize-cloud', token, profile, prefs.customPrompt || '');
    if (success) {
        hideWin.setStatus('Live');
        return true;
    } else {
        hideWin.setStatus('error');
        return false;
    }
}

// Listen for status updates
ipcRenderer.on('update-status', (event, status) => {
    console.log('Status update:', status);
    hideWin.setStatus(status);
});

async function startCapture(screenshotIntervalSeconds = 5, imageQuality = 'medium') {
    // Store the image quality for manual screenshots
    currentImageQuality = imageQuality;

    // Refresh preferences cache
    await loadPreferencesCache();
    const audioMode = preferencesCache.audioMode || 'both';
    
    console.log();

    try {
        if (isMacOS) {
            // On macOS, use SystemAudioDump for audio and getDisplayMedia for screen
            console.log('Starting macOS capture with SystemAudioDump...');

            // Start macOS audio capture
            const audioResult = await ipcRenderer.invoke('start-macos-audio');
            if (!audioResult.success) {
                throw new Error('Failed to start macOS audio capture: ' + audioResult.error);
            }

            // Get screen capture for screenshots
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 1,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false, // Don't use browser audio on macOS
            });

            console.log('macOS screen capture started - audio handled by SystemAudioDump');

            if (audioMode === 'mic_only' || audioMode === 'both') {
                let micStream = null;
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: SAMPLE_RATE,
                            channelCount: 1,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        },
                        video: false,
                    });
                    console.log('macOS microphone capture started');
                    setupLinuxMicProcessing(micStream);
                } catch (micError) {
                    console.warn('Failed to get microphone access on macOS:', micError);
                }
            }
        } else if (isLinux) {
            // Linux - use display media for screen capture and try to get system audio
            try {
                // First try to get system audio via getDisplayMedia (works on newer browsers)
                mediaStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: 1,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: {
                        sampleRate: SAMPLE_RATE,
                        channelCount: 1,
                        echoCancellation: false, // Don't cancel system audio
                        noiseSuppression: false,
                        autoGainControl: false,
                    },
                });

                console.log('Linux system audio capture via getDisplayMedia succeeded');

                // Setup audio processing for Linux system audio
                setupLinuxSystemAudioProcessing();
            } catch (systemAudioError) {
                console.warn('System audio via getDisplayMedia failed, trying screen-only capture:', systemAudioError);

                // Fallback to screen-only capture
                mediaStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: 1,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                });
            }

            // Additionally get microphone input for Linux based on audio mode
            if (audioMode === 'mic_only' || audioMode === 'both') {
                let micStream = null;
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: SAMPLE_RATE,
                            channelCount: 1,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        },
                        video: false,
                    });

                    console.log('Linux microphone capture started');

                    // Setup audio processing for microphone on Linux
                    setupLinuxMicProcessing(micStream);
                } catch (micError) {
                    console.warn('Failed to get microphone access on Linux:', micError);
                    // Continue without microphone if permission denied
                }
            }

            console.log('Linux capture started - system audio:', mediaStream.getAudioTracks().length > 0, 'microphone mode:', audioMode);
        } else {
            // Windows - use display media with loopback for system audio
            console.log('Starting Windows capture...');
            console.log();
            
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 1,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: {
                    sampleRate: SAMPLE_RATE,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            console.log('Windows capture started with loopback audio');
            // Setup audio processing for Windows loopback audio only
            setupWindowsLoopbackProcessing();

            if (audioMode === 'mic_only' || audioMode === 'both') {
                let micStream = null;
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: SAMPLE_RATE,
                            channelCount: 1,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        },
                        video: false,
                    });
                    console.log('Windows microphone capture started');
                    setupLinuxMicProcessing(micStream);
                } catch (micError) {
                    console.warn('Failed to get microphone access on Windows:', micError);
                    hideWin.setStatus('Microphone access denied! Check Windows Privacy settings.');
                }
            }
        }

        console.log('MediaStream obtained:', {
            hasVideo: mediaStream.getVideoTracks().length > 0,
            hasAudio: mediaStream.getAudioTracks().length > 0,
            videoTrack: mediaStream.getVideoTracks()[0]?.getSettings(),
        });

        // setupLocalSpeechRecognition(); // Disabled in favor of Vosk

        // Manual mode only - screenshots captured on demand via shortcut
        console.log('Manual mode enabled - screenshots will be captured on demand only');
    } catch (err) {
        console.log();
        console.error('Error starting capture:', err);
    }
}

let speechRecognitionInstance = null;
let currentTranscriptionLanguage = 'en-US';

function setTranscriptionLanguage(lang) {
    currentTranscriptionLanguage = lang || 'en-US';
    // If recognition is currently running, we need to restart it to apply the new language
    if (speechRecognitionInstance && isListening) {
        speechRecognitionInstance.stop();
        // It will automatically restart on 'end' event and pick up the new language
    }
}

function setupLocalSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('SpeechRecognition API not supported in this Chromium renderer');
        return;
    }

    try {
        if (speechRecognitionInstance) {
            try { speechRecognitionInstance.stop(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = currentTranscriptionLanguage;

        let speechSilenceTimer = null;
        let currentUtterance = '';

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }

            if (transcript.trim()) {
                currentUtterance = transcript.trim();
                
                // EMIT LIVE TRANSCRIPTION
                const app = document.querySelector('hide-win-app');
                if (app && typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription(currentUtterance);
                }

                if (speechSilenceTimer) clearTimeout(speechSilenceTimer);

                // 600ms silence debouncer for instant oral speech question submission
                speechSilenceTimer = setTimeout(async () => {
                    if (currentUtterance) {
                        const questionText = currentUtterance;
                        currentUtterance = '';
                        
                        // CLEAR LIVE TRANSCRIPTION
                        if (app && typeof app.updateLiveTranscription === 'function') {
                            app.updateLiveTranscription('');
                        }

                        await ipcRenderer.invoke('send-text-message', questionText);
                    }
                }, 600);
            }
        };

        recognition.onerror = (event) => {
            console.warn('SpeechRecognition error:', event.error);
        };

        recognition.onend = () => {
            // Restart continuously while capture is active
            if (mediaStream) {
                try { recognition.start(); } catch (e) {}
            }
        };

        recognition.start();
        speechRecognitionInstance = recognition;
        console.log('Instant Local SpeechRecognition started successfully');
    } catch (err) {
        console.warn('Failed to start local SpeechRecognition:', err.message);
    }
}

function stopLocalSpeechRecognition() {
    if (speechRecognitionInstance) {
        try { speechRecognitionInstance.stop(); } catch (e) {}
        speechRecognitionInstance = null;
    }
}

function setupLinuxMicProcessing(micStream) {
    console.log("Replacing continuous chunking with Silero VAD processing...");
    initSileroVAD(micStream);
}

function setupLinuxSystemAudioProcessing() {
    // Setup system audio processing for Linux (from getDisplayMedia)
    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    const source = audioContext.createMediaStreamSource(mediaStream);
    audioProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

    let audioBuffer = [];
    const samplesPerChunk = SAMPLE_RATE * AUDIO_CHUNK_DURATION;

    audioProcessor.onaudioprocess = async e => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioBuffer.push(...inputData);

        // Process audio in chunks
        while (audioBuffer.length >= samplesPerChunk) {
            const chunk = audioBuffer.splice(0, samplesPerChunk);
            const pcmData16 = convertFloat32ToInt16(chunk);
            const base64Data = arrayBufferToBase64(pcmData16.buffer);

            await ipcRenderer.invoke('send-audio-content', {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            });
        }
    };

    const sysGain = audioContext.createGain();
    sysGain.gain.value = 0; // Mute output

    source.connect(audioProcessor);
    audioProcessor.connect(sysGain);
    sysGain.connect(audioContext.destination);
}

function setupWindowsLoopbackProcessing() {
    // Setup audio processing for Windows loopback audio only
    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    const source = audioContext.createMediaStreamSource(mediaStream);
    audioProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

    let audioBuffer = [];
    const samplesPerChunk = SAMPLE_RATE * AUDIO_CHUNK_DURATION;

    audioProcessor.onaudioprocess = async e => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioBuffer.push(...inputData);

        // Process audio in chunks
        while (audioBuffer.length >= samplesPerChunk) {
            const chunk = audioBuffer.splice(0, samplesPerChunk);
            const pcmData16 = convertFloat32ToInt16(chunk);
            const base64Data = arrayBufferToBase64(pcmData16.buffer);

            await ipcRenderer.invoke('send-audio-content', {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            });
        }
    };

    const loopGain = audioContext.createGain();
    loopGain.gain.value = 0; // Mute output

    source.connect(audioProcessor);
    audioProcessor.connect(loopGain);
    loopGain.connect(audioContext.destination);
}

async function captureScreenshot(imageQuality = 'medium', isManual = false) {
    console.log(`Capturing ${isManual ? 'manual' : 'automated'} screenshot...`);
    if (!mediaStream) return;

    // Lazy init of video element
    if (!hiddenVideo || hiddenVideo.srcObject !== mediaStream) {
        if (hiddenVideo) {
            hiddenVideo.pause();
            hiddenVideo.srcObject = null;
        }
        hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        await hiddenVideo.play();

        await new Promise(resolve => {
            if (hiddenVideo.readyState >= 2) return resolve();
            hiddenVideo.onloadedmetadata = () => resolve();
        });

        // Lazy init of canvas based on video dimensions
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = hiddenVideo.videoWidth;
        offscreenCanvas.height = hiddenVideo.videoHeight;
        offscreenContext = offscreenCanvas.getContext('2d');
    }

    // Check if video is ready
    if (hiddenVideo.readyState < 2) {
        console.warn('Video not ready yet, skipping screenshot');
        return;
    }

    offscreenContext.drawImage(hiddenVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Check if image was drawn properly by sampling a pixel
    const imageData = offscreenContext.getImageData(0, 0, 1, 1);
    const isBlank = imageData.data.every((value, index) => {
        // Check if all pixels are black (0,0,0) or transparent
        return index === 3 ? true : value === 0;
    });

    if (isBlank) {
        console.warn('Screenshot appears to be blank/black');
    }

    let qualityValue;
    switch (imageQuality) {
        case 'high':
            qualityValue = 0.9;
            break;
        case 'medium':
            qualityValue = 0.7;
            break;
        case 'low':
            qualityValue = 0.5;
            break;
        default:
            qualityValue = 0.7; // Default to medium
    }

    offscreenCanvas.toBlob(
        async blob => {
            if (!blob) {
                console.error('Failed to create blob from canvas');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];

                // Validate base64 data
                if (!base64data || base64data.length < 100) {
                    console.error('Invalid base64 data generated');
                    return;
                }

                const result = await ipcRenderer.invoke('send-image-content', {
                    data: base64data,
                });

                if (result.success) {
                    console.log(`Image sent successfully (${offscreenCanvas.width}x${offscreenCanvas.height})`);
                } else {
                    console.error('Failed to send image:', result.error);
                }
            };
            reader.readAsDataURL(blob);
        },
        'image/jpeg',
        qualityValue
    );
}

const MANUAL_SCREENSHOT_PROMPT = `Help me on this page, give me the answer no bs, complete answer.
So if its a code question, give me the approach in few bullet points, then the entire code. Also if theres anything else i need to know, tell me.
If its a question about the website, give me the answer no bs, complete answer.
If its a mcq question, give me the answer no bs, complete answer.`;

async function captureManualScreenshot(imageQuality = null, customPrompt = null) {
    console.log('Manual screenshot triggered');
    const quality = imageQuality || currentImageQuality;

    if (!mediaStream) {
        console.error('No media stream available');
        return;
    }

    // Lazy init of video element
    if (!hiddenVideo || hiddenVideo.srcObject !== mediaStream) {
        if (hiddenVideo) {
            hiddenVideo.pause();
            hiddenVideo.srcObject = null;
        }
        hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        await hiddenVideo.play();

        await new Promise(resolve => {
            if (hiddenVideo.readyState >= 2) return resolve();
            hiddenVideo.onloadedmetadata = () => resolve();
        });

        // Lazy init of canvas based on video dimensions
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = hiddenVideo.videoWidth;
        offscreenCanvas.height = hiddenVideo.videoHeight;
        offscreenContext = offscreenCanvas.getContext('2d');
    }

    // Check if video is ready
    if (hiddenVideo.readyState < 2) {
        console.warn('Video not ready yet, skipping screenshot');
        return;
    }

    // Downscale to max 1280px wide for faster transfer - vision models don't need 4K
    const MAX_WIDTH = 1280;
    const srcW = hiddenVideo.videoWidth;
    const srcH = hiddenVideo.videoHeight;
    let destW = srcW;
    let destH = srcH;
    if (srcW > MAX_WIDTH) {
        destW = MAX_WIDTH;
        destH = Math.round(srcH * (MAX_WIDTH / srcW));
    }
    offscreenCanvas.width = destW;
    offscreenCanvas.height = destH;

    // Draw the current frame to the canvas
    offscreenContext.drawImage(hiddenVideo, 0, 0, destW, destH);

    let qualityValue;
    switch (quality) {
        case 'high':
            qualityValue = 0.85;
            break;
        case 'medium':
            qualityValue = 0.6;
            break;
        case 'low':
            qualityValue = 0.4;
            break;
        default:
            qualityValue = 0.6;
    }

    offscreenCanvas.toBlob(
        async blob => {
            if (!blob) {
                console.error('Failed to create blob from canvas');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];

                if (!base64data || base64data.length < 100) {
                    console.error('Invalid base64 data generated');
                    return;
                }

                console.log(`Sending image: ${destW}x${destH}, ~${Math.round(base64data.length / 1024)}KB`);

                // Send image with prompt to HTTP API (response streams via IPC events)
                const result = await ipcRenderer.invoke('send-image-content', {
                    data: base64data,
                    prompt: customPrompt || MANUAL_SCREENSHOT_PROMPT,
                });

                if (result.success) {
                    console.log(`Image response completed from ${result.model}`);
                    // Response already displayed via streaming events (new-response/update-response)
                } else {
                    console.error('Failed to get image response:', result.error);
                    hideWin.addNewResponse(`Error: ${result.error}`);
                }
            };
            reader.readAsDataURL(blob);
        },
        'image/jpeg',
        qualityValue
    );
}

// Expose functions to global scope for external access
window.captureManualScreenshot = captureManualScreenshot;

function stopCapture() {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }

    if (audioProcessor) {
        audioProcessor.disconnect();
        audioProcessor = null;
    }

    // Clean up microphone audio processor (Linux only)
    if (micAudioProcessor) {
        micAudioProcessor.disconnect();
        micAudioProcessor = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    // Stop macOS audio capture if running
    if (isMacOS) {
        ipcRenderer.invoke('stop-macos-audio').catch(err => {
            console.error('Error stopping macOS audio:', err);
        });
    }

    // Clean up hidden elements
    if (hiddenVideo) {
        hiddenVideo.pause();
        hiddenVideo.srcObject = null;
        hiddenVideo = null;
    }
    offscreenCanvas = null;
    offscreenContext = null;
}

// Send text message to Gemini
async function sendTextMessage(text) {
    if (!text || text.trim().length === 0) {
        console.warn('Cannot send empty text message');
        return { success: false, error: 'Empty message' };
    }

    try {
        const result = await ipcRenderer.invoke('send-text-message', text);
        if (result.success) {
            console.log('Text message sent successfully');
        } else {
            console.error('Failed to send text message:', result.error);
        }
        return result;
    } catch (error) {
        console.error('Error sending text message:', error);
        return { success: false, error: error.message };
    }
}

// Listen for conversation data from main process and save to storage
ipcRenderer.on('save-conversation-turn', async (event, data) => {
    try {
        await storage.saveSession(data.sessionId, { conversationHistory: data.fullHistory });
        console.log('Conversation session saved:', data.sessionId);
    } catch (error) {
        console.error('Error saving conversation session:', error);
    }
});

// Listen for session context (profile info) when session starts
ipcRenderer.on('save-session-context', async (event, data) => {
    try {
        await storage.saveSession(data.sessionId, {
            profile: data.profile,
            customPrompt: data.customPrompt
        });
        console.log('Session context saved:', data.sessionId, 'profile:', data.profile);
    } catch (error) {
        console.error('Error saving session context:', error);
    }
});

// Listen for screen analysis responses (from ctrl+enter)
ipcRenderer.on('save-screen-analysis', async (event, data) => {
    try {
        await storage.saveSession(data.sessionId, {
            screenAnalysisHistory: data.fullHistory,
            profile: data.profile,
            customPrompt: data.customPrompt
        });
        console.log('Screen analysis saved:', data.sessionId);
    } catch (error) {
        console.error('Error saving screen analysis:', error);
    }
});

// Listen for emergency erase command from main process
ipcRenderer.on('clear-sensitive-data', async () => {
    console.log('Clearing all data...');
});

// ── Stealth red-dot cursor ────────────────────────────────────────────────


ipcRenderer.on('set-stealth-state', (_, isStealthActive) => {
    const isHidden = isStealthActive;
    getApp().classList.toggle('cursor-hidden', isHidden);
    document.documentElement.classList.toggle('global-cursor-hidden', isHidden);

    // Inject CSS to hide the OS cursor via pointer-events + cursor:none
    if (!document.getElementById('stealth-cursor-style')) {
        const style = document.createElement('style');
        style.id = 'stealth-cursor-style';
        style.textContent = `
            html.global-cursor-hidden,
            html.global-cursor-hidden body,
            html.global-cursor-hidden * {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    if (isHidden) {
        // Red arrow will be shown by HideWinApp component

        // ── NO CATCHER SHIELD ──────────────────────────────────────────────────
        // MouseBlocker.exe already blocks ALL real OS mouse events (moves, clicks,
        // scroll) at the hook level. A catcher div would only intercept the
        // IPC-forwarded stealth-click events, breaking UI interaction.
        // Clicks, scrolls, and hover are forwarded directly via IPC below.
    } else {

        // Remove any leftover catcher shield from older builds
        const oldCatcher = document.getElementById('stealth-catcher-shield');
        if (oldCatcher) oldCatcher.remove();
    }

    getApp().setStatus(isHidden ? 'Stealth: ON  (red dot = your cursor)' : 'Stealth: OFF');
    setTimeout(() => {
        getApp().setStatus('Ready (Listening...)');
    }, 2000);
});


// Handle shortcuts based on current view
function handleShortcut(shortcutKey) {
    const currentView = hideWin.getCurrentView();

    if (shortcutKey === 'ctrl+enter' || shortcutKey === 'cmd+enter') {
        if (currentView === 'main') {
            hideWin.element().handleStart();
        } else {
            // New Logic: Prefer submitting transcription over taking a screenshot
            const question = (typeof sttAccumulated !== 'undefined') ? sttAccumulated.trim() : '';
            const app = document.querySelector('hide-win-app');
            
            if (question.length > 2 && !sttSubmitting) {
                sttSubmitting = true;
                console.log('[STT] Manually submitting transcription via global shortcut:', question);
                
                // Clear UI immediately for feedback
                if (typeof sttAccumulated !== 'undefined') sttAccumulated = '';
                if (app && typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }
                
                window.hideWin.ipcRenderer.invoke('send-text-message', question)
                    .catch(err => console.error('[STT] Submit error:', err))
                    .finally(() => { sttSubmitting = false; });
            } else {
                console.log('[Shortcut] No transcription text available, falling back to manual screenshot');
                captureManualScreenshot();
            }
        }
    }
}

// Create reference to the main app element
const getApp = () => document.querySelector('hide-win-app');

// ============ THEME SYSTEM ============
const theme = {
    themes: {
        dark: {
            background: '#1f2937',
            text: '#f9fafb', textSecondary: '#9ca3af', textMuted: '#6b7280',
            border: '#374151', accent: '#3b82f6',
            btnPrimaryBg: '#3b82f6', btnPrimaryText: '#ffffff', btnPrimaryHover: '#2563eb',
            tooltipBg: '#111827', tooltipText: '#f9fafb',
            keyBg: 'rgba(255,255,255,0.1)'
        },
        light: {
            background: '#ffffff',
            text: '#1a1a1a', textSecondary: '#555555', textMuted: '#888888',
            border: '#e0e0e0', accent: '#000000',
            btnPrimaryBg: '#1a1a1a', btnPrimaryText: '#ffffff', btnPrimaryHover: '#333333',
            tooltipBg: '#1a1a1a', tooltipText: '#ffffff',
            keyBg: 'rgba(0,0,0,0.1)'
        },
        midnight: {
            background: '#0d1117',
            text: '#c9d1d9', textSecondary: '#8b949e', textMuted: '#6e7681',
            border: '#30363d', accent: '#58a6ff',
            btnPrimaryBg: '#58a6ff', btnPrimaryText: '#0d1117', btnPrimaryHover: '#79b8ff',
            tooltipBg: '#161b22', tooltipText: '#c9d1d9',
            keyBg: 'rgba(88,166,255,0.15)'
        },
        sepia: {
            background: '#f4ecd8',
            text: '#5c4b37', textSecondary: '#7a6a56', textMuted: '#998875',
            border: '#d4c8b0', accent: '#8b4513',
            btnPrimaryBg: '#5c4b37', btnPrimaryText: '#f4ecd8', btnPrimaryHover: '#7a6a56',
            tooltipBg: '#5c4b37', tooltipText: '#f4ecd8',
            keyBg: 'rgba(92,75,55,0.15)'
        },
        catppuccin: {
            background: '#1e1e2e',
            text: '#cdd6f4', textSecondary: '#a6adc8', textMuted: '#585b70',
            border: '#313244', accent: '#cba6f7',
            btnPrimaryBg: '#cba6f7', btnPrimaryText: '#1e1e2e', btnPrimaryHover: '#b4befe',
            tooltipBg: '#313244', tooltipText: '#cdd6f4',
            keyBg: 'rgba(203,166,247,0.12)'
        },
        gruvbox: {
            background: '#1d2021',
            text: '#ebdbb2', textSecondary: '#a89984', textMuted: '#665c54',
            border: '#3c3836', accent: '#fe8019',
            btnPrimaryBg: '#fe8019', btnPrimaryText: '#1d2021', btnPrimaryHover: '#fabd2f',
            tooltipBg: '#3c3836', tooltipText: '#ebdbb2',
            keyBg: 'rgba(254,128,25,0.12)'
        },
        rosepine: {
            background: '#191724',
            text: '#e0def4', textSecondary: '#908caa', textMuted: '#6e6a86',
            border: '#26233a', accent: '#ebbcba',
            btnPrimaryBg: '#ebbcba', btnPrimaryText: '#191724', btnPrimaryHover: '#f6c177',
            tooltipBg: '#26233a', tooltipText: '#e0def4',
            keyBg: 'rgba(235,188,186,0.12)'
        },
        solarized: {
            background: '#002b36',
            text: '#93a1a1', textSecondary: '#839496', textMuted: '#586e75',
            border: '#073642', accent: '#2aa198',
            btnPrimaryBg: '#2aa198', btnPrimaryText: '#002b36', btnPrimaryHover: '#268bd2',
            tooltipBg: '#073642', tooltipText: '#93a1a1',
            keyBg: 'rgba(42,161,152,0.12)'
        },
        tokyonight: {
            background: '#1a1b26',
            text: '#c0caf5', textSecondary: '#9aa5ce', textMuted: '#565f89',
            border: '#292e42', accent: '#7aa2f7',
            btnPrimaryBg: '#7aa2f7', btnPrimaryText: '#1a1b26', btnPrimaryHover: '#bb9af7',
            tooltipBg: '#292e42', tooltipText: '#c0caf5',
            keyBg: 'rgba(122,162,247,0.12)'
        },
    },

    current: 'dark',

    get(name) {
        return this.themes[name] || this.themes.dark;
    },

    getAll() {
        const names = {
            dark: 'Dark',
            light: 'Light',
            midnight: 'Midnight Blue',
            sepia: 'Sepia',
            catppuccin: 'Catppuccin Mocha',
            gruvbox: 'Gruvbox Dark',
            rosepine: 'Ros\u00e9 Pine',
            solarized: 'Solarized Dark',
            tokyonight: 'Tokyo Night'
        };
        return Object.keys(this.themes).map(key => ({
            value: key,
            name: names[key] || key,
            colors: this.themes[key]
        }));
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 30, g: 30, b: 30 };
    },

    lightenColor(rgb, amount) {
        return {
            r: Math.min(255, rgb.r + amount),
            g: Math.min(255, rgb.g + amount),
            b: Math.min(255, rgb.b + amount)
        };
    },

    darkenColor(rgb, amount) {
        return {
            r: Math.max(0, rgb.r - amount),
            g: Math.max(0, rgb.g - amount),
            b: Math.max(0, rgb.b - amount)
        };
    },

    applyBackgrounds(backgroundColor, alpha = 0.8) {
        const root = document.documentElement;
        const baseRgb = this.hexToRgb(backgroundColor);

        // For light themes, darken; for dark themes, lighten
        const isLight = (baseRgb.r + baseRgb.g + baseRgb.b) / 3 > 128;
        const adjust = isLight ? this.darkenColor.bind(this) : this.lightenColor.bind(this);

        const secondary = adjust(baseRgb, 10);
        const tertiary = adjust(baseRgb, 22);
        const hover = adjust(baseRgb, 28);

        const bgBase = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${alpha})`;
        const bgSurface = `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${alpha})`;
        const bgElevated = `rgba(${tertiary.r}, ${tertiary.g}, ${tertiary.b}, ${alpha})`;
        const bgHover = `rgba(${hover.r}, ${hover.g}, ${hover.b}, ${alpha})`;

        // New design tokens (used by components)
        root.style.setProperty('--bg-app', bgBase);
        root.style.setProperty('--bg-surface', bgSurface);
        root.style.setProperty('--bg-elevated', bgElevated);
        root.style.setProperty('--bg-hover', bgHover);

        // Legacy aliases
        root.style.setProperty('--header-background', bgBase);
        root.style.setProperty('--main-content-background', bgBase);
        root.style.setProperty('--bg-primary', bgBase);
        root.style.setProperty('--bg-secondary', bgSurface);
        root.style.setProperty('--bg-tertiary', bgElevated);
        root.style.setProperty('--input-background', bgElevated);
        root.style.setProperty('--input-focus-background', bgElevated);
        root.style.setProperty('--hover-background', bgHover);
        root.style.setProperty('--scrollbar-background', bgBase);
        
        // Apply color-scheme dynamically for native elements (like select, scrollbars)
        root.style.colorScheme = isLight ? 'light' : 'dark';
        root.style.setProperty('--color-scheme', isLight ? 'light' : 'dark');
        
        // Also tell the main process to update native OS dialogs (like file browser)
        if (window.hideWin && window.hideWin.ipcRenderer) {
            window.hideWin.ipcRenderer.invoke('set-native-theme', isLight ? 'light' : 'dark').catch(e => console.error('Failed to set native theme', e));
        }
        
        // Dynamically adjust scrollbar thumbs
        if (isLight) {
            root.style.setProperty('--scrollbar-thumb', 'rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(0, 0, 0, 0.4)');
        } else {
            root.style.setProperty('--scrollbar-thumb', 'rgba(255, 255, 255, 0.15)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(255, 255, 255, 0.3)');
        }
    },

    apply(themeName, alpha = 0.8) {
        const colors = this.get(themeName);
        this.current = themeName;
        const root = document.documentElement;

        // New design tokens (used by components)
        root.style.setProperty('--text-primary', colors.text);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--text-muted', colors.textMuted);
        root.style.setProperty('--border', colors.border);
        root.style.setProperty('--border-strong', colors.accent);
        root.style.setProperty('--accent', colors.btnPrimaryBg);
        root.style.setProperty('--accent-hover', colors.btnPrimaryHover);

        // Legacy aliases
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--border-color', colors.border);
        root.style.setProperty('--border-default', colors.accent);
        root.style.setProperty('--placeholder-color', colors.textMuted);
        root.style.setProperty('--scrollbar-thumb', colors.border);
        root.style.setProperty('--scrollbar-thumb-hover', colors.textMuted);
        root.style.setProperty('--key-background', colors.keyBg);
        // Primary button
        root.style.setProperty('--btn-primary-bg', colors.btnPrimaryBg);
        root.style.setProperty('--btn-primary-text', colors.btnPrimaryText);
        root.style.setProperty('--btn-primary-hover', colors.btnPrimaryHover);
        // Start button (same as primary)
        root.style.setProperty('--start-button-background', colors.btnPrimaryBg);
        root.style.setProperty('--start-button-color', colors.btnPrimaryText);
        root.style.setProperty('--start-button-hover-background', colors.btnPrimaryHover);
        // Tooltip
        root.style.setProperty('--tooltip-bg', colors.tooltipBg);
        root.style.setProperty('--tooltip-text', colors.tooltipText);
        // Error color (stays constant)
        root.style.setProperty('--error-color', '#f14c4c');
        root.style.setProperty('--success-color', '#4caf50');

        // Also apply background colors from theme
        this.applyBackgrounds(colors.background, alpha);
    },

    async load() {
        try {
            const prefs = await storage.getPreferences();
            const urlParams = new URLSearchParams(window.location.search);
            const windowType = urlParams.get('windowType') || 'main';
            const defaultTheme = windowType === 'session' ? 'dark' : 'light';
            const themeKey = windowType === 'session' ? 'themeSession' : 'themeMain';
            const themeName = prefs[themeKey] || defaultTheme;
            
            const transKey = windowType === 'session' ? 'transparencySession' : 'transparencyMain';
            const defaultTrans = windowType === 'session' ? 0.3 : 0.95;
            const alpha = prefs[transKey] !== undefined ? prefs[transKey] : defaultTrans;
            
            const fontKey = windowType === 'session' ? 'fontSizeSession' : 'fontSizeMain';
            const fontSize = prefs[fontKey] || 14;
            document.documentElement.style.setProperty('--response-font-size', `${fontSize}px`);

            this.apply(themeName, alpha);
            return themeName;
        } catch (err) {
            const urlParams = new URLSearchParams(window.location.search);
            const windowType = urlParams.get('windowType') || 'main';
            const defaultTheme = windowType === 'session' ? 'dark' : 'light';
            this.apply(defaultTheme);
            return defaultTheme;
        }
    },

    async save(themeName) {
        const urlParams = new URLSearchParams(window.location.search);
        const windowType = urlParams.get('windowType') || 'main';
        const themeKey = windowType === 'session' ? 'themeSession' : 'themeMain';
        await storage.updatePreference(themeKey, themeName);
        this.apply(themeName);
    }
};

// Consolidated hideWin object - all functions in one place
const hideWin = {
    storage,
    getVersion: async () => ipcRenderer.invoke('get-app-version'),
    openPath: async (filePath) => ipcRenderer.invoke('open-path', filePath),
    convertToPdf: async (filePath) => ipcRenderer.invoke('convert-to-pdf', filePath),
    convertExcelToHtml: async (filePath) => ipcRenderer.invoke('convert-excel-to-html', filePath),

    // Element access
    element: getApp,
    e: getApp,

    // App state functions - access properties directly from the app element
    getCurrentView: () => getApp()?.currentView,
    getLayoutMode: () => getApp()?.layoutMode,

    // Status and response functions
    setStatus: text => getApp()?.setStatus(text),
    addNewResponse: response => getApp()?.addNewResponse(response),
    updateCurrentResponse: response => getApp()?.updateCurrentResponse(response),

    // Core functionality
    initializeGemini,
    initializeCloud,
    initializeLocal,
    setTranscriptionLanguage,
    startCapture,
    stopCapture,
    sendTextMessage,
    handleShortcut,

    // Storage API
    storage,

    // Theme API
    theme,

    // Expose ipcRenderer for deep link events
    ipcRenderer,

    // Refresh preferences cache (call after updating preferences)
    refreshPreferencesCache: loadPreferencesCache,

    // Platform detection
    isLinux: isLinux,
    isMacOS: isMacOS,
};

// Make it globally available
window.hideWin = hideWin;

// Load theme after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => theme.load());
} else {
    theme.load();
}



// ── Vosk Live Transcription Handler ──────────────────────────────────────────
// Partials  → display live word-by-word in overlay (instant feedback)
// Finals    → already LLM-cleaned by backend intent reconstructor
//             → accumulate for 1.2s silence → submit as AI question
//
// The backend sends: { transcript, is_final, raw? }
//   is_final: false → partial, just update display
//   is_final: true  → cleaned final, accumulate then submit

let sttSilenceTimer = null;
let sttAccumulated = '';    // accumulates cleaned Final segments
let sttSubmitting = false;

window.hideWin.ipcRenderer.on('live-transcription', async (_event, payload) => {
    if (!payload || typeof payload.text !== 'string') return;

    const { text, isFinal } = payload;
    const app = document.querySelector('hide-win-app');

    if (!isFinal) {
        // ── Partial: show live display (accumulated finals + current partial)
        const displayText = (sttAccumulated + ' ' + text).trim();
        if (app && typeof app.updateLiveTranscription === 'function') {
            app.updateLiveTranscription(displayText);
        }
        return;
    }

    // ── Final (LLM-cleaned by backend) ───────────────────────────────────────

    sttAccumulated = (sttAccumulated + ' ' + text).trim();

    // Show accumulated so far
    if (app && typeof app.updateLiveTranscription === 'function') {
        app.updateLiveTranscription(sttAccumulated);
    }

    // Auto-submit after 1.5 seconds of silence (splits blocks automatically)
    if (sttSilenceTimer) clearTimeout(sttSilenceTimer);
    sttSilenceTimer = setTimeout(async () => {
        const question = sttAccumulated.trim();
        if (question.length > 2 && !sttSubmitting) {
            sttSubmitting = true;
            console.log('[STT] Auto-submitting due to silence:', question);
            sttAccumulated = '';
            
            const questionWithPunctuation = ensureQuestionMark(question);
            
            if (app) {
                if (typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }

            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', questionWithPunctuation);
            } catch (err) {
                console.error('[STT] Auto-Submit error:', err);
            } finally {
                sttSubmitting = false;
            }
        }
    }, 1500);

});


// --- Ctrl + Enter Manual Submission Logic ---
window.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        const app = document.querySelector('hide-win-app');
        const question = sttAccumulated.trim();
        
        if (question.length > 2 && !sttSubmitting) {
            sttSubmitting = true;
            console.log('[STT] Manually submitting question:', question);
            
            // Clear UI immediately for feedback
            sttAccumulated = '';
            
            const questionWithPunctuation = ensureQuestionMark(question);
            
            if (app) {
                if (typeof app.updateLiveTranscription === 'function') {
                    app.updateLiveTranscription('');
                }
            }
            
            try {
                await window.hideWin.ipcRenderer.invoke('send-text-message', questionWithPunctuation);
            } catch (err) {
                console.error('[STT] Submit error:', err);
            } finally {
                sttSubmitting = false;
            }
        }
    }
});
/**
 * Vanilla JS adaptation of the Silero VAD audio recorder.
 * Designed to drop into Hide-Win-Master/src/utils/renderer.js
 * 
 * Dependencies (to be loaded in index.html):
 * <script src="assets/ort.min.js"></script>
 * <script src="assets/vad-bundle.js"></script>
 */

// Helper: Convert 16kHz PCM Float32Array from Silero VAD into standard WAV Blob
// float32ToWavBlob moved to audioUtils.js




let vadInstance = null;

async function initSileroVAD(mediaStream) {
    console.log("Initializing Silero VAD...");
    
    // We must pass the correct base URL for WASM assets
    // Since we copied them to src/assets, we configure ort:
    window.ort = window.ort || {};
    window.ort.env = window.ort.env || {};
    window.ort.env.wasm = window.ort.env.wasm || {};
    const path = require('path');
    const rootDir = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    window.ort.env.wasm.wasmPaths = rootDir + 'assets/';
    window.ort.env.wasm.numThreads = 1;

    try {
        const fs = require('fs');
        let wasmFilePath = rootDir.replace('file:///', '');
        if (process.platform === 'win32') {
            wasmFilePath = wasmFilePath.replace(/\//g, '\\');
        }
        wasmFilePath = decodeURIComponent(wasmFilePath);
        wasmFilePath = path.join(wasmFilePath, 'assets', 'ort-wasm-simd.wasm');
        
        console.log('[Renderer] Preloading WASM binary from:', wasmFilePath);
        const wasmBuffer = fs.readFileSync(wasmFilePath);
        const wasmArrayBuffer = wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength);
        
        // Feed the ArrayBuffer directly to Emscripten so it doesn't try to fetch it via XHR
        window.ort.env.wasm.wasmBinary = new Uint8Array(wasmArrayBuffer);
    } catch (e) {
        console.error('[Renderer] Failed to preload WASM binary:', e);
    }

    try {
        vadInstance = await vad.MicVAD.new({
            stream: mediaStream,
            baseAssetPath: rootDir,
            workletURL: rootDir + 'assets/vad.worklet.bundle.min.js',
            modelURL: rootDir + 'silero_vad_legacy.onnx',
            positiveSpeechThreshold: 0.6,
            negativeSpeechThreshold: 0.35,
            redemptionFrames: 5,
            minSpeechFrames: 3,
            
            onSpeechStart: () => {
                console.log("VAD: Speech started");
                // Update Overlay UI state via HideWinApp
                document.getElementById('appRoot')?.shadowRoot.querySelector('assistant-view')?.setStatus('Listening...');
            },

            onSpeechEnd: async (audioFloat32) => {
                console.log("VAD: Speech ended. Processing audio...");
                document.getElementById('appRoot')?.shadowRoot.querySelector('assistant-view')?.setStatus('Processing audio...');

                const wavBlob = float32ToWavBlob(audioFloat32, 16000);
                const formData = new FormData();
                formData.append('file', wavBlob, 'speech_input.wav');
                
                try {
                    // Fetch Groq key and selected STT model from local Electron storage
                    const result = await require('electron').ipcRenderer.invoke('storage:get-groq-api-key');
                    const groqKey = result.success ? result.data : '';

                    // Send directly to our new FastAPI proxy!
                    
                    const response = await fetch('http://localhost:8000/api/ai-proxy/stream-audio-to-llm', {
                        method: 'POST',
                        headers: {
                            'X-STT-Model': getSettings().transcriptionModel || 'whisper-large-v3-turbo'
                        },
                        body: formData
                    });

                    if (!response.ok)
 throw new Error(`Proxy error: ${response.statusText}`);
                    
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        // Dispatch token chunk to the UI
                        window.dispatchEvent(new CustomEvent('ai-token-stream', { detail: chunk }));
                    }
                } catch (err) {
                    console.error("VAD Processing Error:", err);
                }
            },
            
            onVADMisfire: () => {
                console.log("VAD: Misfire (Noise discarded)");
            }
        });
        
        vadInstance.start();
        console.log("VAD started");
    } catch (error) {
        console.error("Failed to initialize VAD:", error);
    }
}

// Auto-start for debugging
setTimeout(() => { 
    console.log("SharedArrayBuffer is:", typeof SharedArrayBuffer);
    console.log("Auto-starting capture for debug");
    if (typeof startCapture === 'function') startCapture();
}, 4000);
