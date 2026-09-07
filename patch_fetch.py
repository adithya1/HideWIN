import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the fetch logic in saveMeeting
old_fetch_block = """            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });"""

new_fetch_block = """            let response;
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
            }"""

content = content.replace(old_fetch_block, new_fetch_block)

# Let's ensure meetingDataJson exists just in case
if 'const meetingDataJson' not in content:
    content = content.replace('const formData = new FormData();', 'const meetingDataJson = JSON.stringify(meetingData);\n              const formData = new FormData();')

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ScheduleMeetingView save fetch")
