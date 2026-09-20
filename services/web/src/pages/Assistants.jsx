import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, MessageCircle, Loader2 } from "lucide-react";
import { API_BASE } from "../config";

export default function Assistants() {
    const navigate = useNavigate();
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssistants = async () => {
            try {
                const res = await fetch(`${API_BASE}/user/assistants/`);
                if (res.ok) {
                    setAssistants(await res.json());
                }
            } catch (err) {
                console.error("Error fetching assistants:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssistants();
    }, []);

    const total = assistants.length;

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: "0 0 8px 0" }}>Assistants</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#5f6368", fontSize: "14px" }}>Manage and create assistants</span>
                        <div style={{ border: "1px solid #dadce0", borderRadius: "16px", padding: "2px 10px", fontSize: "12px", color: "#5f6368", backgroundColor: "#fff" }}>
                            {total} total
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/assistant/create?templateId=custom')}
                    style={{ backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", padding: "10px 16px", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                    <Plus size={16} /> New assistant
                </button>
            </div>

            {/* Main Table Container */}
            <div style={{ border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                
                {/* Toolbar */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                        <Search size={20} color="#9aa0a6" />
                        <input 
                            type="text" 
                            placeholder="Search assistants..." 
                            style={{ border: "none", outline: "none", fontSize: "14px", color: "#202124", width: "300px" }}
                        />
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "white", border: "1px solid #dadce0", borderRadius: "4px", padding: "6px 12px", fontSize: "13px", color: "#3c4043", fontWeight: "500", cursor: "pointer" }}>
                        <Filter size={14} /> Filters <ChevronDown size={14} />
                    </button>
                </div>

                {/* Table Header */}
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <div style={{ width: "60px" }}>NO</div>
                    <div style={{ flex: 1 }}>NAME</div>
                </div>

                {/* Table Body */}
                {loading ? (
                    <div style={{ padding: "40px", display: "flex", justifyContent: "center", color: "#5f6368" }}>
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : assistants.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#5f6368", fontSize: "14px" }}>
                        No assistants found. Create one to get started.
                    </div>
                ) : (
                    assistants.map((ast, index) => (
                        <div key={ast.id} style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "14px" }}>
                            <div style={{ width: "60px", color: "#5f6368" }}>{index + 1}</div>
                            <div style={{ flex: 1, color: "#1a73e8", fontWeight: "500", cursor: "pointer" }} onClick={() => navigate('/assistant/create?templateId=' + ast.id)}>{ast.name}</div>
                        </div>
                    ))
                )}

                {/* Table Footer / Pagination */}
                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ color: "#5f6368", fontSize: "13px" }}>
                        Showing {total > 0 ? 1 : 0}-{total > 5 ? 5 : total} of {total} assistants
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronsLeft size={16} /></button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronLeft size={16} /></button>
                        <button style={{ border: "none", background: "#1a73e8", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>1</button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronRight size={16} /></button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed", display: "flex", alignItems: "center" }}><ChevronsRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 12px rgba(26,115,232,0.4)", cursor: "pointer", zIndex: 1000 }}>
                <MessageCircle size={24} fill="currentColor" />
            </div>
        </div>
    );
}

// Ensure ChevronDown is imported properly
const ChevronDown = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
