import difflib
import os

bkp = r"C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy (3)\src\components\views\ScheduleMeetingView.js"
cur = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js"

if not os.path.exists(bkp):
    print("Backup does not exist")
else:
    with open(bkp, 'r', encoding='utf-8') as f:
        old = f.readlines()
    with open(cur, 'r', encoding='utf-8') as f:
        new = f.readlines()
    diff = list(difflib.unified_diff(old, new, n=1))
    print("".join(diff[:150]))
