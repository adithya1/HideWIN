import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# First, let's find the start of addNewResponse
start_idx = content.find("addNewResponse(response) {")
# Find the end of addNewResponse. We can look for updateCurrentResponse
end_idx = content.find("updateCurrentResponse(response) {", start_idx)

# Let's replace the whole addNewResponse block with a clean one
clean_add_new_response = r"""addNewResponse(response) {
        if (typeof response === 'object' && response !== null && !response.timestamp) {
            response.timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
        }
        const wasOnLatest = this.currentResponseIndex === this.responses.length - 1;
        
        // If the last card is an in-flight placeholder for this question, update it
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
        }

        if (wasOnLatest || this.currentResponseIndex === -1) {
            this.currentResponseIndex = this.responses.length - 1;
        }
        this._awaitingNewResponse = false;
        this.requestUpdate();
    }

    """

content = content[:start_idx] + clean_add_new_response + content[end_idx:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("HideWinApp.js syntax fixed")
