import re

with open('src/components/app/HideWinAppEvents.js', 'r', encoding='utf-8') as f:
    content = f.read()

original = """
                    if (data && data.token && data.hash) {
                        if (window.hideWin && window.hideWin.storage) {
                            let creds = {};
                            try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                            await window.hideWin.storage.setCredentials({
                                ...creds,
                                jwtToken: data.token,
                                hashkey: data.hash,
                                user: data.user || creds.user
                            });
                        }
                    }
"""

replacement = """
                    if (data && data.token && data.hash) {
                        let finalToken = data.token;
                        const verifier = localStorage.getItem('pkce_code_verifier');
                        if (verifier && finalToken && !finalToken.includes('.')) {
                            try {
                                const tokenRes = await fetch('https://app.huddlemate.ai/oauth/token', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: new URLSearchParams({
                                        grant_type: 'authorization_code',
                                        client_id: 'c0b65c72458d40d5a3f477dcf3c07f4c',
                                        code: finalToken,
                                        redirect_uri: 'huddlemate://callback',
                                        code_verifier: verifier
                                    })
                                });
                                if (tokenRes.ok) {
                                    const tokenData = await tokenRes.json();
                                    finalToken = tokenData.access_token || tokenData.id_token || finalToken;
                                }
                                localStorage.removeItem('pkce_code_verifier');
                                localStorage.removeItem('pkce_state');
                            } catch(err) {
                                console.error("PKCE exchange failed", err);
                            }
                        }

                        if (window.hideWin && window.hideWin.storage) {
                            let creds = {};
                            try { creds = await window.hideWin.storage.getCredentials() || {}; } catch(e) {}
                            await window.hideWin.storage.setCredentials({
                                ...creds,
                                jwtToken: finalToken,
                                hashkey: data.hash,
                                user: data.user || creds.user
                            });
                        }
                    }
"""

# replace ignoring exact whitespace
# use regex to find the block
pattern = r"if\s*\(data && data\.token && data\.hash\)\s*\{\s*if\s*\(window\.hideWin && window\.hideWin\.storage\)\s*\{\s*let creds = \{\};\s*try\s*\{\s*creds = await window\.hideWin\.storage\.getCredentials\(\) \|\| \{\};\s*\}\s*catch\(e\)\s*\{\}\s*await window\.hideWin\.storage\.setCredentials\(\{\s*\.\.\.creds,\s*jwtToken:\s*data\.token,\s*hashkey:\s*data\.hash,\s*user:\s*data\.user \|\| creds\.user\s*\}\);\s*\}\s*\}"

content = re.sub(pattern, replacement, content)

with open('src/components/app/HideWinAppEvents.js', 'w', encoding='utf-8') as f:
    f.write(content)
