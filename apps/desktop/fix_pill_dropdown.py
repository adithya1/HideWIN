import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

pill_dropdown_css = """
        .pill-dropdown-wrapper { 
            flex: 1; 
            min-width: 180px; 
            display: flex; 
            flex-direction: column; 
            position: relative; 
        }
"""
if ".pill-dropdown-wrapper {" not in main:
    main = main.replace(".action-bar-pill {", pill_dropdown_css + "\n        .action-bar-pill {")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Restored position:relative for dropdown wrappers.")
