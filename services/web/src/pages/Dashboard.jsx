import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tplRes = await fetch("http://127.0.0.1:8000/user/assistants/templates");
                if (tplRes.ok) setTemplates(await tplRes.json());
                
                const astRes = await fetch("http://127.0.0.1:8000/user/assistants/");
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

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#5f6368" }}>Loading dashboard...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }} className="animate-fade-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ background: "linear-gradient(135deg, #1a73e8, #a855f7)", padding: "8px", borderRadius: "8px", color: "white" }}>
                    <Sparkles size={20} />
                </div>
                <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#111827", letterSpacing: "-0.02em" }}>Launch Now</h1>
            </div>
            <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px", fontWeight: "500" }}>Start fast with ready-to-use meeting co-pilots.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "24px", marginBottom: "56px" }}>
                {templates.map((tpl, i) => (
                    <div 
                        key={tpl.id} 
                        className={`posh-card animate-fade-slide-up stagger-${(i % 3) + 1}`}
                        style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", cursor: "pointer" }}
                        onClick={() => handleLaunchTemplate(tpl.id)}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Play size={20} fill="currentColor" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{tpl.name}</h3>
                        </div>
                        <p style={{ color: "#64748b", fontSize: "15px", flex: 1, marginBottom: "28px", lineHeight: "1.6" }}>
                            {tpl.description || "A ready-to-use co-pilot for your meetings."}
                        </p>
                        <button 
                            className="posh-button"
                            onClick={(e) => { e.stopPropagation(); handleLaunchTemplate(tpl.id); }}
                            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid transparent", padding: "10px 20px", borderRadius: "100px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                        >
                            Launch <span style={{ color: "#3b82f6" }}>&rarr;</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="animate-fade-slide-up stagger-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#111827", letterSpacing: "-0.01em" }}>Assistants</h2>
                    <p style={{ color: "#64748b", fontSize: "15px", margin: "6px 0 0 0" }}>Your personalized co-pilots, ready to use again.</p>
                </div>
                <button className="posh-button" style={{ background: "transparent", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>View all &rarr;</button>
            </div>

            <div className="posh-card animate-fade-slide-up stagger-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
                {assistants.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontWeight: "500" }}>No assistants created yet.</div>
                ) : (
                    assistants.map((ast, i) => (
                        <div key={ast.id} style={{ display: "flex", alignItems: "center", padding: "20px 28px", borderBottom: i < assistants.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.backgroundColor="#f8fafc"} onMouseOut={e => e.currentTarget.style.backgroundColor="transparent"}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: i % 2 === 0 ? "#3b82f6" : "#22c55e", marginRight: "20px", boxShadow: `0 0 8px ${i % 2 === 0 ? "#3b82f688" : "#22c55e88"}` }}></div>
                            <span style={{ flex: 1, fontWeight: "600", color: "#1e293b", fontSize: "15px" }}>{ast.name}</span>
                            <span style={{ color: "#cbd5e1", transition: "transform 0.2s" }} className="arrow-icon">&gt;</span>
                        </div>
                    ))
                )}
            </div>
            <style>
                {`
                div:hover > .arrow-icon { transform: translateX(4px); color: #3b82f6 !important; }
                `}
            </style>
        </div>
    );
}
