import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
