import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic templates
                const tplRes = await fetch("http://localhost:8000/user/assistants/templates");
                if (tplRes.ok) setTemplates(await tplRes.json());
                
                // Fetch user assistants
                const astRes = await fetch("http://localhost:8000/user/assistants/");
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

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", color: "#202124" }}>Launch Now</h1>
            <p style={{ color: "#5f6368", marginBottom: "24px", fontSize: "14px" }}>Start fast with ready-to-use meeting co-pilots.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
                {templates.map(tpl => (
                    <div key={tpl.id} style={{ backgroundColor: "#f8fafd", border: "1px solid #e8eaed", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            {/* Simple icon placeholder based on name */}
                            <div style={{ color: "#1a73e8" }}>
                                <Play size={24} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#202124" }}>{tpl.name}</h3>
                        </div>
                        <p style={{ color: "#5f6368", fontSize: "14px", flex: 1, marginBottom: "24px" }}>
                            {tpl.description || "A ready-to-use co-pilot for your meetings."}
                        </p>
                        <button 
                            onClick={() => handleLaunchTemplate(tpl.id)}
                            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#e8f0fe", color: "#1a73e8", border: "none", padding: "8px 16px", borderRadius: "20px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                        >
                            <Play size={14} fill="currentColor" /> Launch
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#202124" }}>Assistants</h2>
                    <p style={{ color: "#5f6368", fontSize: "14px", margin: "4px 0 0 0" }}>Your personalized co-pilots, ready to use again.</p>
                </div>
                <button style={{ background: "transparent", border: "none", color: "#1a73e8", fontWeight: "600", cursor: "pointer" }}>View all &rarr;</button>
            </div>

            <div style={{ backgroundColor: "#fff", border: "1px solid #e8eaed", borderRadius: "12px", overflow: "hidden" }}>
                {assistants.length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "#5f6368" }}>No assistants created yet.</div>
                ) : (
                    assistants.map((ast, i) => (
                        <div key={ast.id} style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: i < assistants.length - 1 ? "1px solid #e8eaed" : "none", cursor: "pointer" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i % 2 === 0 ? "#1a73e8" : "#34a853", marginRight: "16px" }}></div>
                            <span style={{ flex: 1, fontWeight: "500", color: "#202124" }}>{ast.name}</span>
                            <span style={{ color: "#9aa0a6" }}>&gt;</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
