// Pure text formatting utilities extracted from gemini.js
// No session state or IPC dependencies

function formatSpeakerResults(results) {
    let text = '';
    for (const result of results) {
        if (result.transcript && result.speakerId) {
            const speakerLabel = result.speakerId === 1 ? 'Interviewer' : 'Candidate';
            text += `[${speakerLabel}]: ${result.transcript}\n`;
        }
    }
    return text;
}

function stripThinkingTags(text) {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function extractInterviewerQuestion(text) {
    if (!text || typeof text !== 'string') return '';
    const lines = text.split('\n');
    const interviewerLines = lines.filter(line => line.includes('[Interviewer]:') || !line.includes('[Candidate]:'));
    const combined = interviewerLines.join(' ').replace(/\[Interviewer\]:\s*/gi, '').replace(/\[Candidate\]:\s*/gi, '').trim();
    return combined || text.replace(/^\[(Interviewer|Candidate)\]:\s*/gi, '').trim();
}

function trimConversationHistoryForGemma(history, maxChars=42000) {
    if(!history || history.length === 0) return [];
    let totalChars = 0;
    const trimmed = [];

    for(let i = history.length - 1; i >= 0; i--) {
        const turn = history[i];
        const turnChars = (turn.content || '').length;

        if(totalChars + turnChars > maxChars) break;
        totalChars += turnChars;
        trimmed.unshift(turn);
    }
    return trimmed;
}

module.exports = { formatSpeakerResults, stripThinkingTags, extractInterviewerQuestion, trimConversationHistoryForGemma };
