const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getConfigDir() {
    const platform = os.platform();
    if (platform === 'win32') {
        return path.join(os.homedir(), 'AppData', 'Roaming', 'WinCameraSvc');
    }
    return path.join(os.homedir(), '.config', 'WinCameraSvc');
}

async function getApiKey() {
    try {
        const credsPath = path.join(getConfigDir(), 'credentials.json');
        if (fs.existsSync(credsPath)) {
            const data = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
            return data.apiKey;
        }
    } catch (e) {}
    return null;
}

async function main() {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.log('No API key found');
        return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    try {
        const response = await ai.models.list();
        let foundLiveModels = [];
        for await (const model of response) {
            // Check if bidiGenerateContent is supported
            if (model.supportedActions && model.supportedActions.includes('bidiGenerateContent')) {
                foundLiveModels.push(model.name);
            }
        }
        
        console.log('Live Models:', foundLiveModels);
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

main();
