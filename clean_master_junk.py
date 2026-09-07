import os
import shutil

master_dir = "Hide-Win-Master"
archive_dir = "_archive/development-history/master-junk"
os.makedirs(archive_dir, exist_ok=True)

junk_files = [
    "1660", "2160", "backticks.txt", "blocker.log", "dev.ps1", "diff_mainview.txt", 
    "electron_out.log", "error.log", "extract.js", "ExtractStyles.js", "extract_db.js",
    "inject-logs.js", "mainview_styles.txt", "mock.js", "mouse_out.txt", "mover.cs",
    "npm_error.log", "npm_output.log", "out.log", "override.js", "recovered_shared.json",
    "render_copy3.txt", "replace-names.js", "replace-names2.js", "replay.ps1", "save_key.js",
    "screenshot_mobile.png", "screenshot_pc.png", "start_log.txt", "stderr.log", "stdout.log",
    "temp_out.txt", "test-drawer.js", "test.cs", "test.docx", "test.exe", "test.js", "test2.js",
    "This PC - Shortcut.lnk", "vosk-model.zip"
]

moved = 0
for f in junk_files:
    src = os.path.join(master_dir, f)
    dst = os.path.join(archive_dir, f)
    if os.path.exists(src):
        shutil.move(src, dst)
        moved += 1

print(f"Moved {moved} junk files from Hide-Win-Master to _archive.")
