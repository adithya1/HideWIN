with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

scrollbar_css = """
            /* GLOBAL POSH SCROLLBAR (Same as picture) */
            ::-webkit-scrollbar {
                width: 14px !important;
                height: 14px !important;
            }
            ::-webkit-scrollbar-track {
                background: transparent !important;
                border-left: 1px solid rgba(0,0,0,0.05);
            }
            ::-webkit-scrollbar-thumb {
                background-color: #c1c1c1 !important;
                border-radius: 10px !important;
                border: 3px solid #f3f3f3 !important;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #a8a8a8 !important;
            }
            ::-webkit-scrollbar-button:single-button {
                background-color: transparent !important;
                display: block !important;
                height: 14px !important;
                width: 14px !important;
            }
            ::-webkit-scrollbar-button:single-button:vertical:decrement {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 14l5-5 5 5z'/></svg>") !important;
                background-size: 12px !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
            }
            ::-webkit-scrollbar-button:single-button:vertical:increment {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1a1'><path d='M7 10l5 5 5-5z'/></svg>") !important;
                background-size: 12px !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
            }
        </style>"""

if "GLOBAL POSH SCROLLBAR" not in content:
    content = content.replace("</style>", scrollbar_css)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected global CSS into index.html")
