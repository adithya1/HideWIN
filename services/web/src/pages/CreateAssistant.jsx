import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus, Loader2, Paperclip, ChevronDown, RotateCcw, RotateCw, Bold, Italic, Link2, Code, Quote, List, X, Globe } from "lucide-react";
import { API_BASE } from "../config";

const FakeWysiwyg = ({ placeholder, value, onChange }) => (
    <div style={{ border: "1px solid #dadce0", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff" }}>
        <div style={{ padding: "8px", borderBottom: "1px solid #dadce0", display: "flex", gap: "12px", backgroundColor: "#fafafa", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px" }}>
                <RotateCcw size={14} color="#5f6368" cursor="pointer" />
                <RotateCw size={14} color="#5f6368" cursor="pointer" />
            </div>
            <div style={{ borderLeft: "1px solid #dadce0", height: "16px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                <span style={{ fontSize: "13px", color: "#5f6368", fontWeight: "500" }}>Aa Text</span>
                <ChevronDown size={12} color="#5f6368" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                <List size={14} color="#5f6368" />
                <ChevronDown size={12} color="#5f6368" />
            </div>
            <div style={{ borderLeft: "1px solid #dadce0", height: "16px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
                <Bold size={14} color="#5f6368" cursor="pointer" />
                <Italic size={14} color="#5f6368" cursor="pointer" />
                <Link2 size={14} color="#5f6368" cursor="pointer" />
                <Code size={14} color="#5f6368" cursor="pointer" />
                <Quote size={14} color="#5f6368" cursor="pointer" />
            </div>
        </div>
        <textarea 
            style={{ width: "100%", height: "150px", padding: "16px", border: "none", outline: "none", resize: "vertical", fontSize: "14px", fontFamily: "inherit", color: "#202124" }}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <div style={{ padding: "8px 16px", borderTop: "1px solid #dadce0", fontSize: "11px", color: "#80868b", backgroundColor: "#f8f9fa" }}>
            {value.length} characters &nbsp; {value.trim() === '' ? 0 : value.trim().split(/\s+/).length} words
        </div>
    </div>
);

const modelOptions = [
    { id: "hidewin", name: "HideWin Recommended", icon: <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px", fontWeight: "bold" }}>H</div>, badge: null },
    { id: "gpt-latest", name: "GPT-Latest Instant", icon: <Globe size={16} color="#5f6368" />, badge: "Open AI" },
    { id: "gpt-5.6", name: "GPT-5.6", icon: <Globe size={16} color="#5f6368" />, badge: "Open AI" },
    { id: "gpt-5.5", name: "GPT-5.5", icon: <Globe size={16} color="#5f6368" />, badge: "Open AI" }
];

const CustomModelDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selected = modelOptions.find(o => o.id === value) || modelOptions[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: "relative", width: "100%", maxWidth: "400px", marginTop: "4px" }}>
            <div onClick={() => setIsOpen(!isOpen)} style={{ padding: "8px 12px", border: "1px solid #dadce0", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {selected.icon}
                    <span style={{ fontSize: "14px", color: "#202124" }}>{selected.name}</span>
                </div>
                <ChevronDown size={16} color="#5f6368" />
            </div>
            {isOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", backgroundColor: "#fff", border: "1px solid #dadce0", borderRadius: "4px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 50, maxHeight: "250px", overflowY: "auto" }}>
                    {modelOptions.map(opt => (
                        <div key={opt.id} onClick={() => { onChange(opt.id); setIsOpen(false); }} style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: "1px solid #f1f3f4", backgroundColor: value === opt.id ? "#f8faff" : "transparent" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {opt.icon}
                                <span style={{ fontSize: "14px", color: "#202124", fontWeight: value === opt.id ? "500" : "400" }}>{opt.name}</span>
                            </div>
                            {opt.badge && <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0d652d", backgroundColor: "#e6f4ea", padding: "2px 6px", borderRadius: "4px" }}>{opt.badge}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CreateAssistant() {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get("templateId");
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "", target_role: "", experience_years: "", model: "hidewin", system_prompt: ""
    });

    // Response Types Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [responseTypes, setResponseTypes] = useState([]);
    const [modalData, setModalData] = useState({ name: "", model: "hidewin", system_prompt: "" });

    const standardOptions = [
        { id: "custom", name: "Custom" },
        { id: "interview", name: "Interview" },
        { id: "trivia", name: "Trivia & Quiz" }
    ];

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch(`${API_BASE}/user/assistants/templates`);
                let data = [];
                if (res.ok) data = await res.json();
                
                let merged = [...standardOptions];
                data.forEach(dbTpl => {
                    if (!merged.find(m => m.name.toLowerCase() === dbTpl.name.toLowerCase())) merged.push(dbTpl);
                });
                
                setTemplates(merged);
                let activeTpl = merged.find(t => t.id.toString() === templateId);
                if (!activeTpl) activeTpl = merged.find(t => t.name.toLowerCase().includes('interview')) || merged[1];
                setSelectedTemplate(activeTpl);
            } catch (err) {
                setTemplates(standardOptions);
                let activeTpl = standardOptions.find(t => t.id === templateId) || standardOptions[1];
                setSelectedTemplate(activeTpl);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [templateId]);

    const handleTemplateChange = (e) => setSelectedTemplate(templates.find(t => t.id.toString() === e.target.value));
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreateResponseType = () => {
        if (!modalData.name.trim() || !modalData.system_prompt.trim()) return;
        setResponseTypes([...responseTypes, { ...modalData, id: Date.now() }]);
        setIsModalOpen(false);
        setModalData({ name: "", model: "hidewin", system_prompt: "" });
    };

    const handleSubmit = async (actionType) => {
        setSubmitting(true);
        try {
            const payload = {
                template_id: selectedTemplate.id.toString().includes('custom') ? null : selectedTemplate.id,
                name: formData.name,
                target_role: formData.target_role || null,
                experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
                model: formData.model,
                system_prompt: formData.system_prompt,
                response_types: responseTypes
            };
            const res = await fetch(`${API_BASE}/user/assistants/`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
            });
            if (res.ok) {
                if (actionType === 'launch') navigate("/sessions");
                else navigate("/dashboard");
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
    if (!selectedTemplate) return null;

    const isInterview = selectedTemplate.name.toLowerCase().includes("interview");
    const isCustom = selectedTemplate.name.toLowerCase().includes("custom");

    const inputStyle = { width: "100%", maxWidth: "400px", padding: "8px 12px", borderRadius: "4px", border: "1px solid #dadce0", fontSize: "14px", marginTop: "4px", outline: "none", color: "#202124", backgroundColor: "#ffffff" };
    const labelStyle = { display: "block", fontSize: "14px", fontWeight: "500", color: "#202124" };
    const subtextStyle = { fontSize: "12px", color: "#5f6368", marginTop: "4px" };
    const sectionTitleStyle = { fontSize: "11px", fontWeight: "700", color: "#5f6368", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", marginTop: "32px" };
    const dashedButtonStyle = { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: "1px dashed #1a73e8", borderRadius: "4px", padding: "8px 16px", color: "#1a73e8", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "4px" };

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
                    <select value={selectedTemplate.id} onChange={handleTemplateChange} style={{...inputStyle, cursor: "pointer", maxWidth: "400px", paddingRight: "30px", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235f6368' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "16px"}}>
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
                            <label style={labelStyle}>Resume <span style={{ fontWeight: "normal", color: "#80868b" }}>Optional</span></label>
                            <button type="button" style={dashedButtonStyle}><Paperclip size={16} /> Attach resume</button>
                            <div style={subtextStyle}>Upload your resume so the meeting assistant can provide personalized responses based on your background and experience.</div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Job Description <span style={{ fontWeight: "normal", color: "#80868b" }}>Optional</span></label>
                            <button type="button" style={dashedButtonStyle}><Paperclip size={16} /> Attach job description</button>
                            <div style={subtextStyle}>Add the job description to help your meeting assistant understand the role requirements and expectations.</div>
                        </div>
                    </>
                )}

                {isCustom && (
                    <>
                        <div style={sectionTitleStyle}>CONFIGURATION</div>
                        
                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Model</label>
                            <CustomModelDropdown value={formData.model} onChange={(val) => setFormData({...formData, model: val})} />
                            <div style={subtextStyle}>AI model that will power the assistant's real-time responses.</div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ ...labelStyle, marginBottom: "4px" }}>System Prompt</label>
                            <FakeWysiwyg 
                                placeholder="Describe the assistant's behavior, tone, expertise, goals..." 
                                value={formData.system_prompt} 
                                onChange={(e) => setFormData({...formData, system_prompt: e.target.value})} 
                            />
                            <div style={subtextStyle}>Define how your meeting assistant should behave during conversations. Include its role, communication style, expertise areas, and meeting objectives.</div>
                        </div>
                    </>
                )}

                <div style={sectionTitleStyle}>ADDITIONAL CONTEXT</div>
                <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Materials <span style={{ fontWeight: "normal", color: "#80868b" }}>Optional</span></label>
                    <div style={{ marginTop: "4px" }}>
                        <button type="button" style={dashedButtonStyle}><Plus size={16} /> Add material</button>
                    </div>
                    <div style={subtextStyle}>Add reference documents or notes for your assistant to use during sessions.</div>
                </div>

                {isCustom && (
                    <div style={{ marginBottom: "24px" }}>
                        <label style={labelStyle}>Response types <span style={{ fontWeight: "normal", color: "#80868b" }}>Optional</span></label>
                        <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {responseTypes.map(rt => (
                                <div key={rt.id} style={{ padding: "12px", border: "1px solid #dadce0", borderRadius: "4px", backgroundColor: "#f8f9fa", fontSize: "14px", fontWeight: "500", color: "#202124" }}>
                                    {rt.name}
                                </div>
                            ))}
                            <button type="button" onClick={() => setIsModalOpen(true)} style={dashedButtonStyle}><Plus size={16} /> Add response type</button>
                        </div>
                        <div style={subtextStyle}>Custom response formats you can trigger during a session, e.g. a summary or action items.</div>
                    </div>
                )}
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

            {/* Add Response Type Modal */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ backgroundColor: "#fff", borderRadius: "8px", width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", maxHeight: "90vh", boxShadow: "0 24px 38px 3px rgba(0,0,0,0.14)" }}>
                        
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#202124" }}>Add response type</h2>
                                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#5f6368" }}>Give it a name and tell the model how to respond.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", padding: "4px" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>Name <span style={{ color: "#d93025" }}>*</span></label>
                                <input type="text" value={modalData.name} onChange={(e) => setModalData({...modalData, name: e.target.value})} placeholder="e.g. Summary, Action items, Key points" style={{...inputStyle, maxWidth: "none"}} />
                                <div style={subtextStyle}>A short, descriptive name for this response type.</div>
                            </div>
                            
                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>Model</label>
                                <CustomModelDropdown value={modalData.model} onChange={(val) => setModalData({...modalData, model: val})} />
                                <div style={subtextStyle}>Choose the AI model to use for this response type</div>
                            </div>

                            <div>
                                <label style={{ ...labelStyle, marginBottom: "4px" }}>System prompt <span style={{ color: "#d93025" }}>*</span></label>
                                <FakeWysiwyg 
                                    placeholder="Define how the AI should respond for this type: instructions, format, tone, and any specific requirements..." 
                                    value={modalData.system_prompt} 
                                    onChange={(e) => setModalData({...modalData, system_prompt: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div style={{ padding: "16px 24px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "white", color: "#202124", border: "1px solid #dadce0", padding: "8px 16px", borderRadius: "4px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleCreateResponseType} style={{ background: "#669df6", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                                Create response type
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
