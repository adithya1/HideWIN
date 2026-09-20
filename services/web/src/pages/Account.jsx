import React, { useState, useEffect } from "react";
import { CreditCard, Download, Shield, Zap, Receipt } from "lucide-react";

export default function Account() {
  const [activeTab, setActiveTab] = useState("invoices"); // Defaulting to invoices/orders to show off the new DB link
  const [email, setEmail] = useState("user@hidewin.ai");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hidewin_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.sub) setEmail(payload.sub);
      } catch(e) {}
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/user/orders/");
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const createDummyOrder = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/orders/?amount=49.99&payment_method=card", { method: "POST" });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "security", label: "Profile & Security", icon: Shield },
    { id: "subscription", label: "Subscription", icon: Zap },
    { id: "billing", label: "Payment Methods", icon: CreditCard },
    { id: "invoices", label: "Orders & Invoices", icon: Receipt }
  ];

  return (
    <div className="animate-fade-slide-up" style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.02em" }}>Account Settings</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "15px" }}>Manage your preferences, security, and billing.</p>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar Tabs */}
        <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px",
                border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
                backgroundColor: activeTab === tab.id ? "#eff6ff" : "transparent",
                color: activeTab === tab.id ? "#2563eb" : "#475569",
                transition: "all 0.2s"
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)", minHeight: "400px" }} className="posh-card">
          {activeTab === "invoices" && (
            <div className="form-field-enter stagger-1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Order History</h2>
                <button onClick={createDummyOrder} className="posh-button" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}>
                  + Buy Tokens (Test)
                </button>
              </div>

              {loading ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                  No orders found.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Order #{order.id}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{order.payment_method?.toUpperCase()}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>${order.amount.toFixed(2)}</div>
                        <div style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", background: order.status === "pending" ? "#fef3c7" : "#dcfce7", color: order.status === "pending" ? "#d97706" : "#16a34a" }}>
                          {order.status}
                        </div>
                        <button className="posh-button" style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== "invoices" && (
            <div className="form-field-enter stagger-1" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontWeight: "500" }}>
              Select "Orders & Invoices" to view the dynamic DB flow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

