with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the incorrect placement of meetingDataJson
bad_str = "const meetingDataJson = JSON.stringify(meetingData);\n              const formData = new FormData();"
content = content.replace(bad_str, "const formData = new FormData();")

# Inject meetingDataJson properly after meetingData is defined
target = "formData.append('meeting_data', JSON.stringify(meetingData));"
replacement = "const meetingDataJson = JSON.stringify(meetingData);\n            formData.append('meeting_data', meetingDataJson);"
content = content.replace(target, replacement)

# Fix sendDelayedInvites which doesn't have meetingData defined at all, so meetingDataJson shouldn't be there
bad_put = """                response = await fetch(endpointUrl, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: meetingDataJson || JSON.stringify(meetingData)
                });
            } else {
                response = await fetch(endpointUrl, {"""

# Let's just fix the whole file by writing a regex script to clean it up.
