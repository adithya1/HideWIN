const { GoogleGenAI, Modality } = require('@google/genai');
const { BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { saveDebugAudio } = require('../audioUtils');
const { getSystemPrompt, getTokenBudget } = require('./prompts');
const storage = require('../storage');
const { getAvailableModel, incrementLimitCount, getApiKey, getGroqApiKey, incrementCharUsage, getModelForToday, GEMINI_MODEL_FALLBACK_LIST } = storage;
const { connectCloud, sendCloudAudio, sendCloudText, sendCloudImage, closeCloud, isCloudActive, setOnTurnComplete } = require('./cloud');

// Lazy-loaded to avoid circular dependency (localai.js imports from gemini.js)
let _localai = null;
function getLocalAi() {
    if (!_localai) _localai = require('./localai');
    return _localai;
}

const { sendToAiProxy } = require('./ai_proxy_client');

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




const { formatSpeakerResults, stripThinkingTags, extractInterviewerQuestion, trimConversationHistoryForGemma } = require('./gemini.textutils');


// Provider mode: 'byok', 'cloud', or 'local'
let currentProviderMode = 'byok';

// Groq conversation history for context
let groqConversationHistory = [];

// Conversation tracking variables
let currentSessionId = null;
let currentTranscription = '';
let transcriptionSilenceTimer = null;
let conversationHistory = [];
let screenAnalysisHistory = [];
let currentProfile = null;
let currentCustomPrompt = null;
let isInitializingSession = false;
let currentSystemPrompt = null;

// Maps human-readable profile types to prompt keys
const PROFILE_TYPE_TO_PROMPT_KEY = {
    'job interview': 'interview',
    'interview': 'interview',
    'sales call': 'sales',
    'sales': 'sales',
    'business meeting': 'meeting',
    'meeting': 'meeting',
    'presentation': 'presentation',
    'negotiation': 'negotiation',
    'exam': 'exam',
};

/**
 * Resolves the active profile from storage and builds the complete context prompt.
 * Handles all profile ID formats: UUID-style IDs, numeric IDs, type names, and legacy keys.
 * Uses structured resumeContent + jdContent for grounding (avoids customPrompt duplication).
 * Caps total context to ~20K chars for fast 2-second responses.
 * @returns {{ promptKey: string, fullPromptContext: string, profileName: string }}
 */
function resolveProfileContext() {
    let selectedProfileKey = currentProfile;
    if (!selectedProfileKey) {
        try {
            const prefs = storage.getPreferences();
            selectedProfileKey = prefs.selectedProfile || 'interview';
        } catch (e) {
            selectedProfileKey = 'interview';
        }
    }

    let promptKey = 'interview'; // default
    let fullPromptContext = currentCustomPrompt || '';
    let profileName = selectedProfileKey;

    try {
        const profiles = storage.getProfiles();
        // Robust fuzzy profile matching
        const found = profiles.find(p => {
            if (p.id === selectedProfileKey) return true;
            if (String(p.numericId) === String(selectedProfileKey)) return true;
            if (p.type === selectedProfileKey) return true;
            // Fuzzy: match lowercase type prefix (e.g., 'interview' matches 'Job Interview')
            const typeLower = (p.type || '').toLowerCase();
            const keyLower = (selectedProfileKey || '').toLowerCase();
            if (typeLower.includes(keyLower) || keyLower.includes(typeLower)) return true;
            return false;
        });

        // If no match by key, just use the first profile (user likely only has one)
        const profile = found || (profiles.length > 0 ? profiles[0] : null);

        if (profile) {
            profileName = profile.userName || profile.type || selectedProfileKey;
            // Map type to prompt key
            const typeLower = (profile.type || '').toLowerCase();
            promptKey = PROFILE_TYPE_TO_PROMPT_KEY[typeLower] || 'interview';

            // Build context from structured fields ONLY (avoid customPrompt duplication)
            // customPrompt is typically resume+JD concatenated, so using both would triple the context
            const hasStructuredData = (profile.resumeContent && profile.resumeContent.trim()) ||
                                      (profile.jdContent && profile.jdContent.trim());

            const parts = [];
            if (hasStructuredData) {
                // Use structured fields — cleaner and avoids duplication
                if (profile.resumeContent && profile.resumeContent.trim()) {
                    parts.push(`=== CANDIDATE RESUME / CV / EXPERIENCE ===\n${profile.resumeContent.trim()}`);
                }
                if (profile.jdContent && profile.jdContent.trim()) {
                    parts.push(`=== TARGET JOB DESCRIPTION / MEETING AGENDA / REFERENCE DOCUMENT ===\n${profile.jdContent.trim()}`);
                }
            } else if (profile.customPrompt && profile.customPrompt.trim()) {
                // Fallback: only use customPrompt if no structured fields exist
                parts.push(profile.customPrompt.trim());
            }

            let combinedContext = parts.join('\n\n');

            // Cap total context at ~20K chars for fast responses (avoids 429 rate limits)
            const MAX_CONTEXT_CHARS = 20000;
            if (combinedContext.length > MAX_CONTEXT_CHARS) {
                // Prioritize: keep JD in full (shorter), truncate resume proportionally
                const jdText = (profile.jdContent || '').trim();
                const resumeText = (profile.resumeContent || '').trim();
                const jdLen = jdText.length;
                const resumeBudget = MAX_CONTEXT_CHARS - jdLen - 200; // 200 chars for headers

                if (resumeBudget > 2000 && resumeText) {
                    combinedContext = `=== CANDIDATE RESUME / CV / EXPERIENCE (KEY SECTIONS) ===\n${resumeText.substring(0, resumeBudget)}\n...[truncated for speed]\n\n=== TARGET JOB DESCRIPTION / MEETING AGENDA / REFERENCE DOCUMENT ===\n${jdText}`;
                } else {
                    combinedContext = combinedContext.substring(0, MAX_CONTEXT_CHARS);
                }
            }

            fullPromptContext = combinedContext;

            console.log(`[Profile Grounding] Resolved: "${profileName}" (${profile.type} → ${promptKey}) | Context: ${fullPromptContext.length} chars (Resume: ${(profile.resumeContent || '').length}, JD: ${(profile.jdContent || '').length})`);
        } else {
            console.warn(`[Profile Grounding] No profile found for key: ${selectedProfileKey}`);
        }
    } catch (e) {
        console.warn('[Profile Grounding] Error resolving profile:', e.message);
    }

    return { promptKey, fullPromptContext, profileName };
}

// formatSpeakerResults -> see gemini.textutils.js

module.exports.formatSpeakerResults = formatSpeakerResults;

// Audio capture variables
let systemAudioProc = null;
let messageBuffer = '';


// Reconnection variables
let isUserClosing = false;
let sessionParams = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000;

function sendToRenderer(channel, data) {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
        if (win && !win.isDestroyed()) {
            win.webContents.send(channel, data);
        }
    });
}

// Build context message for session restoration
function buildContextMessage() {
    const lastTurns = conversationHistory.slice(-20);
    const validTurns = lastTurns.filter(turn => turn.transcription?.trim() && turn.ai_response?.trim());

    if (validTurns.length === 0) return null;

    const contextLines = validTurns.map(turn =>
        `[Interviewer]: ${turn.transcription.trim()}\n[Your answer]: ${turn.ai_response.trim()}`
    );

    return `Session reconnected. Here's the conversation so far:\n\n${contextLines.join('\n\n')}\n\nContinue from here.`;
}

// Conversation management functions
function initializeNewSession(profile = null, customPrompt = null) {
    currentSessionId = Date.now().toString();
    currentTranscription = '';
    conversationHistory = [];
    screenAnalysisHistory = [];
    groqConversationHistory = [];
    currentProfile = profile;
    currentCustomPrompt = customPrompt;
    console.log('New conversation session started:', currentSessionId, 'profile:', profile);

    // Save initial session with profile context
    if (profile) {
        storage.saveSession(currentSessionId, {
            profile: profile,
            customPrompt: customPrompt || ''
        });
    }
}

function saveConversationTurn(transcription, aiResponse) {
    if (!currentSessionId) {
        initializeNewSession();
    }

    const conversationTurn = {
        timestamp: Date.now(),
        transcription: transcription.trim(),
        ai_response: aiResponse.trim(),
    };

    conversationHistory.push(conversationTurn);
    console.log('Saved conversation turn:', conversationTurn);

    // Save directly to storage
    storage.saveSession(currentSessionId, {
        conversationHistory: conversationHistory
    });
}

function saveScreenAnalysis(prompt, response, model) {
    if (!currentSessionId) {
        initializeNewSession();
    }

    const analysisEntry = {
        timestamp: Date.now(),
        prompt: prompt,
        response: response.trim(),
        model: model
    };

    screenAnalysisHistory.push(analysisEntry);
    console.log('Saved screen analysis:', analysisEntry);

    // Save directly to storage
    storage.saveSession(currentSessionId, {
        screenAnalysisHistory: screenAnalysisHistory,
        profile: currentProfile,
        customPrompt: currentCustomPrompt
    });
}

function getCurrentSessionData() {
    return {
        sessionId: currentSessionId,
        history: conversationHistory,
    };
}

async function getEnabledTools() {
    const tools = [];

    // Check if Google Search is enabled (default: true)
    const googleSearchEnabled = await getStoredSetting('googleSearchEnabled', 'true');
    console.log('Google Search enabled:', googleSearchEnabled);

    if (googleSearchEnabled === 'true') {
        tools.push({ googleSearch: {} });
        console.log('Added Google Search tool');
    } else {
        console.log('Google Search tool disabled');
    }

    return tools;
}

async function getStoredSetting(key, defaultValue) {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            // Wait a bit for the renderer to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Try to get setting from renderer process localStorage
            const value = await windows[0].webContents.executeJavaScript(`
                (function() {
                    try {
                        if (typeof localStorage === 'undefined') {
                            console.log('localStorage not available yet for ${key}');
                            return '${defaultValue}';
                        }
                        const stored = localStorage.getItem('${key}');
                        console.log('Retrieved setting ${key}:', stored);
                        return stored || '${defaultValue}';
                    } catch (e) {
                        console.error('Error accessing localStorage for ${key}:', e);
                        return '${defaultValue}';
                    }
                })()
            `);
            return value;
        }
    } catch (error) {
        console.error('Error getting stored setting for', key, ':', error.message);
    }
    console.log('Using default value for', key, ':', defaultValue);
    return defaultValue;
}

// helper to check if groq has been configured
function hasGroqKey() {
    const key = getGroqApiKey();
    return key && key.trim() != ''
}

// trimConversationHistoryForGemma -> see gemini.textutils.js

// stripThinkingTags -> see gemini.textutils.js

// extractInterviewerQuestion -> see gemini.textutils.js

async function sendToGroq(transcription) {
    if (!transcription || transcription.trim() === '') {
        console.log('Empty transcription, skipping Groq');
        return;
    }

    const cleanQuestion = extractInterviewerQuestion(transcription);
    console.log(`Sending to Secure Proxy (Tier: Premium):`, cleanQuestion.substring(0, 100) + '...');

    groqConversationHistory.push({
        role: 'user',
        content: cleanQuestion
    });

    if (groqConversationHistory.length > 20) {
        groqConversationHistory = groqConversationHistory.slice(-20);
    }

    try {
        const fullPrompt = `${currentSystemPrompt || 'You are a helpful assistant.'}\n\nHistory:\n${JSON.stringify(groqConversationHistory)}\n\nUser: ${cleanQuestion}`;
        
        sendToRenderer('update-status', 'Generating response via Proxy...');
        
        const responseData = await sendToAiProxy(fullPrompt, 'premium', currentSystemPrompt);
        const cleanedResponse = stripThinkingTags(responseData.text || '');

        if (cleanedResponse) {
            sendToRenderer('new-response', {
                question: cleanQuestion,
                answer: cleanedResponse
            });

            groqConversationHistory.push({
                role: 'assistant',
                content: cleanedResponse
            });

            saveConversationTurn(transcription, cleanedResponse);
        }

        console.log(`Secure Proxy response completed (${responseData.model})`);
        sendToRenderer('update-status', 'Listening...');

    } catch (error) {
        console.error('Error calling Secure Proxy:', error);
        sendToRenderer('update-status', 'Proxy Error, falling back to Fast Tier...');
        sendToGemma(transcription); // Fallback to fast tier
    }
}

async function sendToGemma(transcription) {
    if (!transcription || transcription.trim() === '') {
        console.log('Empty transcription, skipping Fast Tier');
        return;
    }

    console.log('Sending to Secure Proxy (Tier: Fast):', transcription.substring(0, 100) + '...');

    groqConversationHistory.push({
        role: 'user',
        content: transcription.trim()
    });

    try {
        const fullPrompt = `${currentSystemPrompt || 'You are a helpful assistant.'}\n\nUser: ${transcription}`;
        
        sendToRenderer('update-status', 'Generating response via Proxy...');
        
        const responseData = await sendToAiProxy(fullPrompt, 'fast', currentSystemPrompt);
        let fullText = responseData.text || '';

        sendToRenderer('new-response', {
            question: transcription,
            answer: fullText
        });

        if (fullText.trim()) {
            groqConversationHistory.push({
                role: 'assistant',
                content: fullText.trim()
            });

            if (groqConversationHistory.length > 40) {
                groqConversationHistory = groqConversationHistory.slice(-40);
            }

            saveConversationTurn(transcription, fullText);
        }

        console.log(`Secure Proxy response completed (${responseData.model})`);
        sendToRenderer('update-status', 'Listening...');

    } catch (error) {
        console.error('Error calling Secure Proxy:', error);
        sendToRenderer('update-status', 'Proxy error: ' + error.message);
    }
}

async function initializeGeminiSession(apiKey, customPrompt = '', profile = 'interview', language = 'en-US', isReconnect = false, modeCategory = '') {
    if (isInitializingSession) {
        console.log('Session initialization already in progress');
        return false;
    }

    isInitializingSession = true;
    if (!isReconnect) {
        sendToRenderer('session-initializing', true);
    }

    // Store params for reconnection
    if (!isReconnect) {
        sessionParams = { apiKey, customPrompt, profile, language, modeCategory };
        reconnectAttempts = 0;
    }

    const client = new GoogleGenAI({
        vertexai: false,
        apiKey: apiKey,
        httpOptions: { apiVersion: 'v1alpha' },
    });

    // Get enabled tools first to determine Google Search status
    const enabledTools = await getEnabledTools();
    const googleSearchEnabled = enabledTools.some(tool => tool.googleSearch);

    const systemPrompt = getSystemPrompt(profile, customPrompt, googleSearchEnabled, modeCategory);
    currentSystemPrompt = systemPrompt; // Store for Groq
    // Store token budget for this session based on mode
    const tokenBudget = getTokenBudget(modeCategory, profile);
    console.log(`[Gemini] Mode: ${modeCategory || 'default'}, Token budget: ${tokenBudget}`);

    // Initialize new conversation session only on first connect
    if (!isReconnect) {
        initializeNewSession(profile, customPrompt);
    }

    try {
        // The Gemini Live WebSocket models (native-audio) now strictly enforce Modality.AUDIO and do not reliably return text.
        // We throw an error immediately to force the app to gracefully degrade to the highly reliable HTTP Streaming mode
        // which uses processAccumulatedOralAudio() with gemini-2.5-flash.
        throw new Error('Forcing HTTP Streaming mode for stable text responses');
        const session = await client.live.connect({
            model: 'gemini-2.5-flash-native-audio-latest',
            callbacks: {
                onopen: function () {
                    sendToRenderer('update-status', 'Live session connected');
                },
                onmessage: function (message) {
                    console.log('----------------', message);

                    // 1. Handle input transcription (what was spoken by interviewer/user)
                    let textArrived = false;
                    if (message.serverContent?.inputTranscription?.results) {
                        const formatted = formatSpeakerResults(message.serverContent.inputTranscription.results);
                        if (formatted) {
                            currentTranscription += formatted;
                            textArrived = true;
                        }
                    } else if (message.serverContent?.inputTranscription?.text) {
                        const text = message.serverContent.inputTranscription.text;
                        if (text.trim() !== '') {
                            currentTranscription += text;
                            textArrived = true;
                        }
                    }

                    // 2. Handle AI output response streaming chunks
                    let responseChunk = '';
                    if (message.serverContent?.outputTranscription?.text) {
                        responseChunk += message.serverContent.outputTranscription.text;
                    } else if (message.serverContent?.modelTurn?.parts) {
                        for (const part of message.serverContent.modelTurn.parts) {
                            if (part.text) {
                                responseChunk += part.text;
                            }
                        }
                    }

                    if (responseChunk) {
                        const isNew = messageBuffer.length === 0;
                        messageBuffer += responseChunk;
                        sendToRenderer(isNew ? 'new-response' : 'update-response', {
                            question: currentTranscription || 'Live Question',
                            answer: messageBuffer
                        });
                    }

                    if (textArrived) {
                        if (transcriptionSilenceTimer) clearTimeout(transcriptionSilenceTimer);
                        transcriptionSilenceTimer = setTimeout(() => {
                            if (currentTranscription.trim() !== '' && messageBuffer.trim() === '') {
                                console.log('Speech silence detected — triggering Gemini fallback response!');
                                const textToProcess = currentTranscription;
                                sendToGemma(textToProcess);
                            }
                        }, 1000);
                    }

                    if (message.serverContent?.generationComplete || message.serverContent?.turnComplete) {
                        if (transcriptionSilenceTimer) {
                            clearTimeout(transcriptionSilenceTimer);
                            transcriptionSilenceTimer = null;
                        }
                        if (messageBuffer.trim() !== '') {
                            saveConversationTurn(currentTranscription || 'Live Question', messageBuffer);
                        }
                        messageBuffer = '';
                        currentTranscription = '';
                        sendToRenderer('update-status', 'Listening...');
                    }
                },
                onerror: function (e) {
                    console.log('Session error:', e.message);
                    sendToRenderer('update-status', 'Listening...');
                },
                onclose: function (e) {
                    console.log('Session closed:', e.reason);
                    geminiSessionRef.current = null;
                    if (isUserClosing) {
                        isUserClosing = false;
                        sendToRenderer('update-status', 'Session closed');
                        return;
                    }
                    sendToRenderer('update-status', 'Listening...');
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                proactivity: { proactiveAudio: true },
                outputAudioTranscription: {},
                tools: enabledTools,
                inputAudioTranscription: {
                    enableSpeakerDiarization: true,
                    minSpeakerCount: 2,
                    maxSpeakerCount: 2,
                },
                contextWindowCompression: { slidingWindow: {} },
                speechConfig: { languageCode: language },
                systemInstruction: {
                    parts: [{ text: systemPrompt }],
                },
            },
        });

        isInitializingSession = false;
        if (!isReconnect) {
            sendToRenderer('session-initializing', false);
        }
        return session;
    } catch (error) {
        console.warn('Live WebSocket session unavailable, switching to HTTP Streaming mode:', error.message);
        isInitializingSession = false;
        geminiSessionRef.current = null;
        if (!isReconnect) {
            sendToRenderer('session-initializing', false);
        }
        sendToRenderer('update-status', 'Listening...');
        return null;
    }
}

async function attemptReconnect() {
    reconnectAttempts++;
    console.log(`Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

    // Clear stale buffers
    messageBuffer = '';
    currentTranscription = '';
    // Don't reset groqConversationHistory to preserve context across reconnects

    sendToRenderer('update-status', `Reconnecting... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

    // Wait before attempting
    await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));

    try {
        const session = await initializeGeminiSession(
            sessionParams.apiKey,
            sessionParams.customPrompt,
            sessionParams.profile,
            sessionParams.language,
            true,  // isReconnect
            sessionParams.modeCategory || ''
        );

        if (session && global.geminiSessionRef) {
            global.geminiSessionRef.current = session;

            // Restore context from conversation history via text message
            const contextMessage = buildContextMessage();
            if (contextMessage) {
                try {
                    console.log('Restoring conversation context...');
                    await session.sendRealtimeInput({ text: contextMessage });
                } catch (contextError) {
                    console.error('Failed to restore context:', contextError);
                    // Continue without context - better than failing
                }
            }

            // Don't reset reconnectAttempts here - let it reset on next fresh session
            sendToRenderer('update-status', 'Reconnected! Listening...');
            console.log('Session reconnected successfully');
            return true;
        }
    } catch (error) {
        console.error(`Reconnection attempt ${reconnectAttempts} failed:`, error);
    }

    // If we still have attempts left, try again
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        return attemptReconnect();
    }

    // Max attempts reached - notify frontend
    console.log('Max reconnection attempts reached');
    sendToRenderer('reconnect-failed', {
        message: 'Tried 3 times to reconnect. Must be upstream/network issues. Try restarting or download updated app from site.',
    });
    sessionParams = null;
    return false;
}

// killExistingSystemAudioDump -> gemini.audio.js


// startMacOSAudioCapture -> gemini.audio.js


// convertStereoToMono -> gemini.audio.js


// stopMacOSAudioCapture -> gemini.audio.js


// createWavBuffer -> gemini.audio.js


let oralAudioChunks = [];
let totalOralPcmBytes = 0;
let oralAudioTimer = null;
let isProcessingOralAudio = false;



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




async function sendAudioToGemini(base64Data, geminiSessionRef) {
    if (!geminiSessionRef.current) {
        const pcmBuffer = Buffer.from(base64Data, 'base64');
        appendOralAudioPcm(pcmBuffer);
        return;
    }

    try {
        process.stdout.write('.');
        await geminiSessionRef.current.sendRealtimeInput({
            audio: {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            },
        });
    } catch (error) {
        console.error('Error sending audio to Gemini:', error);
    }
}

async function sendImageToGeminiHttp(base64Data, prompt) {
    // Build a priority list: start with the rate-limit-aware model, then
    // walk through the full fallback list so a discontinued model never
    // hard-crashes the app.
    const preferredModel = getAvailableModel();
    const modelsToTry = [
        preferredModel,
        ...GEMINI_MODEL_FALLBACK_LIST.filter(m => m !== preferredModel),
    ];

    const apiKey = getApiKey();
    if (!apiKey || apiKey.trim() === '') {
        const errMsg = 'No Google Gemini API key configured. Please enter your API key in Settings.';
        sendToRenderer('new-response', {
            question: prompt,
            answer: `⚠️ **API Key Missing**\n\nPlease navigate to the **Settings** tab and enter your Google Gemini API key to analyze screens.`
        });
        return { success: false, error: errMsg };
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data,
                    },
                },
                { text: prompt },
            ]
        }
    ];

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`Sending image to ${model} (streaming)...`);
            const response = await ai.models.generateContentStream({
                model: model,
                contents: contents,
            });

            // Increment count after successful call
            incrementLimitCount(model);

            // Stream the response
            let fullText = '';
            let isFirst = true;
            for await (const chunk of response) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    sendToRenderer(isFirst ? 'new-response' : 'update-response', {
                        question: prompt,
                        answer: fullText
                    });
                    isFirst = false;
                }
            }

            console.log(`Image response completed from ${model}`);
            saveScreenAnalysis(prompt, fullText, model);
            return { success: true, text: fullText, model: model };

        } catch (err) {
            console.warn(`Model ${model} unavailable:`, err.message);
            lastError = err;
        }
    }

    const errorDetails = lastError?.message ? lastError.message : 'Unknown error';
    const friendlyError = `All Gemini models unavailable: ${errorDetails}`;
    console.error('All Gemini fallback models failed:', lastError);
    sendToRenderer('update-status', 'API key invalid or model unavailable');
    sendToRenderer('new-response', {
        question: prompt,
        answer: `❌ **API Key Error**: ${friendlyError}\n\n👉 **Solution**: Please enter a valid Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) in the **Settings** tab (must start with \`AIzaSy...\`).`
    });
    return { success: false, error: friendlyError };
}

function setupGeminiIpcHandlers(geminiSessionRef) {
    // Store the geminiSessionRef globally for reconnection access
    global.geminiSessionRef = geminiSessionRef;

    ipcMain.handle('initialize-cloud', async (event, token, profile, userContext) => {
        try {
            currentProviderMode = 'cloud';
            initializeNewSession(profile, userContext);
            setOnTurnComplete((transcription, response) => {
                saveConversationTurn(transcription, response);
            });
            sendToRenderer('session-initializing', true);
            await connectCloud(token, profile, userContext);
            sendToRenderer('session-initializing', false);
            return true;
        } catch (err) {
            console.error('[Cloud] Init error:', err);
            currentProviderMode = 'byok';
            sendToRenderer('session-initializing', false);
            return false;
        }
    });

    ipcMain.handle('initialize-gemini', async (event, apiKey, customPrompt, profile = 'interview', language = 'en-US', modeCategory = '') => {
        currentProviderMode = 'byok';

        // Use the robust profile resolver to get full resume + JD + custom prompt
        const { promptKey, fullPromptContext } = resolveProfileContext();
        let activeCustomPrompt = fullPromptContext || customPrompt || '';
        let actualProfileType = promptKey;

        const session = await initializeGeminiSession(apiKey, activeCustomPrompt, actualProfileType, language, false, modeCategory);
        if (session) {
            geminiSessionRef.current = session;
            return true;
        }
        return false;
    });

    ipcMain.handle('initialize-local', async (event, ollamaHost, ollamaModel, whisperModel, profile, customPrompt) => {
        currentProviderMode = 'local';
        const success = await getLocalAi().initializeLocalSession(ollamaHost, ollamaModel, whisperModel, profile, customPrompt);
        if (!success) {
            currentProviderMode = 'byok';
        }
        return success;
    });

    ipcMain.handle('send-audio-content', async (event, { data, mimeType }) => {
        if (currentProviderMode === 'cloud') {
            try {
                const pcmBuffer = Buffer.from(data, 'base64');
                sendCloudAudio(pcmBuffer);
                return { success: true };
            } catch (error) {
                console.error('Error sending cloud audio:', error);
                return { success: false, error: error.message };
            }
        }
        if (currentProviderMode === 'local') {
            try {
                const pcmBuffer = Buffer.from(data, 'base64');
                getLocalAi().processLocalAudio(pcmBuffer);
                return { success: true };
            } catch (error) {
                console.error('Error sending local audio:', error);
                return { success: false, error: error.message };
            }
        }
        if (!geminiSessionRef.current) {
            const pcmBuffer = Buffer.from(data, 'base64');
            appendOralAudioPcm(pcmBuffer);
            return { success: true };
        }
        try {
            process.stdout.write('.');
            await geminiSessionRef.current.sendRealtimeInput({
                audio: { data: data, mimeType: mimeType },
            });
            return { success: true };
        } catch (error) {
            console.error('Error sending system audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Handle microphone audio on a separate channel
    ipcMain.handle('send-mic-audio-content', async (event, { data, mimeType }) => {
        if (currentProviderMode === 'cloud') {
            try {
                const pcmBuffer = Buffer.from(data, 'base64');
                sendCloudAudio(pcmBuffer);
                return { success: true };
            } catch (error) {
                console.error('Error sending cloud mic audio:', error);
                return { success: false, error: error.message };
            }
        }
        if (currentProviderMode === 'local') {
            try {
                const pcmBuffer = Buffer.from(data, 'base64');
                getLocalAi().processLocalAudio(pcmBuffer);
                return { success: true };
            } catch (error) {
                console.error('Error sending local mic audio:', error);
                return { success: false, error: error.message };
            }
        }
        if (!geminiSessionRef.current) {
            const pcmBuffer = Buffer.from(data, 'base64');
            appendOralAudioPcm(pcmBuffer);
            return { success: true };
        }
        try {
            process.stdout.write(',');
            await geminiSessionRef.current.sendRealtimeInput({
                audio: { data: data, mimeType: mimeType },
            });
            return { success: true };
        } catch (error) {
            console.error('Error sending mic audio:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('send-image-content', async (event, { data, prompt }) => {
        try {
            if (!data || typeof data !== 'string') {
                console.error('Invalid image data received');
                return { success: false, error: 'Invalid image data' };
            }

            const buffer = Buffer.from(data, 'base64');

            if (buffer.length < 1000) {
                console.error(`Image buffer too small: ${buffer.length} bytes`);
                return { success: false, error: 'Image buffer too small' };
            }

            process.stdout.write('!');

            if (currentProviderMode === 'cloud') {
                const sent = sendCloudImage(data);
                if (!sent) {
                    return { success: false, error: 'Cloud connection not active' };
                }
                return { success: true, model: 'cloud' };
            }

            if (currentProviderMode === 'local') {
                const result = await getLocalAi().sendLocalImage(data, prompt);
                return result;
            }

            // Use HTTP API instead of realtime session
            const result = await sendImageToGeminiHttp(data, prompt);
            return result;
        } catch (error) {
            console.error('Error sending image:', error);
            return { success: false, error: error.message };
        }
    });

async function sendTextToGeminiHttp(text, profile = 'interview') {
    const apiKey = getApiKey();
    const isGeminiKeyValid = apiKey && apiKey.trim() !== '';

    if (!isGeminiKeyValid) {
        if (typeof getGroqApiKey === 'function' && getGroqApiKey() && getGroqApiKey().trim() !== '') {
            console.log('Gemini API key missing — automatically falling back to Groq!');
            sendToGroq(text);
            return { success: true };
        }

        const errMsg = 'Missing Google Gemini API key. Please enter your API key in Settings.';
        sendToRenderer('new-response', {
            question: text,
            answer: `⚠️ **Google Gemini API Key Required**\n\nPlease navigate to the **Settings** tab and enter your Google Gemini API key to get live answers.`
        });
        return { success: false, error: errMsg };
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const preferredModel = getAvailableModel();
    const modelsToTry = [
        preferredModel,
        ...GEMINI_MODEL_FALLBACK_LIST.filter(m => m !== preferredModel),
    ];

    // Resolve full profile context (resume + JD + custom prompt)
    const { promptKey, fullPromptContext } = resolveProfileContext();
    const systemPrompt = getSystemPrompt(promptKey, fullPromptContext, true);

    const messagesWithSystem = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am connected to the candidate profile and context. I will answer all questions concisely in the 1st-person.' }] },
        { role: 'user', parts: [{ text: text }] }
    ];

    let lastError = null;
    for (const model of modelsToTry) {
        try {
            console.log(`[Instant Streaming] Generating response for question using ${model}...`);
            const response = await ai.models.generateContentStream({
                model: model,
                contents: messagesWithSystem,
            });

            let fullText = '';
            let isFirst = true;
            for await (const chunk of response) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullText += chunkText;
                    sendToRenderer(isFirst ? 'new-response' : 'update-response', {
                        question: text,
                        answer: fullText
                    });
                    isFirst = false;
                }
            }

            console.log(`[Instant Streaming] Response complete from ${model}`);
            saveConversationTurn(text, fullText);
            sendToRenderer('update-status', 'Listening...');
            return { success: true, text: fullText };
        } catch (err) {
            console.warn(`Model ${model} streaming error:`, err.message);
            lastError = err;
        }
    }

    const errMsg = lastError ? lastError.message : 'Failed to generate response';
    sendToRenderer('new-response', {
        question: text,
        answer: `❌ **API Error**: ${errMsg}\n\n*Please verify that your Google Gemini API Key in Settings is valid (starts with AIzaSy).*`
    });
    return { success: false, error: errMsg };
}

    ipcMain.handle('send-text-message', async (event, text) => {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return { success: false, error: 'Invalid text message' };
        }

        const trimmedText = text.trim();
        console.log('Processing question:', trimmedText);

        if (currentProviderMode === 'cloud') {
            try {
                sendCloudText(trimmedText);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        if (currentProviderMode === 'local') {
            try {
                return await getLocalAi().sendLocalText(trimmedText);
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // Always generate instant streaming answer via Gemini HTTP (<2s response guarantee!)
        return await sendTextToGeminiHttp(trimmedText, currentProfile || 'interview');
    });

    ipcMain.handle('start-macos-audio', async event => {
        if (process.platform !== 'darwin') {
            return {
                success: false,
                error: 'macOS audio capture only available on macOS',
            };
        }

        try {
            const success = await startMacOSAudioCapture(geminiSessionRef);
            return { success };
        } catch (error) {
            console.error('Error starting macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('stop-macos-audio', async event => {
        try {
            stopMacOSAudioCapture();
            return { success: true };
        } catch (error) {
            console.error('Error stopping macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('close-session', async event => {
        try {
            stopMacOSAudioCapture();

            if (currentProviderMode === 'cloud') {
                closeCloud();
                currentProviderMode = 'byok';
                return { success: true };
            }

            if (currentProviderMode === 'local') {
                getLocalAi().closeLocalSession();
                currentProviderMode = 'byok';
                return { success: true };
            }

            // Set flag to prevent reconnection attempts
            isUserClosing = true;
            sessionParams = null;

            // Cleanup session
            if (geminiSessionRef.current) {
                await geminiSessionRef.current.close();
                geminiSessionRef.current = null;
            }

            return { success: true };
        } catch (error) {
            console.error('Error closing session:', error);
            return { success: false, error: error.message };
        }
    });

    // Conversation history IPC handlers
    ipcMain.handle('get-current-session', async event => {
        try {
            return { success: true, data: getCurrentSessionData() };
        } catch (error) {
            console.error('Error getting current session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('start-new-session', async event => {
        try {
            initializeNewSession();
            return { success: true, sessionId: currentSessionId };
        } catch (error) {
            console.error('Error starting new session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('update-google-search-setting', async (event, enabled) => {
        try {
            console.log('Google Search setting updated to:', enabled);
            // The setting is already saved in localStorage by the renderer
            // This is just for logging/confirmation
            return { success: true };
        } catch (error) {
            console.error('Error updating Google Search setting:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    initializeGeminiSession,
    getEnabledTools,
    getStoredSetting,
    sendToRenderer,
    initializeNewSession,
    saveConversationTurn,
    getCurrentSessionData,
    killExistingSystemAudioDump,
    startMacOSAudioCapture,
    convertStereoToMono,
    stopMacOSAudioCapture,
    sendAudioToGemini,
    sendImageToGeminiHttp,
    setupGeminiIpcHandlers,
    formatSpeakerResults,
};
