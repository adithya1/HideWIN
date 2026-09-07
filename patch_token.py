import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

bad_token1 = """            let token = "";
            if (tokenResponse) {
                const creds = JSON.parse(tokenResponse);
                token = creds.jwtToken || "";
            }"""
            
good_token = """            let token = "";
            if (tokenResponse) {
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
                token = creds.jwtToken || "";
            }"""

content = content.replace(bad_token1, good_token)
content = content.replace("let token = JSON.parse(tokenResponse).jwtToken || \"\";", good_token)

# Just to be safe, I will also make sure the meetings are parsed as an array if backend returns object with meetings array
array_fix_old = "this.meetings = await res.json();"
array_fix_new = "const data = await res.json(); this.meetings = Array.isArray(data) ? data : (data.meetings || []);"
content = content.replace(array_fix_old, array_fix_new)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed MeetingDashboardView token parsing")
