import subprocess
import time

p = subprocess.Popen([r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.exe'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
time.sleep(1)
if p.poll() is None:
    print("MouseBlocker.exe is successfully running continuously!")
    p.stdin.write("EXIT\n")
    p.stdin.flush()
else:
    print("MouseBlocker.exe died immediately :(")
