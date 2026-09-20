import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, Bot, Clock, Folder, 
    User, EyeOff, Gift, Mic, ShieldAlert, HelpCircle 
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Assistants", path: "/assistants", icon: Bot },
        { name: "Sessions", path: "/sessions", icon: Clock },
        { name: "Documents", path: "/documents", icon: Folder },
    ];

    const bottomItems = [
        { name: "Account", path: "/account", icon: User },
        { name: "Go Invisible", path: "/invisible", icon: EyeOff },
        { name: "Refer & Earn", path: "/refer", icon: Gift, badge: "NEW" },
        { name: "Audio Check", path: "/audio", icon: Mic },
        { name: "Invisibility Check", path: "/invisibility", icon: ShieldAlert },
        { name: "Help", path: "/help", icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path;

    const linkStyle = (active) => ({
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        margin: "4px 12px",
        borderRadius: "8px",
        textDecoration: "none",
        color: active ? "#1a73e8" : "#5f6368",
        backgroundColor: active ? "#e8f0fe" : "transparent",
        fontWeight: active ? "600" : "500",
        fontSize: "14px"
    });

    return (
        <div style={{ width: "240px", borderRight: "1px solid #e0e0e0", height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
            <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", backgroundColor: "#ff7f00", borderRadius: "4px" }}></div>
                <span style={{ fontSize: "20px", fontWeight: "700" }}>HuddleMate</span>
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                {navItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))}>
                        <item.icon size={18} style={{ marginRight: "12px" }} />
                        {item.name}
                    </Link>
                ))}

                <div style={{ margin: "16px 24px 8px 24px", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase" }}>
                    MORE
                </div>

                {bottomItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))}>
                        <item.icon size={18} style={{ marginRight: "12px" }} />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        {item.badge && (
                            <span style={{ backgroundColor: "#1a73e8", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
