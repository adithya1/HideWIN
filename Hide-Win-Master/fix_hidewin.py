import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add InviteView import
content = content.replace(
    "import '../views/MeetingDashboardView.js';",
    "import '../views/MeetingDashboardView.js';\nimport '../views/InviteView.js';"
)

# 2. Add invite and schedule-meeting to the switch case
switch_pattern = r"(case 'history':\s*return html<history-view></history-view>;)"
new_cases = r"\1\n            case 'invite':\n                return html<invite-view></invite-view>;\n            case 'schedule-meeting':\n                return html<schedule-meeting-view></schedule-meeting-view>;"
content = re.sub(switch_pattern, new_cases, content)

# 3. Add to items array
help_item = r"({ id: 'help', label: 'Help', icon: html<svg[^>]*>.*?</svg> })"
new_items = r"\1,\n            { id: 'invite', label: 'Invite Friends', icon: html<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"></path><polyline points=\"22,6 12,13 2,6\"></polyline></svg> },\n            { id: 'schedule-meeting', label: 'New Meeting', icon: html<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line></svg> }"
content = re.sub(help_item, new_items, content)

# 4. Remove all the mobile hamburger CSS blocks that break the layout
# We will just strip out the @media (max-width: 900px), @media (max-width: 600px), @media (max-width: 768px)
content = re.sub(r"/\* RESPONSIVE LAYOUT \*/.*?\.mobile-hamburger {\s*display: none;\s*}", "/* RESPONSIVE LAYOUT REMOVED TO RESTORE PILL BAR */\n\t\t.mobile-hamburger {\n\t\t\tdisplay: none;\n\t\t}", content, flags=re.DOTALL)

# And make the horizontal nav wrap!
content = content.replace("overflow-x: auto;", "overflow-x: auto;\n            flex-wrap: wrap;")

# 5. Remove the mobile app header HTML from render()
mobile_header_regex = r"<!-- Mobile App Header \(Visible only on mobile/portrait\) -->.*?<!-- Mobile Drawer Overlay -->.*?</div>"
content = re.sub(mobile_header_regex, "", content, flags=re.DOTALL)

# 6. Remove the mobile bottom nav HTML
mobile_bottom_nav_regex = r"<!-- Mobile Bottom Nav -->.*?</nav>"
content = re.sub(mobile_bottom_nav_regex, "", content, flags=re.DOTALL)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched HideWinApp.js successfully')
