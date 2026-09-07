# Security Review

- **API Keys**: Stored locally. Never transmitted to third-party servers other than Google API directly.
- **Screen Capture**: Only active during a "Live Session". Handled securely via Electron's \desktopCapturer\.
- **Network**: All external requests are made over HTTPS.
- **Dependencies**: Regular \
pm audit\ checks are recommended to patch vulnerabilities in Electron or Lit.
