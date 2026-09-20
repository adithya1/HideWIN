import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function CreateAssistant() {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get("templateId");
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        target_role: "",
        experience_years: "",
        resume_url: "",
        job_description_url: "",
        materials_url: ""
    });

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch("http://localhost:8000/user/assistants/templates");
                if (res.ok) {
                    const data = await res.json();
                    setTemplates(data);
                    
                    let activeTpl = data.find(t => t.id.toString() === templateId);
                    if (!activeTpl && data.length > 0) activeTpl = data[0];
                    setSelectedTemplate(activeTpl);
                }
            } catch (err) {
                console.error("Error fetching templates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [templateId]);

    const handleTemplateChange = (e) => {
        const tpl = templates.find(t => t.id.toString() === e.target.value);
        setSelectedTemplate(tpl);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/user/assistants/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    template_id: selectedTemplate.id,
                    name: formData.name,
                    target_role: formData.target_role || null,
                    experience_years: formData.experience_years ? parseInt(formData.experience_years) : null
                })
            });
            if (res.ok) {
                navigate("/dashboard");
            } else {
                alert("Failed to create assistant");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!selectedTemplate) return <div>No templates available. Please ask admin to configure templates.</div>;

    // Check if current template requires role/experience (e.g. Interview)
    // We will do a basic check based on name for now, but ideally this comes from form_schema
    const isInterview = selectedTemplate.name.toLowerCase().includes("interview");

    const inputStyle = {
        width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #dcdcdc", 
        fontSize: "14px", marginTop: "6px", outline: "none", color: "#202124"
    };

    const labelStyle = {
        display: "block", fontSize: "12px", fontWeight: "600", color: "#3c4043", textTransform: "uppercase"
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "32px", color: "#202124", borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}>Create Assistant</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", marginBottom: "16px" }}>BASICS</div>
                    
                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Interview Coach" style={inputStyle} />
                        <div style={{ fontSize: "12px", color: "#5f6368", marginTop: "4px" }}>Give your meeting assistant a descriptive name.</div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Co-pilot</label>
                        <select value={selectedTemplate.id} onChange={handleTemplateChange} style={inputStyle}>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <div style={{ fontSize: "12px", color: "#5f6368", marginTop: "4px" }}>Choose a pre-built co-pilot for common meeting types.</div>
                    </div>
                </div>

                {isInterview && (
                    <div style={{ marginBottom: "24px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", marginBottom: "16px" }}>CONFIGURATION</div>
                        
                        <div style={{ marginBottom: "16px" }}>
                            <label style={labelStyle}>Target Role *</label>
                            <input type="text" name="target_role" value={formData.target_role} onChange={handleChange} required placeholder="e.g. Senior Backend Engineer" style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={labelStyle}>Experience (Years) *</label>
                            <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} required placeholder="5" style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={labelStyle}>Resume <span style={{ fontWeight: "normal", textTransform: "none", color: "#5f6368" }}>Optional</span></label>
                            <button type="button" style={{ display: "block", marginTop: "6px", background: "#fff", border: "1px dashed #1a73e8", color: "#1a73e8", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                + Attach resume
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", marginBottom: "16px" }}>ADDITIONAL CONFIG</div>
                    
                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Materials <span style={{ fontWeight: "normal", textTransform: "none", color: "#5f6368" }}>Optional</span></label>
                        <button type="button" style={{ display: "block", marginTop: "6px", background: "#fff", border: "1px dashed #1a73e8", color: "#1a73e8", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            + Add material
                        </button>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" style={{ background: "#1a73e8", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        Create & Launch
                    </button>
                </div>
            </form>
        </div>
    );
}
