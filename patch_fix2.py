with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Clean up ALL instances of the bad injection
content = content.replace("const meetingDataJson = JSON.stringify(meetingData);\n              const formData = new FormData();", "const formData = new FormData();")
content = content.replace("const meetingDataJson = JSON.stringify(meetingData);\n                const formData = new FormData();", "const formData = new FormData();")

# Inject meetingDataJson properly after meetingData in saveMeeting
content = content.replace("formData.append('meeting_data', JSON.stringify(meetingData));", "const meetingDataJson = JSON.stringify(meetingData);\n            formData.append('meeting_data', meetingDataJson);")

# We injected the `new_fetch_block` into `sendDelayedInvites` too by mistake because the fetch signature matched!
# Let's restore the fetch inside sendDelayedInvites.
content = content.replace("""const currentDesc = editor ? editor.innerHTML : '';
                let response;
            if (this.editMeeting) {
                response = await fetch(endpointUrl, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: meetingDataJson || JSON.stringify(meetingData)
                });
            } else {
                response = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
            }""", """const currentDesc = editor ? editor.innerHTML : '';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });""")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ScheduleMeetingView.js")
