import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Info, Monitor } from "lucide-react";

export default function SessionDetail() {
    const { id, tab } = useParams();
    const navigate = useNavigate();

    const activeTab = tab || "transcript";

    const mockTranscript = [
        { time: "4:06:05 PM", text: "Asynchronization calls point of view. I'm using asynchronous weight. Both are the AI projects so I also used the agentic multi-agent frameworks like Langchain, Langgraph, Drag and vector databases and MCP fast MCP and also the modules are used whisper for text." },
        { time: "4:06:05 PM", text: "Asynchronization calls point of view. I'm using asynchronous weight. Both are the AI projects so I also used the agentic multi-agent frameworks like Langchain, Langgraph, Drag and vector databases and MCP fast MCP and also the modules are used whisper for text." },
        { time: "4:06:12 PM", text: "Voice to text conversions and Llama induction parsers I used for the recent projects." }
    ];

    const mockResponses = [
        { no: "1", q: "Can you brief me on the projects you worked on at Cisco?", a: "At **Cisco**, I worked mainly on the ASA...", time: "9/18/2026, 4:07:33 PM" },
        { no: "2", q: "What are *args and **kwargs in Python?", a: "Yes. I use **args and **kwargs when I need a fu...", time: "9/18/2026, 4:09:50 PM" },
        { no: "3", q: "Can you compare Flask and Django based on your experience?", a: "Yes. I have worked with both **Flask...", time: "9/18/2026, 4:10:42 PM" },
        { no: "4", q: "What is asynchronous programming in Python, and why do I need it?", a: "**Asynchronous programming al...", time: "9/18/2026, 4:12:18 PM" },
        { no: "5", q: "Given a nested Python dictionary containing scores as strings, nested dictionaries, and lists of t...", a: "", time: "9/18/2026, 4:13:35 PM" }
    ];

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <button 
                    onClick={() => navigate('/sessions')}
                    style={{ background: "transparent", border: "1px solid #dadce0", borderRadius: "4px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500", color: "#3c4043", cursor: "pointer", marginBottom: "20px" }}
                >
                    <ArrowLeft size={16} /> Back to Sessions
                </button>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: 0 }}>
                    inter - 9/18/2026, 4:05:36 PM
                </h1>
            </div>

            {/* Layout Grid */}
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                
                {/* Left Column: Content */}
                <div style={{ flex: 2, border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                    {/* Tabs Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e8eaed" }}>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#202124" }}>Session Content</div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div 
                                onClick={() => navigate(`/session/${id}/transcript`)}
                                style={{ fontSize: "14px", fontWeight: "500", color: activeTab === 'transcript' ? "#1a73e8" : "#5f6368", borderBottom: activeTab === 'transcript' ? "2px solid #1a73e8" : "2px solid transparent", paddingBottom: "16px", marginBottom: "-17px", cursor: "pointer" }}
                            >
                                Transcript
                            </div>
                            <div 
                                onClick={() => navigate(`/session/${id}/responses`)}
                                style={{ fontSize: "14px", fontWeight: "500", color: activeTab === 'responses' ? "#1a73e8" : "#5f6368", borderBottom: activeTab === 'responses' ? "2px solid #1a73e8" : "2px solid transparent", paddingBottom: "16px", marginBottom: "-17px", cursor: "pointer" }}
                            >
                                AI Responses
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: "24px", minHeight: "500px" }}>
                        {activeTab === 'transcript' && (
                            <>
                                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                                    <button style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "white", color: "#1a73e8", border: "1px solid #c2e0ff", padding: "8px 16px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                                        <Copy size={16} /> Copy transcript
                                    </button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    {mockTranscript.map((msg, i) => (
                                        <div key={i}>
                                            <div style={{ fontSize: "11px", color: "#9aa0a6", marginBottom: "4px" }}>{msg.time}</div>
                                            <div style={{ fontSize: "14px", color: "#3c4043", lineHeight: "1.6" }}>{msg.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activeTab === 'responses' && (
                            <div style={{ border: "1px solid #e8eaed", borderRadius: "8px", overflow: "hidden" }}>
                                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase" }}>
                                    <div style={{ width: "40px" }}>NO</div>
                                    <div style={{ flex: 1 }}>RESPONSE</div>
                                    <div style={{ width: "160px", textAlign: "right" }}>TIME</div>
                                </div>
                                {mockResponses.map(r => (
                                    <div key={r.no} style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "flex-start", fontSize: "13px" }}>
                                        <div style={{ width: "40px", color: "#1a73e8", fontWeight: "500" }}>{r.no}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "600", color: "#202124", marginBottom: "4px" }}>{r.q}</div>
                                            <div style={{ color: "#5f6368" }}>{r.a}</div>
                                        </div>
                                        <div style={{ width: "160px", textAlign: "right", color: "#9aa0a6" }}>{r.time}</div>
                                    </div>
                                ))}
                                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa" }}>
                                    <div style={{ color: "#5f6368", fontSize: "13px" }}>Showing 1-5 of 5 responses</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}>{"<"}</button>
                                        <button style={{ border: "none", background: "#1a73e8", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500" }}>1</button>
                                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}>{">"}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Information */}
                <div style={{ flex: 1, border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", padding: "24px" }}>
                    <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "600", color: "#202124" }}>Session Information</h3>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8" }}>
                            <Info size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: "600", color: "#202124", fontSize: "14px" }}>inter</div>
                            <div style={{ color: "#9aa0a6", fontSize: "12px", marginTop: "2px" }}>9/18/2026, 4:05:36 PM</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>Assistant</span>
                            <span style={{ color: "#1a73e8", cursor: "pointer" }}>inter</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>Start time</span>
                            <span style={{ color: "#9aa0a6" }}>9/18/2026, 4:05:36 PM</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>End time</span>
                            <span style={{ color: "#9aa0a6" }}>9/18/2026, 4:33:38 PM</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>Duration</span>
                            <span style={{ color: "#9aa0a6" }}>29m</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>Used by</span>
                            <span style={{ color: "#1a73e8", cursor: "pointer" }}>postbox.send@gmail.com</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                            <span style={{ color: "#202124", fontWeight: "500" }}>Platform</span>
                            <span style={{ color: "#9aa0a6", display: "flex", alignItems: "center", gap: "6px" }}><Monitor size={14} /> Desktop App</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
