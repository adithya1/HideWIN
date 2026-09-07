import ctypes
import time
import subprocess

p = subprocess.Popen(['.\\src\\utils\\MouseBlocker.exe', '500', '500'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
time.sleep(1)

ctypes.windll.user32.mouse_event(0x0001, 10, 10, 0, 0)
time.sleep(0.5)
ctypes.windll.user32.mouse_event(0x0001, 15, 15, 0, 0)
time.sleep(0.5)

p.stdin.close()
p.wait()

print(p.stdout.read())
