import React from "react";
import { Gift, Copy, Mail, MessageSquare, Send, Tag } from "lucide-react";

export default function Refer() {
    const inviteCode = "1E52G1";
    const inviteUrl = `${window.location.origin}/signup?invite=${inviteCode}`;

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: "0 0 8px 0" }}>
                    Refer & Earn
                </h1>
                <div style={{ color: "#5f6368", fontSize: "14px" }}>
                    Invite friends and earn credits.
                </div>
            </div>

            {/* Top Banner */}
            <div style={{ backgroundColor: "#f0f4f9", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", border: "1px solid #e8eaed" }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "48px", height: "48px", backgroundColor: "#d2e3fc", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8" }}>
                        <Gift size={24} />
                    </div>
                    <div style={{ color: "#3c4043", fontSize: "15px" }}>
                        Your friend gets <strong style={{ color: "#202124" }}>$5 off</strong> and you get <strong style={{ color: "#202124" }}>60 credits</strong> on their first<br/>purchase.
                    </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    {[ { v: "0", l: "Friends joined" }, { v: "0", l: "Pending reward" }, { v: "0", l: "Credits earned" } ].map((stat, i) => (
                        <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e8eaed", borderRadius: "8px", padding: "16px 20px", width: "120px", textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1a73e8", marginBottom: "4px" }}>{stat.v}</div>
                            <div style={{ fontSize: "11px", color: "#5f6368", fontWeight: "500" }}>{stat.l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                
                {/* Left Card: Share */}
                <div style={{ flex: 1.5, backgroundColor: "#fff", border: "1px solid #e8eaed", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#202124" }}>Share your invite</h3>
                    <div style={{ color: "#5f6368", fontSize: "13px", marginBottom: "24px" }}>Send your code or link below.</div>

                    {/* Dashed Box */}
                    <div style={{ border: "1px dashed #aecbfa", backgroundColor: "#f8faff", borderRadius: "8px", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>YOUR CODE</div>
                        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#1a73e8", letterSpacing: "0.1em", marginBottom: "24px", fontFamily: "monospace" }}>{inviteCode}</div>
                        <button style={{ backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", padding: "10px 24px", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <Copy size={16} /> Copy code
                        </button>
                    </div>

                    {/* Referral Link */}
                    <div style={{ marginBottom: "32px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>REFERRAL LINK</div>
                        <div style={{ display: "flex", alignItems: "stretch", height: "40px" }}>
                            <input 
                                type="text" 
                                readOnly 
                                value={inviteUrl} 
                                style={{ flex: 1, padding: "0 16px", border: "1px solid #dadce0", borderRight: "none", borderRadius: "4px 0 0 4px", fontSize: "13px", color: "#3c4043", backgroundColor: "#f8f9fa", outline: "none" }} 
                            />
                            <button style={{ backgroundColor: "#fff", color: "#1a73e8", border: "1px solid #dadce0", borderRadius: "0 4px 4px 0", padding: "0 20px", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <Copy size={16} /> Copy
                            </button>
                        </div>
                    </div>

                    {/* Share via */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ fontSize: "13px", color: "#5f6368" }}>Share via</div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button style={{ background: "transparent", border: "1px solid #dadce0", borderRadius: "4px", padding: "8px", color: "#5f6368", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={16} /></button>
                            <button style={{ background: "transparent", border: "1px solid #dadce0", borderRadius: "4px", padding: "8px", color: "#5f6368", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MessageSquare size={16} /></button>
                            <button style={{ background: "transparent", border: "1px solid #dadce0", borderRadius: "4px", padding: "8px", color: "#5f6368", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></button>
                        </div>
                    </div>
                </div>

                {/* Right Card: How it works */}
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e8eaed", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ margin: "0 0 32px 0", fontSize: "14px", fontWeight: "600", color: "#202124" }}>How it works</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: "19px", top: "20px", bottom: "30px", width: "2px", backgroundColor: "#e8eaed", zIndex: 0 }}></div>

                        {/* Step 1 */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "40px", position: "relative", zIndex: 1 }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#e8f0fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8", flexShrink: 0 }}>
                                <Send size={18} />
                            </div>
                            <div style={{ paddingTop: "8px" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#202124", marginBottom: "4px" }}>Share your invite</div>
                                <div style={{ fontSize: "13px", color: "#5f6368", lineHeight: "1.5" }}>Send a friend your link or code.</div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "40px", position: "relative", zIndex: 1 }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#e8f0fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8", flexShrink: 0 }}>
                                <Tag size={18} />
                            </div>
                            <div style={{ paddingTop: "8px" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#202124", marginBottom: "4px" }}>They join through you</div>
                                <div style={{ fontSize: "13px", color: "#5f6368", lineHeight: "1.5" }}>Your friend signs up with your link or enters your code at checkout to get $5 off on their first purchase.</div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: "flex", gap: "20px", position: "relative", zIndex: 1 }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#e8f0fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8", flexShrink: 0 }}>
                                <Gift size={18} />
                            </div>
                            <div style={{ paddingTop: "8px" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", color: "#202124", marginBottom: "4px" }}>You earn 60 credits</div>
                                <div style={{ fontSize: "13px", color: "#5f6368", lineHeight: "1.5" }}>When they make their first purchase.</div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
