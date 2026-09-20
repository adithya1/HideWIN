import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
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

    const handleSubmit = async (actionType) => {
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
                if (actionType === 'launch') {
                    // In a real app, this would route to the active session
                    navigate("/sessions");
                } else {
                    navigate("/dashboard");
                }
            } else {
                alert("Failed to create assistant");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#5f6368" }}><Loader2 className="animate-spin" size={32} /></div>;
    if (!selectedTemplate) return <div style={{ padding: "40px", textAlign: "center", color: "#5f6368" }}>No templates available. Please ask admin to configure templates.</div>;

    const isInterview = selectedTemplate.name.toLowerCase().includes("interview");

    const inputStyle = {
        width: "100%", maxWidth: "400px", padding: "8px 12px", borderRadius: "4px", border: "1px solid #dadce0", 
        fontSize: "14px", marginTop: "4px", outline: "none", color: "#202124", backgroundColor: "#ffffff"
    };

    const labelStyle = {
        display: "block", fontSize: "14px", fontWeight: "500", color: "#202124"
    };
    
    const subtextStyle = {
        fontSize: "12px", color: "#5f6368", marginTop: "4px"
    };

    const sectionTitleStyle = {
        fontSize: "11px", fontWeight: "700", color: "#5f6368", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: "32px"
    };

    const attachmentButtonStyle = {
        display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", 
        border: "1px solid #dadce0", borderRadius: "4px", padding: "6px 16px", color: "#1a73e8", 
        fontSize: "13px", fontWeight: "500", cursor: "pointer", marginTop: "4px"
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            
            {/* Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", backgroundColor: "#fff" }}>
                <h1 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#202124" }}>Create Assistant</h1>
            </div>

            {/* Scrollable Form Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 80px 24px", backgroundColor: "#fff" }}>
                
                <div style={sectionTitleStyle}>BASIC</div>
                
                <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Name <span style={{ color: "#d93025" }}>*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Interview Coach" style={inputStyle} />
                    <div style={subtextStyle}>Give your meeting assistant a descriptive name to easily identify it for future meetings.</div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Co-pilot</label>
                    <select value={selectedTemplate.id} onChange={handleTemplateChange} style={{...inputStyle, cursor: "pointer", maxWidth: "400px"}}>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <div style={subtextStyle}>Choose a pre-built co-pilot for common meeting types, or select Custom to start from scratch.</div>
                </div>

                {isInterview && (
                    <>
                        <div style={sectionTitleStyle}>CONFIGURATION</div>
                        
                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Target Role <span style={{ color: "#d93025" }}>*</span></label>
                            <input type="text" name="target_role" value={formData.target_role} onChange={handleChange} placeholder="e.g. Senior Backend Engineer" style={inputStyle} />
                            <div style={subtextStyle}>Specify the role you're preparing for.</div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Experience (Years) <span style={{ color: "#d93025" }}>*</span></label>
                            <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} placeholder="5" style={inputStyle} />
                            <div style={subtextStyle}>Specify the years of experience required for the target role.</div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Resume <span style={{ fontWeight: "normal", color: "#5f6368" }}>Optional</span></label>
                            <button type="button" style={attachmentButtonStyle}>
                                <Plus size={16} /> Attach resume
                            </button>
                            <div style={subtextStyle}>Upload your resume so the meeting assistant can provide personalized responses based on your background and experience.</div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Job Description <span style={{ fontWeight: "normal", color: "#5f6368" }}>Optional</span></label>
                            <button type="button" style={attachmentButtonStyle}>
                                <Plus size={16} /> Attach job description
                            </button>
                            <div style={subtextStyle}>Add the job description to help your meeting assistant understand the role requirements and expectations.</div>
                        </div>
                    </>
                )}

                <div style={sectionTitleStyle}>ADDITIONAL CONTEXT</div>
                <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Materials <span style={{ fontWeight: "normal", color: "#5f6368" }}>Optional</span></label>
                    <button type="button" style={attachmentButtonStyle}>
                        <Plus size={16} /> Add material
                    </button>
                    <div style={subtextStyle}>Add reference documents or notes for your assistant to use during sessions.</div>
                </div>

            </div>

            {/* Sticky Bottom Bar */}
            <div style={{ position: "fixed", bottom: 0, right: 0, left: "250px", backgroundColor: "#fff", borderTop: "1px solid #e8eaed", padding: "12px 24px", display: "flex", justifyContent: "flex-end", gap: "12px", zIndex: 10 }}>
                <button type="button" onClick={() => handleSubmit('launch')} disabled={submitting} style={{ background: "white", color: "#1a73e8", border: "1px solid #dadce0", padding: "8px 16px", borderRadius: "4px", fontWeight: "500", fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer" }}>
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : "Create & Launch"}
                </button>
                <button type="button" onClick={() => handleSubmit('create')} disabled={submitting} style={{ background: "#1a73e8", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "500", fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer" }}>
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : "Create"}
                </button>
            </div>
        </div>
    );
}
