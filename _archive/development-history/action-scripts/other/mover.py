import ctypes
import time
time.sleep(1)
ctypes.windll.user32.mouse_event(0x0001, 10, 10, 0, 0)
