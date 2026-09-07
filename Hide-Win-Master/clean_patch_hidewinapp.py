import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. IPC listeners
content = content.replace(
    "ipcRenderer.on('new-response', (_, response) => this.addNewResponse(response));",
    "ipcRenderer.on('new-response', (_, response) => this.addNewResponse(response));\n            ipcRenderer.on('append-explanation', (_, text) => this.appendExplanation(text));"
)
content = content.replace(
    "ipcRenderer.removeAllListeners('new-response');",
    "ipcRenderer.removeAllListeners('new-response');\n            ipcRenderer.removeAllListeners('append-explanation');"
)

# 2. appendExplanation method
method = r"""    appendExplanation(text) {
        if (this.responses.length === 0) return;
        const targetIdx = this.currentResponseIndex === -1 ? this.responses.length - 1 : this.currentResponseIndex;
        let targetResponse = { ...this.responses[targetIdx] };
        if (!targetResponse.userExplanation) {
            targetResponse.userExplanation = text;
        } else {
            targetResponse.userExplanation += ' ' + text;
        }
        const newResponses = [...this.responses];
        newResponses[targetIdx] = targetResponse;
        this.responses = newResponses;
        this.requestUpdate();
    }

    updateLiveTranscription(text) {"""
content = content.replace("    updateLiveTranscription(text) {", method)

# 3. addNewResponse fix
old_add_new = r"""        // If the last card is an in-flight placeholder for this question, update it
        if (
            this.responses.length > 0 &&
            typeof response === 'object' &&
            response !== null &&
            (this._awaitingNewResponse || String(this.responses[this.responses.length - 1]?.answer || '').includes('Generating response'))
        ) {
            this.responses = [...this.responses.slice(0, -1), response];
        } else {
            this.responses = [...this.responses, response];
        }"""
        
new_add_new = r"""        // If the last card is an in-flight placeholder for this question, update it
        if (
            this.responses.length > 0 &&
            typeof response === 'object' &&
            response !== null &&
            String(this.responses[this.responses.length - 1]?.answer || '').includes('Generating response') &&
            this.responses[this.responses.length - 1]?.question === response.question
        ) {
            this.responses = [...this.responses.slice(0, -1), response];
        } else {
            this.responses = [...this.responses, response];
        }"""
content = content.replace(old_add_new, new_add_new)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("HideWinApp.js cleanly patched!")
