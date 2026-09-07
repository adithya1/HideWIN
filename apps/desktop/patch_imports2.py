import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports correctly
import_statement = """import { AuthView } from '../views/AuthView.js';
import '../views/ScheduleMeetingView.js';
import '../views/MeetingDashboardView.js';"""

content = content.replace("import { AuthView } from '../views/AuthView.js';", import_statement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
