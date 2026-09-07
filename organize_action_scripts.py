import os
import shutil

ROOT = "c:/Users/akula/Downloads/Hide-WIN"
MASTER = os.path.join(ROOT, "Hide-Win-Master")

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Target directories
scripts_maint = os.path.join(ROOT, "scripts", "maintenance")
scripts_setup = os.path.join(ROOT, "scripts", "setup")
scripts_diag = os.path.join(ROOT, "scripts", "diagnostics")
archive_patch = os.path.join(ROOT, "_archive", "development-history", "action-scripts", "patch")
archive_find = os.path.join(ROOT, "_archive", "development-history", "action-scripts", "find")
archive_dump = os.path.join(ROOT, "_archive", "development-history", "action-scripts", "dump")
archive_other = os.path.join(ROOT, "_archive", "development-history", "action-scripts", "other")

for d in [scripts_maint, scripts_setup, scripts_diag, archive_patch, archive_find, archive_dump, archive_other]:
    ensure_dir(d)

def categorize_and_move(src_dir):
    for f in os.listdir(src_dir):
        if not f.endswith(".py"): continue
        if f == "organize_action_scripts.py": continue
        
        filepath = os.path.join(src_dir, f)
        if not os.path.isfile(filepath): continue
        
        # Categorize
        if f.startswith("create_"):
            dest = scripts_setup
        elif f.startswith("clean_") or f.startswith("organize_"):
            dest = scripts_maint
        elif f.startswith("find_") or f.startswith("diff_") or f.startswith("grep_") or f.startswith("check"):
            dest = archive_find
        elif f.startswith("dump_") or f.startswith("extract_") or f.startswith("debug_"):
            dest = archive_dump
        elif f.startswith("inject_") or f.startswith("do_patch") or f.startswith("patch") or f.startswith("move_") or f.startswith("revert_") or f.startswith("rewrite_") or f.startswith("robust_") or f.startswith("safe_") or f.startswith("replace_") or f.startswith("refactor_") or f.startswith("purge_") or f.startswith("global_") or f.startswith("hide_") or f.startswith("make_") or f.startswith("reconstruct") or f.startswith("repair_") or f.startswith("unpatch_") or f.startswith("history_delete"):
            dest = archive_patch
        else:
            dest = archive_other
            
        shutil.move(filepath, os.path.join(dest, f))

categorize_and_move(ROOT)
if os.path.exists(MASTER):
    categorize_and_move(MASTER)

print("Moved all legacy action-based files into proper packages and archives.")
