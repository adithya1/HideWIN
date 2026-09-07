# Architecture

HideWin is built on Electron and LitElement, utilizing a transparent, click-through overlay architecture.

## Core Components
1. **HideWinApp (Root Component)**: Manages global state, routing, and the live bar.
2. **MainView**: The dashboard for selecting modes and starting sessions.
3. **Stealth Overlay System**: Utilizes Electron's \setIgnoreMouseEvents\ to allow click-through while rendering a fake cursor to maintain UI interaction within the shadow DOM.
4. **Media Capture**: Uses loopback and desktop capturer to stream data to the local AI backend.
