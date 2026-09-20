import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, LayoutGrid, Bookmark, Monitor, HelpCircle, FileText, ChevronRight, Loader2, MessageCircle } from "lucide-react";
import { API_BASE } from "../config";

export default function Dashboard() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tplRes = await fetch(`${API_BASE}/user/assistants/templates`);
                if (tplRes.ok) {
                    setTemplates(await tplRes.json());
                }
                
                const astRes = await fetch(`${API_BASE}/user/assistants/`);
                if (astRes.ok) setAssistants(await astRes.json());
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLaunchTemplate = (templateId) => {
        navigate(`/assistant/create?templateId=${templateId}`);
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#6b7280" }}>
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    // Fallback templates if none match exactly, to recreate the screenshot visually
    const interviewTpl = templates.find(t => t.name.toLowerCase().includes('interview')) || { id: 1, name: 'Interview', description: 'A real-time interview co-pilot that helps you answer faster and more confidently.' };
    const triviaTpl = templates.find(t => t.name.toLowerCase().includes('trivia')) || { id: 2, name: 'Trivia & Quiz', description: 'A quick-answer co-pilot for trivia games, quizzes, and rapid-fire Q&A.' };
    const customTpl = templates.find(t => t.name.toLowerCase().includes('custom')) || { id: 3, name: 'Custom', description: 'A flexible co-pilot you can fully customize to fit any meeting.' };

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1000px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <p style={{ color: "#1a73e8", margin: "0 0 32px 0", fontSize: "16px", fontWeight: "500" }}>Launch an AI assistant for your next meeting.</p>

            {/* Launch Now Section */}
            <div style={{ marginBottom: "48px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <LayoutGrid size={20} color="#1a73e8" />
                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#202124", margin: 0 }}>Launch Now</h2>
                </div>
                <p style={{ color: "#5f6368", fontSize: "14px", margin: "0 0 20px 0" }}>Start fast with ready-to-use meeting co-pilots.</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {/* Interview Card */}
                    <div style={{ border: "1px solid #e8eaed", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "20px", backgroundColor: "#f8faff", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", gap: "12px" }}>
                            <Monitor size={20} color="#1a73e8" />
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#202124" }}>{interviewTpl.name}</h3>
                        </div>
                        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <p style={{ color: "#5f6368", fontSize: "14px", lineHeight: "1.5", margin: "0 0 24px 0", flex: 1 }}>{interviewTpl.description}</p>
                            <button onClick={() => handleLaunchTemplate(interviewTpl.id)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f0f4ff", color: "#1a73e8", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "600", fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" }}>
                                <Play size={14} fill="currentColor" /> Launch
                            </button>
                        </div>
                    </div>

                    {/* Trivia Card */}
                    <div style={{ border: "1px solid #e8eaed", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "20px", backgroundColor: "#f8faff", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", gap: "12px" }}>
                            <HelpCircle size={20} color="#1a73e8" />
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#202124" }}>{triviaTpl.name}</h3>
                        </div>
                        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <p style={{ color: "#5f6368", fontSize: "14px", lineHeight: "1.5", margin: "0 0 24px 0", flex: 1 }}>{triviaTpl.description}</p>
                            <button onClick={() => handleLaunchTemplate(triviaTpl.id)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f0f4ff", color: "#1a73e8", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "600", fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" }}>
                                <Play size={14} fill="currentColor" /> Launch
                            </button>
                        </div>
                    </div>

                    {/* Custom Card */}
                    <div style={{ border: "1px solid #e8eaed", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ padding: "20px", backgroundColor: "#f8faff", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", gap: "12px" }}>
                            <FileText size={20} color="#1a73e8" />
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#202124" }}>{customTpl.name}</h3>
                        </div>
                        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <p style={{ color: "#5f6368", fontSize: "14px", lineHeight: "1.5", margin: "0 0 24px 0", flex: 1 }}>{customTpl.description}</p>
                            <button onClick={() => handleLaunchTemplate(customTpl.id)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f0f4ff", color: "#1a73e8", border: "none", padding: "8px 20px", borderRadius: "20px", fontWeight: "600", fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" }}>
                                <Play size={14} fill="currentColor" /> Launch
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assistants Section */}
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Bookmark size={20} color="#1a73e8" fill="currentColor" />
                        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#202124", margin: 0 }}>Assistants</h2>
                    </div>
                    <button style={{ color: "#1a73e8", background: "none", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        View all &rarr;
                    </button>
                </div>
                <p style={{ color: "#5f6368", fontSize: "14px", margin: "0 0 20px 0" }}>Your personalized co-pilots, ready to use again.</p>

                <div style={{ border: "1px solid #e8eaed", borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    {assistants.length === 0 ? (
                        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", borderBottom: "1px solid #f1f3f4", cursor: "pointer" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1a73e8", marginRight: "16px" }}></div>
                            <div style={{ flex: 1, fontWeight: "600", color: "#3c4043", fontSize: "15px" }}>inter</div>
                            <ChevronRight size={20} color="#dadce0" />
                        </div>
                    ) : (
                        assistants.map((ast, i) => (
                            <div key={ast.id} style={{ padding: "20px 24px", display: "flex", alignItems: "center", borderBottom: i < assistants.length - 1 ? "1px solid #f1f3f4" : "none", cursor: "pointer" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i % 2 === 0 ? "#1a73e8" : "#34a853", marginRight: "16px" }}></div>
                                <div style={{ flex: 1, fontWeight: "600", color: "#3c4043", fontSize: "15px" }}>{ast.name}</div>
                                <ChevronRight size={20} color="#dadce0" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FAB */}
            <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 12px rgba(26,115,232,0.4)", cursor: "pointer", zIndex: 1000 }}>
                <MessageCircle size={24} fill="currentColor" />
            </div>
        </div>
    );
}
