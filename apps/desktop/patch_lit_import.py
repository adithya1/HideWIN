path1 = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
path2 = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js'

for path in [path1, path2]:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("import { LitElement, html, css } from '../../../node_modules/lit-core-2.7.4.min.js';", "import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
