import { API_BASE } from '../config.js';
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(API_BASE + "/admin/orders/");
            if (res.ok) setOrders(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div style={{ padding: "40px" }}>Loading Admin panel...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "40px auto", background: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)" }} className="animate-fade-slide-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.02em" }}>Admin: Order Management</h1>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>Global view of all user transactions and payments.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "10px 16px", borderRadius: "100px", border: "1px solid #e2e8f0" }}>
                    <Search size={16} color="#94a3b8" style={{ marginRight: "8px" }} />
                    <input type="text" placeholder="Search orders..." style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", color: "#0f172a" }} />
                </div>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Order ID</th>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>User ID</th>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Method</th>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount</th>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                            <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontWeight: "500" }}>No orders found in the database.</td>
                            </tr>
                        ) : (
                            orders.map((order, i) => (
                                <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? "1px solid #e2e8f0" : "none", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.backgroundColor="#f8fafc"} onMouseOut={e => e.currentTarget.style.backgroundColor="transparent"}>
                                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>#{order.id}</td>
                                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#64748b" }}>User {order.user_id || "1"}</td>
                                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#64748b", textTransform: "capitalize" }}>{order.payment_method || "N/A"}</td>
                                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>${order.amount.toFixed(2)}</td>
                                    <td style={{ padding: "16px 24px" }}>
                                        <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", background: order.status === "pending" ? "#fef3c7" : "#dcfce7", color: order.status === "pending" ? "#d97706" : "#16a34a" }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px 24px" }}>
                                        <button className="posh-button" style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid transparent", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
