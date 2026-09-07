import ctypes
import time
import subprocess
p = subprocess.Popen(['.\\test_pt.exe'], stdout=subprocess.PIPE, text=True)
time.sleep(1)
ctypes.windll.user32.SetCursorPos(500, 500)
ctypes.windll.user32.mouse_event(0x0001, 10, 10, 0, 0)
print(p.stdout.read())
