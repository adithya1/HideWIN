import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, MessageCircle, User } from "lucide-react";

export default function Sessions() {
    const navigate = useNavigate();

    // Mock data for UI pixel-perfection
    const mockSessions = [
        { id: "1a", assistant: "inter", start: "Sep 18, 2026, 11:38 PM", duration: "21 Mins", user: "postbox.send@gmail.com" },
        { id: "2b", assistant: "inter", start: "Sep 18, 2026, 4:05 PM", duration: "29 Mins", user: "postbox.send@gmail.com" },
        { id: "3c", assistant: "inter", start: "Sep 18, 2026, 2:52 PM", duration: "7 Mins", user: "postbox.send@gmail.com" },
        { id: "4d", assistant: "inter", start: "Sep 16, 2026, 5:08 PM", duration: "11 Mins", user: "postbox.send@gmail.com" },
        { id: "5e", assistant: "inter", start: "Sep 16, 2026, 5:00 PM", duration: "5 Mins", user: "postbox.send@gmail.com" },
        { id: "6f", assistant: "inter", start: "Sep 16, 2026, 4:52 PM", duration: "7 Mins", user: "postbox.send@gmail.com" },
        { id: "7g", assistant: "inter", start: "Sep 11, 2026, 3:00 PM", duration: "5 Mins", user: "postbox.send@gmail.com" },
        { id: "8h", assistant: "inter", start: "Sep 11, 2026, 2:01 PM", duration: "2 Mins", user: "postbox.send@gmail.com" },
        { id: "9i", assistant: "inter", start: "Sep 11, 2026, 1:55 PM", duration: "2 Mins", user: "postbox.send@gmail.com" },
        { id: "10j", assistant: "inter", start: "Sep 11, 2026, 1:50 PM", duration: "2 Mins", user: "postbox.send@gmail.com" }
    ];

    const total = 28;

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: "0 0 8px 0" }}>Sessions</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#5f6368", fontSize: "14px" }}>Manage and track your recorded sessions</span>
                        <div style={{ border: "1px solid #dadce0", borderRadius: "16px", padding: "2px 10px", fontSize: "12px", color: "#5f6368", backgroundColor: "#fff" }}>
                            {total} total
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div style={{ border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                
                {/* Toolbar */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <Search size={20} color="#9aa0a6" />
                        <input 
                            type="text" 
                            placeholder="Search by assistant or user..." 
                            style={{ border: "none", outline: "none", fontSize: "14px", color: "#202124", width: "300px" }}
                        />
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "white", border: "1px solid #dadce0", borderRadius: "4px", padding: "6px 12px", fontSize: "13px", color: "#3c4043", fontWeight: "500", cursor: "pointer" }}>
                        <Filter size={14} /> Filters <ChevronDown size={14} />
                    </button>
                </div>

                {/* Table Header */}
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <div style={{ width: "60px" }}>NO</div>
                    <div style={{ flex: 1 }}>ASSISTANT</div>
                    <div style={{ flex: 1.5 }}>START TIME</div>
                    <div style={{ width: "120px" }}>DURATION</div>
                    <div style={{ flex: 2 }}>USER</div>
                </div>

                {/* Table Body */}
                {mockSessions.map((s, index) => (
                    <div key={s.id} style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "13px" }}>
                        <div style={{ width: "60px", color: "#5f6368" }}>{index + 1}</div>
                        <div style={{ flex: 1, color: "#1a73e8", fontWeight: "500", cursor: "pointer" }} onClick={() => navigate(`/session/${s.id}/transcript`)}>
                            {s.assistant}
                        </div>
                        <div style={{ flex: 1.5, color: "#5f6368" }}>{s.start}</div>
                        <div style={{ width: "120px" }}>
                            <span style={{ border: "1px solid #c2e0ff", backgroundColor: "#f0f4ff", color: "#1a73e8", borderRadius: "12px", padding: "2px 8px", fontSize: "11px", fontWeight: "600", display: "inline-block" }}>
                                {s.duration}
                            </span>
                        </div>
                        <div style={{ flex: 2, color: "#5f6368", display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={14} color="#9aa0a6" /> {s.user}
                        </div>
                    </div>
                ))}

                {/* Table Footer / Pagination */}
                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ color: "#5f6368", fontSize: "13px" }}>
                        Showing 1-10 of {total} sessions
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronsLeft size={16} /></button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronLeft size={16} /></button>
                        <button style={{ border: "none", background: "#1a73e8", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>1</button>
                        <button style={{ border: "none", background: "transparent", color: "#5f6368", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>2</button>
                        <button style={{ border: "none", background: "transparent", color: "#5f6368", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>3</button>
                        <button style={{ border: "none", background: "transparent", color: "#5f6368", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronRight size={16} /></button>
                        <button style={{ border: "none", background: "transparent", color: "#5f6368", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronsRight size={16} /></button>
                    </div>
                </div>
            </div>

            <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 12px rgba(26,115,232,0.4)", cursor: "pointer", zIndex: 1000 }}>
                <MessageCircle size={24} fill="currentColor" />
            </div>
        </div>
    );
}

const ChevronDown = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
