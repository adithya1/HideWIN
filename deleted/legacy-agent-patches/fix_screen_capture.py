import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

handler = """
    // WebRTC Screen Share Handler
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
            // Automatically select the primary screen
            if (sources && sources.length > 0) {
                callback({ video: sources[0], audio: 'loopback' });
            } else {
                callback({ video: null, audio: null });
            }
        }).catch(err => {
            console.error("Error getting screen sources:", err);
            callback({ video: null, audio: null });
        });
    });
"""

if "setDisplayMediaRequestHandler" not in text:
    # Inject it inside createWindow() or app.whenReady()
    # Let's find "app.whenReady().then(() => {"
    inject_target = "app.whenReady().then(() => {"
    if inject_target in text:
        text = text.replace(inject_target, inject_target + handler)
        
        # Ensure desktopCapturer is imported
        if "desktopCapturer" not in text.split("const {")[1].split("}")[0]:
            text = text.replace("const { app, BrowserWindow", "const { app, BrowserWindow, desktopCapturer, session")
        
        with open(p, "w", encoding="utf-8") as f:
            f.write(text)
        print("Injected setDisplayMediaRequestHandler into index.js!")
    else:
        print("Could not find app.whenReady()")
else:
    print("Already injected!")
