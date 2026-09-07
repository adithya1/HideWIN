# DESKTOP SECURITY BASELINE

## 1. Chromium Sandboxing (MANDATORY)
Every `BrowserWindow` created in the Main process MUST enforce:
```javascript
webPreferences: {
    nodeIntegration: false,      // NEVER allow require() in Renderer
    contextIsolation: true,      // Separate `window` objects
    sandbox: true,               // OS-level Chromium sandbox
    webSecurity: true,           // Enforce CORS/SOP
    allowRunningInsecureContent: false
}
```

## 2. Remote Content Restrictions
- **No `remote` module**: The `@electron/remote` module is strictly banned due to critical RCE vulnerabilities.
- **Navigation Control**: Intercept `webContents.on('will-navigate')`. Only allow navigation to trusted Hide-WIN domains. All external links must open in the user's default OS browser via `shell.openExternal()`.

## 3. Protocol Handlers
Custom protocol handlers (`hidewin://`) must validate the URL payload structure before parsing it or passing it to the authentication service.

## 4. XSS to RCE Prevention
By enforcing `contextIsolation: true` and `nodeIntegration: false`, we guarantee that even if an attacker successfully executes a Cross-Site Scripting (XSS) attack in the React UI, they CANNOT escalate it to a Remote Code Execution (RCE) attack on the host machine.
