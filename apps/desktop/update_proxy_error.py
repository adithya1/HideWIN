import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\gemini.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix sendToGemma to send a visible error card instead of just updating the status text silently
error_handling = r"""    } catch (error) {
        console.error('Error calling Secure Proxy:', error);
        sendToRenderer('update-status', 'Proxy error: ' + error.message);
        
        // ADDED: Create a visible error card so the user knows WHY it failed instead of failing silently
        sendToRenderer('new-response', {
            question: transcription,
            answer: `⚠️ **Proxy Error**: ${error.message}\n\n*Your Admin Panel Gemini API key might be out of quota (429 Rate Limit). Please check your Gemini API billing!*`
        });
    }"""

# Replace the existing catch block in sendToGemma
content = re.sub(r'\} catch \(error\) \{\s*console\.error\(\'Error calling Secure Proxy:\', error\);\s*sendToRenderer\(\'update-status\', \'Proxy error: \' \+ error\.message\);\s*\}', error_handling, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("gemini.js proxy error handling updated to show visible UI card!")
