import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add states for the Admin profile box
state_addition = """
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
"""
if "const [isAdminProfileOpen" not in text:
    text = text.replace("const [dbUsers, setDbUsers] = useState([]);", state_addition + "const [dbUsers, setDbUsers] = useState([]);")

# Import User, LogOut, MoreVertical
if "MoreVertical" not in text:
    text = text.replace("import { LayoutDashboard, Users, CreditCard, Settings, LogOut, X, Server, DownloadCloud, HardDrive, ShieldCheck, Activity, ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';", 
                        "import { LayoutDashboard, Users, CreditCard, Settings, LogOut, X, Server, DownloadCloud, HardDrive, ShieldCheck, Activity, ChevronRight, ChevronDown, Eye, EyeOff, User, MoreVertical } from 'lucide-react';")

# Replace the bottom sign-out with the Profile Chip
old_bottom = """            <div style={{ marginTop: 'auto', borderTop: '1px solid #e0e0e0', padding: '12px' }}>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, padding: '12px', width: '100%', borderRadius: '8px' }}>
                    <LogOut size={20} style={{ marginRight: '8px' }} /> Sign out
                </button>
            </div>"""

new_bottom = """            {/* Profile Chip */}
            <div style={{ padding: '16px', position: 'relative', marginTop: 'auto', borderTop: '1px solid #e0e0e0' }}>
                {/* Pop-up Menu */}
                {isAdminProfileOpen && (
                    <div style={{ position: 'absolute', bottom: 'calc(100% - 10px)', left: '16px', right: '16px', backgroundColor: '#fff', border: '1px solid #e8eaed', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, padding: '8px 0' }}>
                        <div style={{ padding: '10px 16px', color: '#5f6368', fontSize: '13px', fontWeight: '500', borderBottom: '1px solid #e8eaed', marginBottom: '8px' }}>
                            Administrator
                        </div>
                        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 16px', border: 'none', background: 'transparent', color: '#ef4444', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            <LogOut size={16} style={{ marginRight: '12px' }} /> Logout
                        </button>
                    </div>
                )}
                
                <div 
                    onClick={() => setIsAdminProfileOpen(!isAdminProfileOpen)}
                    style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #e8eaed', borderRadius: '8px', cursor: 'pointer', backgroundColor: isAdminProfileOpen ? '#f8f9fa' : '#fff' }}
                >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fce8e6', color: '#d93025', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', marginRight: '12px', flexShrink: 0 }}>
                        A
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#202124', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Admin</div>
                        <div style={{ fontSize: '11px', color: '#5f6368', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>admin@system</div>
                    </div>
                    <MoreVertical size={16} color="#5f6368" style={{ flexShrink: 0 }} />
                </div>
            </div>"""

text = text.replace(old_bottom, new_bottom)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated Admin.jsx to use the standard profile box popup!")
