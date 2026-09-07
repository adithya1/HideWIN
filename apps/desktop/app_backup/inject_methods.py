import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

methods = r"""
    appendExplanation(text) {
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

    updateLiveTranscription(text) {
        this.liveTranscription = text;
        this.requestUpdate();
    }

    addNewResponse(response) {"""

content = content.replace("    addNewResponse(response) {", methods)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Injected missing methods into HideWinApp.js")
