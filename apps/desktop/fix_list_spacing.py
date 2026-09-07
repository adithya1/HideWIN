with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_layout = """            .posh-list-layout {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 8px 4px 24px 4px;
            }"""

new_layout = """            .posh-list-layout {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 16px 24px 32px 24px;
                margin: 0 auto;
                width: 100%;
                max-width: 1100px;
            }"""

content = content.replace(old_layout, new_layout)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated posh-list-layout")
