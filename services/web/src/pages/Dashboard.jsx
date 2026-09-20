import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, LayoutGrid, Zap, CheckCircle2, MoreHorizontal } from "lucide-react";
import { API_BASE } from "../config";

export default function Dashboard() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Meeting Copilots");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tplRes = await fetch(`${API_BASE}/user/assistants/templates`);
                if (tplRes.ok) {
                    const data = await tplRes.json();
                    setTemplates(data);
                    if (data.length > 0) {
                        const uniqueCats = [...new Set(data.map(t => t.category || "Meeting Copilots"))];
                        if (uniqueCats.length > 0) setActiveCategory(uniqueCats[0]);
                    }
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

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#5f6368" }}>Loading ultra-posh dashboard...</div>;

    const uniqueCategories = [...new Set(templates.map(t => t.category || "Meeting Copilots"))];
    const filteredTemplates = templates.filter(t => (t.category || "Meeting Copilots") === activeCategory);
    
    // Group filtered templates by subcategory
    const subcategories = {};
    filteredTemplates.forEach(t => {
        const sub = t.subcategory || "General";
        if (!subcategories[sub]) subcategories[sub] = [];
        subcategories[sub].push(t);
    });

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px", display: "flex", gap: "40px" }} className="animate-fade-slide-up">
            
            {/* Left Sidebar for Categories */}
            <div style={{ width: "240px", flexShrink: 0, marginTop: "80px" }} className="stagger-1">
                <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", paddingLeft: "12px" }}>Library</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {uniqueCategories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{ 
                                textAlign: "left", padding: "12px 16px", borderRadius: "12px", border: "none", cursor: "pointer", 
                                background: activeCategory === cat ? "#f1f5f9" : "transparent",
                                color: activeCategory === cat ? "#0f172a" : "#64748b",
                                fontWeight: activeCategory === cat ? "600" : "500",
                                fontSize: "15px",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                    <div style={{ background: "linear-gradient(135deg, #1a73e8, #a855f7)", padding: "10px", borderRadius: "12px", color: "white", boxShadow: "0 8px 16px -4px rgba(26, 115, 232, 0.3)" }}>
                        <LayoutGrid size={24} />
                    </div>
                    <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0, color: "#0f172a", letterSpacing: "-0.03em" }}>Dashboard</h1>
                </div>
                <p style={{ color: "#64748b", marginBottom: "48px", fontSize: "16px", fontWeight: "500", maxWidth: "600px", lineHeight: "1.5" }}>Access your specialized AI copilots and active meeting assistants in one unified workspace.</p>

                {Object.keys(subcategories).map((subcat, idx) => (
                    <div key={subcat} style={{ marginBottom: "56px" }} className={`animate-fade-slide-up stagger-${(idx % 3) + 1}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{subcat}</h2>
                            <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, #e2e8f0, transparent)" }}></div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                            {subcategories[subcat].map((tpl) => (
                                <div 
                                    key={tpl.id} 
                                    className="posh-card group"
                                    style={{ 
                                        backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", 
                                        padding: "28px", display: "flex", flexDirection: "column", cursor: "pointer",
                                        position: "relative", overflow: "hidden"
                                    }}
                                    onClick={() => handleLaunchTemplate(tpl.id)}
                                >
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(to right, #3b82f6, #8b5cf6)", opacity: 0, transition: "opacity 0.3s ease" }} className="hover-bar"></div>
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                                        <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#f8fafc", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
                                            <Zap size={24} fill="currentColor" strokeWidth={1} />
                                        </div>
                                        <button className="posh-button" style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", cursor: "pointer" }}>
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{tpl.name}</h3>
                                    <p style={{ color: "#64748b", fontSize: "15px", flex: 1, marginBottom: "28px", lineHeight: "1.6" }}>
                                        {tpl.description || "A ready-to-use co-pilot for your dynamic workflows."}
                                    </p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleLaunchTemplate(tpl.id); }}
                                        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0f172a", color: "#ffffff", border: "none", padding: "12px 24px", borderRadius: "100px", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
                                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        Launch Template <span style={{ color: "#818cf8" }}>&rarr;</span>
                                    </button>
                                    <style>{".group:hover .hover-bar { opacity: 1 !important; }"}</style>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTemplates.length === 0 && (
                    <div style={{ padding: "60px", textAlign: "center", background: "#f8fafc", borderRadius: "24px", border: "1px dashed #cbd5e1" }}>
                        <div style={{ width: "64px", height: "64px", background: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", color: "#94a3b8" }}><Sparkles size={32} /></div>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600", color: "#334155" }}>No templates found</h3>
                        <p style={{ margin: 0, color: "#64748b" }}>Ask your admin to create templates for this category.</p>
                    </div>
                )}

                <div className="animate-fade-slide-up stagger-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", marginTop: "40px" }}>
                    <div>
                        <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#0f172a", letterSpacing: "-0.02em" }}>Active Assistants</h2>
                        <p style={{ color: "#64748b", fontSize: "15px", margin: "6px 0 0 0" }}>Your customized co-pilots ready for action.</p>
                    </div>
                </div>

                <div className="posh-card animate-fade-slide-up stagger-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", overflow: "hidden" }}>
                    {assistants.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontWeight: "500" }}>You have no active assistants.</div>
                    ) : (
                        assistants.map((ast, i) => (
                            <div key={ast.id} style={{ display: "flex", alignItems: "center", padding: "20px 28px", borderBottom: i < assistants.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.backgroundColor="#f8fafc"} onMouseOut={e => e.currentTarget.style.backgroundColor="transparent"}>
                                <div style={{ marginRight: "20px", color: i % 2 === 0 ? "#3b82f6" : "#10b981" }}><CheckCircle2 size={24} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "16px", marginBottom: "4px" }}>{ast.name}</div>
                                    <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{ast.target_role ? `Target Role: ${ast.target_role}` : "General Assistant"}</div>
                                </div>
                                <button style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "100px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", color: "#334155", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6";}} onMouseOut={e => {e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#334155";}}>Manage</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

