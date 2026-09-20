import React, { useEffect, useState } from "react";

export default function AdminCopilots() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTemplate, setNewTemplate] = useState({ name: "", description: "", category: "General", subcategory: "", form_schema: "[]" });

    const fetchTemplates = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/admin/copilots/templates");
            if (res.ok) setTemplates(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:8000/admin/copilots/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newTemplate, form_schema: JSON.parse(newTemplate.form_schema || "[]") })
            });
            if (res.ok) {
                setNewTemplate({ name: "", description: "", category: "General", subcategory: "" });
                fetchTemplates();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ padding: "40px" }}>Loading Admin panel...</div>;

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", background: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }} className="animate-fade-slide-up">
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.02em" }}>Admin: Copilot Templates</h1>
            <p style={{ color: "#64748b", marginBottom: "40px", fontSize: "15px" }}>Manage the dynamic templates that appear on the User Dashboard.</p>

            <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>Active Templates</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {templates.map(tpl => (
                        <div key={tpl.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>{tpl.name}</h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>{tpl.description}</p><div style={{ marginTop: "8px", display: "flex", gap: "8px" }}><span style={{ fontSize: "11px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>{tpl.category}</span>{tpl.subcategory && <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>{tpl.subcategory}</span>}</div>
                            </div>
                            <span style={{ padding: "6px 12px", background: tpl.is_active ? "#dcfce7" : "#f1f5f9", color: tpl.is_active ? "#16a34a" : "#94a3b8", borderRadius: "100px", fontSize: "12px", fontWeight: "600" }}>
                                {tpl.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>Add New Template</h2>
                <form onSubmit={handleCreate} style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" }}>Template Name</label>
                        <input type="text" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" }}>Description</label>
                        <input type="text" value={newTemplate.description} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" }}>Category</label>
                        <select value={newTemplate.category} onChange={e => setNewTemplate({...newTemplate, category: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }}>
                            <option value="Meeting Copilots">Meeting Copilots</option>
                            <option value="Specialized Apps">Specialized Apps</option>
                            <option value="Custom Agents">Custom Agents</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" }}>Subcategory</label>
                        <input type="text" placeholder="e.g. Interviews, Sales, Engineering" value={newTemplate.subcategory} onChange={e => setNewTemplate({...newTemplate, subcategory: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
                    </div>
                    <button type="submit" className="posh-button" style={{ background: "#0f172a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%" }}>
                        Create Dynamic Template
                    </button>
                </form>
            </div>
        </div>
    );
}
