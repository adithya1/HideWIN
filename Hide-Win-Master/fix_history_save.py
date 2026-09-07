import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\gemini.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"""            if \(intent === 'EXPLANATION'\) \{
                sendToRenderer\('append-explanation', trimmedText\);
                sendToRenderer\('update-status', 'Listening\.\.\.'\);
                return \{ success: true, intent: 'EXPLANATION' \};
            \}"""

replacement = r"""            if (intent === 'EXPLANATION') {
                sendToRenderer('append-explanation', trimmedText);
                sendToRenderer('update-status', 'Listening...');
                
                if (currentSessionId && conversationHistory.length > 0) {
                    let lastTurn = conversationHistory[conversationHistory.length - 1];
                    if (!lastTurn.userExplanation) {
                        lastTurn.userExplanation = trimmedText;
                    } else {
                        lastTurn.userExplanation += ' ' + trimmedText;
                    }
                    sendToRenderer('save-conversation-turn', {
                        sessionId: currentSessionId,
                        fullHistory: conversationHistory
                    });
                }
                
                return { success: true, intent: 'EXPLANATION' };
            }"""

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("gemini.js updated to save userExplanation to history")
