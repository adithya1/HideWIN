import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

revoke_func = """
    revokeControl(guestId) {
        if (this.activeControllerId === guestId) {
            const dc = this.dataChannels.get(guestId);
            if (dc && dc.events && dc.events.readyState === 'open') {
                dc.events.send(JSON.stringify({ type: 'control_revoked' }));
            }
            this.activeControllerId = 'host';
            this.requestUpdate();
            this.showToast("Control revoked.", "success");
        }
    }
"""
if "revokeControl(" not in content:
    content = content.replace("grantControl(guestId) {", revoke_func + "\n    grantControl(guestId) {")

# Replace mute button with Soft/Hard mute
old_mute = """${p.status === 'active' && p.id !== 'me' ? html`
                                                                <button style="background:transparent; border:none; cursor:pointer; color:#ef4444;" title="Mute Participant" @click=${() => this.ws.send(JSON.stringify({type: 'mute_user', target: p.id}))}>
                                                                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                                                </button>
                                                            ` : ''}"""

new_mute = """${p.status === 'active' && p.id !== 'me' ? html`
                                                                <button style="background:#fee2e2; border:none; cursor:pointer; color:#ef4444; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Soft Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'soft_mute_mic', target: p.id})); this.showToast("Requested soft mute", "success"); }}>S-Mute</button>
                                                                <button style="background:#7f1d1d; border:none; cursor:pointer; color:white; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Hard Mute Mic" @click=${() => { this.ws.send(JSON.stringify({type: 'hard_mute_mic', target: p.id})); this.showToast("Forced hard mute", "success"); }}>H-Mute</button>
                                                            ` : ''}"""
content = content.replace(old_mute, new_mute)

# Also add the revoke button to the UI where it says "Control"
old_control = """${this.activeControllerId === p.id ? html`<span title="Has Control" style="font-size:12px; background:#e0e7ff; color:#4338ca; padding: 2px 6px; border-radius: 4px;">Control</span>` : ''}"""
new_control = """${this.activeControllerId === p.id ? html`
                                                                <span title="Has Control" style="font-size:11px; background:#e0e7ff; color:#4338ca; padding: 3px 6px; border-radius: 4px; font-weight: 600;">Control</span>
                                                                <button style="background:#fee2e2; color:#ef4444; border:none; cursor:pointer; font-size:11px; padding: 3px 6px; border-radius: 4px; font-weight: 600;" title="Revoke Control" @click=${() => this.revokeControl(p.id)}>Revoke</button>
                                                            ` : ''}"""
content = content.replace(old_control, new_control)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated InviteView.js with new features")
