import ctypes
import time

user32 = ctypes.windll.user32
# 32514 = IDC_WAIT, 32650 = IDC_APPSTARTING

wait = user32.LoadCursorW(None, 32514)
app_starting = user32.LoadCursorW(None, 32650)
arrow = user32.LoadCursorW(None, 32512)

# Just run this to see if I can set it via python for testing
