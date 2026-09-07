# API Documentation

HideWin communicates with several external APIs and internal IPC channels.

## External APIs
- **Google Gemini API**: Endpoint for sending screen captures and audio data for real-time analysis. Requires a valid API key.

## Internal IPC Channels
- \update-stealth-cursor-style\: Controls the visibility of the stealth cursor.
- \move-stealth-cursor\: Synchronizes cursor movement.
- \stealth-click-at\: Dispatches native click events through the shadow DOM.
