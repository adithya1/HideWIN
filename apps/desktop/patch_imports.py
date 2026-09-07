path1 = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
path2 = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js'

for path in [path1, path2]:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("import { unifiedPageStyles } from '../../styles/sharedPageStyles.js';", "")
    content = content.replace("unifiedPageStyles,", "")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
