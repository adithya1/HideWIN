# DESKTOP APPLICATION ARCHITECTURE

## Overview
The Hide-WIN desktop application (`apps/desktop`) is built on Electron. To guarantee stability and security for enterprise users, the architecture strictly enforces the boundary between the OS-level Node.js environment (Main) and the Chromium web environment (Renderer).

## Process Separation
- **Main Process**: Manages application lifecycle, native OS APIs (Screen Capture, Global Shortcuts, Audio Routing), auto-updating, and file I/O.
- **Renderer Process**: The React/Web UI. Strictly sandboxed. Handles DOM rendering, WebRTC signaling, and user interactions.
- **Preload Scripts**: The *only* bridge between Renderer and Main. Injects a secure, explicitly defined API (e.g., `window.electronAPI`) into the Renderer.
- **Native Modules**: Written in C++/Rust (or statically linked binaries like FFmpeg) for high-performance audio/video processing, abstracted behind Main process wrappers.

## Enterprise Features
- **Auto-Updater**: Integrates `electron-updater` with a secure update server. Updates are downloaded in the background and applied on restart.
- **Crash Reporting**: Integrates `electron.crashReporter` to ship native minidumps to an external crash ingestion service.
- **Offline Support**: Renders a graceful "No Connection" UI. Local settings and recent meeting metadata are cached via `electron-store`.
- **Code Signing**: Windows (`.exe`) installers are EV Code Signed, and macOS (`.dmg`) binaries are notarized by Apple to bypass SmartScreen/Gatekeeper warnings.
