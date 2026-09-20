import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
                const res = await fetch("http://127.0.0.1:8000/user/assistants/templates");
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
            const res = await fetch("http://127.0.0.1:8000/user/assistants/", {
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

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#5f6368" }}>Loading...</div>;
    if (!selectedTemplate) return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No templates available. Please ask admin to configure templates.</div>;

    const isInterview = selectedTemplate.name.toLowerCase().includes("interview");

    const inputStyle = {
        width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", 
        fontSize: "15px", marginTop: "8px", outline: "none", color: "#0f172a", backgroundColor: "#f8fafc",
        transition: "all 0.2s"
    };

    const labelStyle = {
        display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em"
    };

    const sectionTitleStyle = {
        fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "20px", letterSpacing: "0.1em"
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }} className="animate-fade-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "24px", marginBottom: "40px" }}>
                <button onClick={() => navigate("/dashboard")} className="posh-button" style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#0f172a", letterSpacing: "-0.02em" }}>Create Assistant</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "40px" }} className="form-field-enter stagger-1">
                    <div style={sectionTitleStyle}>BASICS</div>
                    
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>Name <span style={{ color: "#ef4444" }}>*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Interview Coach" style={inputStyle} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Give your meeting assistant a descriptive name.</div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>Co-pilot</label>
                        <select value={selectedTemplate.id} onChange={handleTemplateChange} style={{...inputStyle, cursor: "pointer"}} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Choose a pre-built co-pilot for common meeting types.</div>
                    </div>
                </div>

                {selectedTemplate.form_schema && selectedTemplate.form_schema.length > 0 && (
                    <div style={{ marginBottom: "40px" }} className="form-field-enter stagger-2">
                        <div style={sectionTitleStyle}>CONFIGURATION</div>
                        {selectedTemplate.form_schema.map(field => (
                            <div key={field.name} style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>{field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}</label>
                                {field.type === "file" ? (
                                    <button type="button" className="posh-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", background: "#f0fdf4", border: "1px dashed #22c55e", color: "#16a34a", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "fit-content" }}>
                                        <span style={{ fontSize: "18px" }}>+</span> Attach {field.label.toLowerCase()}
                                    </button>
                                ) : (
                                    <input type={field.type} name={field.name} value={formData[field.name] || ""} onChange={handleChange} required={field.required} placeholder={field.placeholder || ""} style={inputStyle} onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginBottom: "40px" }} className="form-field-enter stagger-3">
                    <div style={sectionTitleStyle}>ADDITIONAL CONFIG</div>
                    
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>Materials <span style={{ fontWeight: "normal", textTransform: "none", color: "#94a3b8" }}>Optional</span></label>
                        <button type="button" className="posh-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", background: "#eff6ff", border: "1px dashed #3b82f6", color: "#2563eb", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "fit-content" }}>
                            <span style={{ fontSize: "18px" }}>+</span> Add material
                        </button>
                    </div>
                </div>

                <div className="form-field-enter stagger-3" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "32px", display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                    <button type="button" onClick={() => navigate("/dashboard")} className="posh-button" style={{ background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", padding: "12px 28px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>
                        Cancel
                    </button>
                    <button type="submit" className="posh-button" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}>
                        Create & Launch
                    </button>
                </div>
            </form>
        </div>
    );
}
