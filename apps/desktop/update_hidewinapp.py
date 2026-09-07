import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add listener in connectedCallback
listener_target = r"ipcRenderer\.on\('new-response', \(_, response\) => this\.addNewResponse\(response\)\);"
listener_replacement = r"""ipcRenderer.on('new-response', (_, response) => this.addNewResponse(response));
            ipcRenderer.on('append-explanation', (_, text) => this.appendExplanation(text));"""
content = re.sub(listener_target, listener_replacement, content)

# Remove listener in disconnectedCallback
remove_target = r"ipcRenderer\.removeAllListeners\('new-response'\);"
remove_replacement = r"""ipcRenderer.removeAllListeners('new-response');
            ipcRenderer.removeAllListeners('append-explanation');"""
content = re.sub(remove_target, remove_replacement, content)

# Add appendExplanation method before updateLiveTranscription
method_target = r"    updateLiveTranscription\(text\) \{"
method_replacement = r"""    appendExplanation(text) {
        if (this.responses.length === 0) return;
        
        // Find the currently active response block
        const targetIdx = this.currentResponseIndex === -1 ? this.responses.length - 1 : this.currentResponseIndex;
        let targetResponse = { ...this.responses[targetIdx] };
        
        // Append text to userExplanation
        if (!targetResponse.userExplanation) {
            targetResponse.userExplanation = text;
        } else {
            targetResponse.userExplanation += ' ' + text;
        }
        
        // Replace in array
        const newResponses = [...this.responses];
        newResponses[targetIdx] = targetResponse;
        this.responses = newResponses;
        
        this.requestUpdate();
    }

    updateLiveTranscription(text) {"""
content = re.sub(method_target, method_replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("HideWinApp.js updated with append-explanation logic")
