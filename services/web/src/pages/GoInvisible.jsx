import React, { useState, useEffect } from "react";
import { Info, EyeOff } from "lucide-react";
import { API_BASE } from "../config";

export default function GoInvisible() {
    const [branding, setBranding] = useState({ logo_light: '', logo_dark: '', browser_icon: '' });

    useEffect(() => {
        fetch(`${API_BASE}/auth/branding`)
            .then(res => res.json())
            .then(data => setBranding(data))
            .catch(err => console.error('Failed to load branding', err));
    }, []);

    return (
        <div style={{ backgroundColor: "#1e293b", minHeight: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "80px", paddingBottom: "120px", fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ backgroundColor: '#db4a30', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>BETA</span>
                {branding.logo_dark ? (
                    <img src={branding.logo_dark} alt="HideWin Desktop" style={{ height: '24px', objectFit: 'contain' }} />
                ) : (
                    <span style={{ color: '#7b8c9c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em' }}>HIDEWIN DESKTOP</span>
                )}
            </div>

            <h1 style={{ fontSize: "56px", fontWeight: "bold", color: "#ffffff", margin: "0 0 32px 0", textAlign: "center" }}>Go Invisible!</h1>

            <p style={{ color: "#cbd5e1", fontSize: "17px", lineHeight: "1.6", textAlign: "center", maxWidth: "700px", margin: "0 0 48px 0" }}>
                HideWin Desktop listens to your meeting, sees your screen, and gives you instant answers when you need them. You can even ask it to solve what's on your screen -- perfect for coding, quiz or problem-solving. It remains invisible to screen sharing and can be placed anywhere on your display, so support stays right where you need it, without ever getting noticed.
            </p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <button style={{ backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "30px", padding: "16px 32px", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    Download for Windows
                    <span style={{ backgroundColor: "#22c55e", color: "white", fontSize: "10px", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold" }}>YOUR OS</span>
                </button>
                <button style={{ backgroundColor: "transparent", color: "white", border: "1px solid #475569", borderRadius: "30px", padding: "16px 32px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
                    Download for macOS
                </button>
            </div>

            <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "48px" }}>
                Currently in BETA * Windows v10+ & macOS v13.3+
            </div>

            <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "24px", maxWidth: "750px", marginBottom: "24px", color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6" }}>
                <strong style={{ color: "#ef4444" }}>IMPORTANT:</strong> Invisible mode requires <strong>Windows 10+</strong> or <strong>macOS 13.3+</strong>. If you attend meetings on Zoom desktop app, use <strong>Zoom v6.16 or older</strong>, or if you're on <strong>Zoom &gt; v6.16</strong> enable <strong>Advanced capture with window filtering</strong> in Zoom's screen capture mode settings for invisible mode to work. <span style={{ textDecoration: "underline", cursor: "pointer" }}>Zoom instructions</span>.
            </div>

            <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px 24px", width: "100%", maxWidth: "550px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", color: "#cbd5e1", fontSize: "14px" }}>
                <Info size={18} color="#94a3b8" />
                <span>If you have any questions, feedback, or feature requests <span style={{ textDecoration: "underline", cursor: "pointer" }}>contact us</span>.</span>
            </div>

            <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px 24px", width: "100%", maxWidth: "550px", display: "flex", alignItems: "center", gap: "12px", color: "#cbd5e1", fontSize: "14px" }}>
                <EyeOff size={18} color="#94a3b8" />
                <span>Already installed? <span style={{ textDecoration: "underline", cursor: "pointer" }}>Test invisibility</span> to verify it works on your machine.</span>
            </div>
            
            <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 12px rgba(59,130,246,0.4)", cursor: "pointer", zIndex: 1000 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
        </div>
    );
}
