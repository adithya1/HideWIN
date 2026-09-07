import difflib
with open(r"C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy (3)\src\components\views\NotesView.js", 'r', encoding='utf-8') as f:
    old = f.readlines()
with open(r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js", 'r', encoding='utf-8') as f:
    new = f.readlines()

diff = list(difflib.unified_diff(old, new, n=0))
with open(r"C:\Users\akula\Downloads\Hide-WIN\diff_out.txt", 'w', encoding='utf-8') as f:
    f.write("".join(diff))
