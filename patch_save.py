import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace URL and fetch logic
old_logic = """            const apiUrl = dnsIP.includes('.loca.lt') ? `https://${dnsIP}/api/meetings/` : `http://${dnsIP}:${dnsPort}/api/meetings/`;
            const formData = new FormData();
            
            const meetingData = {"""

new_logic = """            const baseUrl = dnsIP.includes('.loca.lt') ? `https://${dnsIP}/api/meetings` : `http://${dnsIP}:${dnsPort}/api/meetings`;
            const endpointUrl = this.editMeeting ? `${baseUrl}/${this.editMeeting.id}` : baseUrl + '/';
            const reqMethod = this.editMeeting ? 'PUT' : 'POST';
            const formData = new FormData();
            
            const meetingData = {"""
content = content.replace(old_logic, new_logic)

old_fetch = """            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });"""

new_fetch = """            let res;
            if (this.editMeeting) {
                res = await fetch(endpointUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(meetingData)
                });
            } else {
                res = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }"""
content = content.replace(old_fetch, new_fetch)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched save logic")
