import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Search, Bell, UserCircle } from "lucide-react";

export default function DashboardLayout() {
    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{ height: "64px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", backgroundColor: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f1f3f4", padding: "8px 16px", borderRadius: "8px", width: "400px" }}>
                        <Search size={18} color="#5f6368" style={{ marginRight: "8px" }} />
                        <input type="text" placeholder="Search..." style={{ border: "none", backgroundColor: "transparent", outline: "none", width: "100%", color: "#202124" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Bell size={20} color="#5f6368" />
                        <UserCircle size={32} color="#1a73e8" />
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
