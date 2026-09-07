path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inject global button standards near the top of the shared CSS
button_standards = """
        /* ===== Global Button Standards (Native .exe feel) =====
           No bounce, no translateY, no scale transforms.
           Buttons respond only through colour & shadow changes. */
        button {
            -webkit-user-select: none;
            user-select: none;
            cursor: pointer;
        }
        
        button:active,
        .btn:active,
        .btn-primary:active,
        .btn-secondary:active,
        .toolbar-btn:active,
        .nav-item:active,
        .action-btn:active,
        .icon-btn:active,
        .hdr-icon-btn:active {
            transform: none !important;
            filter: brightness(0.88) !important;
            box-shadow: none !important;
            transition: none !important;
        }
        
        button:hover,
        .btn:hover,
        .btn-primary:hover,
        .btn-secondary:hover {
            transform: none !important;
        }
        
        /* Prevent any animation on button text or children */
        button *, .btn * {
            pointer-events: none;
        }
        /* ===================================================== */
"""

# Inject right after the opening css` tag  
css_tag = "css`"
idx = content.find(css_tag)
if idx >= 0:
    # find the next newline after the opening
    nl = content.find('\n', idx)
    content = content[:nl+1] + button_standards + content[nl+1:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected global button standards into sharedPageStyles.js")
else:
    print("css` tag not found")
