with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

bad_block = """            let response;
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

good_block = """            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });"""

# This block exists TWICE in the file! Once in saveMeeting (where we WANT the PUT/POST branching) and once in sendDelayedInvites (where we DO NOT want it).
# We only want to replace the SECOND occurrence.
parts = content.split(bad_block)
if len(parts) == 3:
    content = parts[0] + bad_block + parts[1] + good_block + parts[2]
else:
    print(f"Expected 3 parts, got {len(parts)}")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored sendDelayedInvites fetch logic")
