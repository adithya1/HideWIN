import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's add better error reporting so we know exactly WHY it's failing to fetch!
debug_logic = """
            if (response && !response.ok) {
                const text = await response.text();
                console.error("Backend Error:", text);
                this.showToast(`Error ${response.status}: ${text.substring(0, 50)}`, "error");
                return;
            }
"""
content = content.replace("""              } else {
                  response = await fetch(endpointUrl, {""", """              } else {
                  // Re-add attachments logic that was lost
                  this.attachments.forEach(file => { formData.append('files', file); });
                  response = await fetch(endpointUrl, {""")

content = content.replace("""              if (response.ok) {
                  const data = await response.json();""", debug_logic + """              if (response.ok) {
                  const data = await response.json();""")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added error debug logic to ScheduleMeetingView")
