import React, { useState } from "react";
import { Search, Upload, CloudUpload, X, Check, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, MessageCircle, FileText, File as FileIcon } from "lucide-react";

export default function Documents() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mockDocs = [
        { id: 1, name: "AI-9-10-26", type: "Word Document", size: "49.96 KB", words: "2,783", status: "Processed", added: "Sep 10, 2026", iconColor: "#1a73e8", Icon: FileText },
        { id: 2, name: "presistend-dec", type: "Text File", size: "1.85 KB", words: "253", status: "Processed", added: "Sep 3, 2026", iconColor: "#9aa0a6", Icon: FileIcon },
        { id: 3, name: "Adity-Persistent", type: "PDF Document", size: "316.5 KB", words: "2,915", status: "Processed", added: "Sep 3, 2026", iconColor: "#ea4335", Icon: FileIcon },
        { id: 4, name: "QA", type: "Text File", size: "37.17 KB", words: "5,517", status: "Processed", added: "Sep 3, 2026", iconColor: "#9aa0a6", Icon: FileIcon },
        { id: 5, name: "Citi JD", type: "Text File", size: "5.83 KB", words: "784", status: "Processed", added: "Aug 19, 2026", iconColor: "#9aa0a6", Icon: FileIcon },
        { id: 6, name: "Aditya Resume Citi", type: "Word Document", size: "46.02 KB", words: "2,782", status: "Processed", added: "Aug 19, 2026", iconColor: "#1a73e8", Icon: FileText },
        { id: 7, name: "Aditya Resume", type: "Word Document", size: "44.34 KB", words: "2,686", status: "Processed", added: "Jul 13, 2026", iconColor: "#1a73e8", Icon: FileText }
    ];

    const total = 7;

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: "0 0 8px 0" }}>Documents</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#5f6368", fontSize: "14px" }}>Upload and manage your documents</span>
                        <div style={{ border: "1px solid #dadce0", borderRadius: "16px", padding: "2px 10px", fontSize: "12px", color: "#5f6368", backgroundColor: "#fff" }}>
                            {total} total
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", padding: "10px 16px", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                    <Upload size={16} /> Upload
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
                            placeholder="Search documents..." 
                            style={{ border: "none", outline: "none", fontSize: "14px", color: "#202124", width: "300px" }}
                        />
                    </div>
                </div>

                {/* Table Header */}
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <div style={{ width: "60px" }}>NO</div>
                    <div style={{ flex: 2 }}>NAME</div>
                    <div style={{ flex: 1.5 }}>TYPE</div>
                    <div style={{ flex: 1 }}>SIZE</div>
                    <div style={{ flex: 1 }}>WORDS</div>
                    <div style={{ width: "120px" }}>STATUS</div>
                    <div style={{ flex: 1 }}>ADDED</div>
                </div>

                {/* Table Body */}
                {mockDocs.map((doc, index) => (
                    <div key={doc.id} style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "13px" }}>
                        <div style={{ width: "60px", color: "#5f6368" }}>{index + 1}</div>
                        <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "12px", color: "#1a73e8", fontWeight: "500", cursor: "pointer" }}>
                            <doc.Icon size={16} color={doc.iconColor} fill={doc.iconColor === "#1a73e8" || doc.iconColor === "#ea4335" ? "currentColor" : "none"} />
                            {doc.name}
                        </div>
                        <div style={{ flex: 1.5, color: "#9aa0a6" }}>{doc.type}</div>
                        <div style={{ flex: 1, color: "#5f6368" }}>{doc.size}</div>
                        <div style={{ flex: 1, color: "#5f6368" }}>{doc.words}</div>
                        <div style={{ width: "120px" }}>
                            <span style={{ backgroundColor: "#e6f4ea", color: "#137333", border: "1px solid #ceead6", borderRadius: "12px", padding: "2px 8px", fontSize: "11px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Check size={12} strokeWidth={3} /> {doc.status}
                            </span>
                        </div>
                        <div style={{ flex: 1, color: "#5f6368" }}>{doc.added}</div>
                    </div>
                ))}

                {/* Table Footer / Pagination */}
                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ color: "#5f6368", fontSize: "13px" }}>
                        Showing 1-7 of {total} documents
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

            {/* Upload Modal */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ backgroundColor: "#fff", borderRadius: "8px", width: "100%", maxWidth: "550px", display: "flex", flexDirection: "column", boxShadow: "0 24px 38px 3px rgba(0,0,0,0.14)" }}>
                        
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#202124" }}>Upload a document</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", padding: "4px" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: "24px" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#202124", marginBottom: "8px" }}>Name</label>
                                <input type="text" placeholder="Document name" style={{ width: "100%", padding: "10px 12px", border: "1px solid #dadce0", borderRadius: "4px", fontSize: "14px", outline: "none" }} />
                            </div>
                            
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#202124", marginBottom: "8px" }}>Description</label>
                                <textarea placeholder="Document description (optional)" style={{ width: "100%", height: "100px", padding: "10px 12px", border: "1px solid #dadce0", borderRadius: "4px", fontSize: "14px", outline: "none", resize: "vertical" }} />
                            </div>

                            <div style={{ marginBottom: "8px" }}>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#202124", marginBottom: "8px" }}>Select Document</label>
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #dadce0", borderRadius: "4px", overflow: "hidden" }}>
                                    <div style={{ padding: "8px 12px", borderRight: "1px solid #dadce0", backgroundColor: "#f8f9fa", fontSize: "14px", color: "#3c4043", cursor: "pointer" }}>Choose File</div>
                                    <div style={{ padding: "8px 12px", flex: 1, fontSize: "14px", color: "#202124" }}>No file chosen</div>
                                </div>
                            </div>
                            <div style={{ fontSize: "12px", color: "#80868b" }}>Supported file types: PDF, DOCX, TXT, MD, JPG, JPEG, PNG (max 10MB)</div>
                        </div>

                        <div style={{ padding: "16px 24px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "flex-end", gap: "12px", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "#70757a", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "500", fontSize: "14px", cursor: "pointer" }}>
                                Cancel
                            </button>
                            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#669df6", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "500", fontSize: "14px", cursor: "pointer" }}>
                                <CloudUpload size={16} /> Upload Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
