import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { API_BASE } from "../config";

export default function CreateAssistant() {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get("templateId");
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
                const res = await fetch(`${API_BASE}/user/assistants/templates`);
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
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/user/assistants/`, {
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
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#6b7280" }}><Loader2 className="animate-spin" size={32} /></div>;
    if (!selectedTemplate) return <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No templates available. Please ask admin to configure templates.</div>;

    const isInterview = selectedTemplate.name.toLowerCase().includes("interview");

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", 
        fontSize: "14px", marginTop: "6px", outline: "none", color: "#111827", backgroundColor: "#ffffff",
        transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "Inter, system-ui, sans-serif"
    };

    const labelStyle = {
        display: "block", fontSize: "13px", fontWeight: "500", color: "#374151"
    };

    const sectionStyle = {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    };

    const sectionTitleStyle = {
        fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px"
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "60px", fontFamily: "Inter, system-ui, sans-serif" }} className="animate-fade-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <button onClick={() => navigate("/dashboard")} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.backgroundColor = "#f3f4f6"} onMouseOut={e => e.currentTarget.style.backgroundColor = "white"}>
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#111827", letterSpacing: "-0.01em" }}>Configure Assistant</h1>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>Customize your AI copilot parameters.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={sectionStyle} className="form-field-enter stagger-1">
                    <div style={sectionTitleStyle}>Basic Details</div>
                    
                    <div style={{ marginBottom: "20px" }}>
                        <label style={labelStyle}>Assistant Name <span style={{ color: "#ef4444" }}>*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Acme Corp Interview Prep" style={inputStyle} onFocus={e => {e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";}} onBlur={e => {e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none";}} />
                    </div>

                    <div>
                        <label style={labelStyle}>Template Model</label>
                        <select value={selectedTemplate.id} onChange={handleTemplateChange} style={{...inputStyle, cursor: "pointer"}} onFocus={e => {e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";}} onBlur={e => {e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none";}}>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isInterview && (
                    <div style={sectionStyle} className="form-field-enter stagger-2">
                        <div style={sectionTitleStyle}>Interview Configuration</div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={labelStyle}>Target Role <span style={{ color: "#ef4444" }}>*</span></label>
                                <input type="text" name="target_role" value={formData.target_role} onChange={handleChange} required placeholder="e.g. Senior Frontend Engineer" style={inputStyle} onFocus={e => {e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";}} onBlur={e => {e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none";}} />
                            </div>

                            <div>
                                <label style={labelStyle}>Experience (Years) <span style={{ color: "#ef4444" }}>*</span></label>
                                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} required placeholder="5" style={inputStyle} onFocus={e => {e.target.style.borderColor = "#4f46e5"; e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";}} onBlur={e => {e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none";}} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Resume Upload <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(Optional)</span></label>
                            <div style={{ marginTop: "8px", border: "1px dashed #d1d5db", borderRadius: "8px", padding: "32px", textAlign: "center", backgroundColor: "#f9fafb", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.backgroundColor = "#eff6ff";}} onMouseOut={e => {e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#f9fafb";}}>
                                <UploadCloud size={24} color="#6b7280" style={{ margin: "0 auto 8px auto" }} />
                                <div style={{ fontSize: "14px", fontWeight: "500", color: "#4f46e5" }}>Click to upload <span style={{ color: "#6b7280" }}>or drag and drop</span></div>
                                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>PDF, DOCX up to 10MB</div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={sectionStyle} className="form-field-enter stagger-3">
                    <div style={sectionTitleStyle}>Knowledge Base</div>
                    <label style={labelStyle}>Additional Materials <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(Optional)</span></label>
                    <div style={{ marginTop: "8px", border: "1px dashed #d1d5db", borderRadius: "8px", padding: "32px", textAlign: "center", backgroundColor: "#f9fafb", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.backgroundColor = "#eff6ff";}} onMouseOut={e => {e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#f9fafb";}}>
                        <UploadCloud size={24} color="#6b7280" style={{ margin: "0 auto 8px auto" }} />
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#4f46e5" }}>Click to upload <span style={{ color: "#6b7280" }}>or drag and drop</span></div>
                        <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>JDs, SOPs, Company Data</div>
                    </div>
                </div>

                <div className="form-field-enter stagger-3" style={{ paddingTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button type="button" onClick={() => navigate("/dashboard")} disabled={submitting} style={{ background: "white", color: "#374151", border: "1px solid #d1d5db", padding: "10px 20px", borderRadius: "8px", fontWeight: "500", fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s" }} onMouseOver={e => !submitting && (e.currentTarget.style.backgroundColor = "#f9fafb")} onMouseOut={e => !submitting && (e.currentTarget.style.backgroundColor = "white")}>
                        Cancel
                    </button>
                    <button type="submit" disabled={submitting} style={{ background: "#4f46e5", color: "#ffffff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "500", fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }} onMouseOver={e => !submitting && (e.currentTarget.style.backgroundColor = "#4338ca")} onMouseOut={e => !submitting && (e.currentTarget.style.backgroundColor = "#4f46e5")}>
                        {submitting ? <Loader2 className="animate-spin" size={16} /> : "Create & Launch"}
                    </button>
                </div>
            </form>
        </div>
    );
}
