import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Info, Tag, ChevronRight, ShoppingCart, Lock, ArrowUpRight, ChevronsLeft, ChevronLeft, ChevronsRight } from "lucide-react";

export default function Account() {
    const { tab } = useParams();
    const navigate = useNavigate();


    
    const activeTab = tab === "calendar" ? "profile" : (tab || "profile");

    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [creditHistory, setCreditHistory] = useState([]);
                const [paymentMethods, setPaymentMethods] = useState([]);
    
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [countryCode, setCountryCode] = useState("US");
    const [currencySymbol, setCurrencySymbol] = useState("$");
    
    // Fetch geolocation once on mount
    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_code) setCountryCode(data.country_code);
            })
            .catch(e => console.error("Geolocation failed:", e));
    }, []);

    useEffect(() => {
        if (activeTab === 'credits') {
            api.get(`/user/billing/packages?country=${countryCode}`).then(res => {
                const pkgs = res.data.items || [];
                setPackages(pkgs);
                if(pkgs.length > 0) {
                    setCurrencySymbol(pkgs[0].currency_symbol || '$');
                    if (!selectedPackage) setSelectedPackage(pkgs[0]);
                }
            }).catch(e => console.error(e));
            
            api.get(`/user/billing/methods?country=${countryCode}`).then(res => setPaymentMethods(res.data.items || [])).catch(e => console.error(e));
            api.get('/user/billing/balance').then(res => setBalance(res.data.credit_balance || 0)).catch(e => console.error(e));
        } else if (activeTab === 'transactions') {
            api.get('/user/billing/transactions').then(res => setTransactions(res.data.items || [])).catch(e => console.error(e));
        } else if (activeTab === 'credit-history') {
            api.get('/user/billing/credit-history').then(res => setCreditHistory(res.data.items || [])).catch(e => console.error(e));
        }
    }, [activeTab, countryCode]);

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "credits", label: "Credits" },
        { id: "transactions", label: "Transactions" },
        { id: "credit-history", label: "Credit History" }
    ];

    const renderProfile = () => (
        <div style={{ maxWidth: "800px" }}>
            
            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#202124", marginBottom: "4px" }}>Email address</label>
                <div style={{ fontSize: "12px", color: "#80868b", marginBottom: "8px" }}>
                    Email cannot be updated. Please reach out to <span style={{ color: "#1a73e8" }}>support@huddlemate.ai</span> to request a change.
                </div>
                <input type="text" readOnly value="postbox.send@gmail.com" style={{ width: "100%", padding: "10px 12px", border: "1px solid #dadce0", borderRadius: "4px", fontSize: "14px", outline: "none", backgroundColor: "#fff", color: "#202124" }} />
            </div>
            <button style={{ backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", padding: "10px 24px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                Save changes
            </button>
        </div>
    );

    
    const handleCancel = async () => {
        if (!cancelReason) return alert("Please select a reason");
        try {
            await api.post('/user/billing/cancel', { reason: cancelReason, details: cancelDetails });
            alert("Subscription cancelled successfully.");
            setShowCancelModal(false);
        } catch(e) {
            alert("Failed to cancel.");
        }
    };
    
    const renderCredits = () => (

        <div>
            {/* Warning Banner */}
            <div style={{ backgroundColor: "#fffde7", border: "1px solid #fbbc04", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
                <Info size={20} color="#f29900" style={{ marginTop: "2px" }} />
                <div>
                    <div style={{ fontWeight: "600", color: "#202124", fontSize: "14px", marginBottom: "4px" }}>Running low on credits</div>
                    <div style={{ color: "#3c4043", fontSize: "13px" }}>You have fewer than 30 minutes remaining. Add more credits to continue using all features.</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                {/* Left Card: Balance */}
                <div style={{ flex: 1, border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", padding: "24px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#202124", margin: "0 0 24px 0" }}>Your Balance</h3>
                    <div style={{ textAlign: "center", marginBottom: "32px", padding: "24px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                        <div style={{ fontSize: "48px", fontWeight: "bold", color: "#1a73e8", lineHeight: 1 }}>{balance}</div>
                        <div style={{ fontSize: "12px", color: "#5f6368", marginTop: "8px" }}>credits/minutes available</div>
                    </div>

                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>FEATURES INCLUDED</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                        {["Real-time AI Assistance", "Real-time Meeting Transcription", "Invisibility", "Screen Analyzer", "Unlimited Questions", "Configurable Responses"].map((feature, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "#3c4043" }}>
                                <Check size={16} color="#137333" strokeWidth={2.5} /> {feature} <Info size={14} color="#9aa0a6" />
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>PROMOTIONS</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "#3c4043", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <Tag size={16} color="#137333" /> Refer a friend and earn 60 credits
                        </div>
                        <ChevronRight size={16} color="#9aa0a6" />
                    </div>
                </div>

                {/* Right Card: Purchase */}
                <div style={{ flex: 1, border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff", padding: "24px", position: "relative" }}>
                    
                    {!showCheckout ? (
                        <>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#202124", margin: "0 0 24px 0" }}>Purchase More Credits</h3>
                            
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#202124", marginBottom: "12px" }}>Select Hours</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: "1px solid #dadce0", background: "#fff", borderRadius: "4px", padding: "8px 16px", color: "#5f6368", cursor: "pointer" }}>-</button>
                                <input type="text" readOnly value={quantity} style={{ flex: 1, textAlign: "center", border: "1px solid #dadce0", borderRadius: "4px", outline: "none", fontSize: "14px", fontWeight: "500" }} />
                                <button onClick={() => setQuantity(quantity + 1)} style={{ border: "1px solid #dadce0", background: "#fff", borderRadius: "4px", padding: "8px 16px", color: "#5f6368", cursor: "pointer" }}>+</button>
                            </div>

                            <div style={{ display: "flex", gap: "8px", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
                                {packages.map(p => (
                                    <button key={p.id} onClick={() => setSelectedPackage(p)} style={{ flex: "0 0 auto", minWidth: "80px", backgroundColor: selectedPackage?.id === p.id ? "#1a73e8" : "#fff", color: selectedPackage?.id === p.id ? "#fff" : "#3c4043", border: selectedPackage?.id === p.id ? "none" : "1px solid #dadce0", borderRadius: "4px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                                        {p.name}
                                    </button>
                                ))}
                            </div>

                            {selectedPackage && (
                            <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "20px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: "#5f6368", marginBottom: "16px" }}>
                                    <ShoppingCart size={14} /> Order Summary
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f6368", marginBottom: "12px" }}>
                                    <span>Package</span>
                                    <span style={{ fontWeight: "500", color: "#202124" }}>{quantity}x {selectedPackage.name} ({quantity * selectedPackage.credits} credits/minutes)</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f6368", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e8eaed" }}>
                                    <span>Price per unit</span>
                                    <span style={{ fontWeight: "500", color: "#202124", textDecoration: selectedPackage.discount_percentage > 0 ? "line-through" : "none" }}>{currencySymbol}{selectedPackage.base_price.toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600" }}>
                                    <span style={{ color: "#202124" }}>Total</span>
                                    <span style={{ color: "#137333" }}>{currencySymbol}{(quantity * selectedPackage.base_price * (1 - selectedPackage.discount_percentage/100)).toFixed(2)}</span>
                                </div>
                            </div>
                            )}

                            <button onClick={() => { if(selectedPackage) setShowCheckout(true); }} style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", padding: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer", marginBottom: "16px" }}>
                                Purchase {quantity}x {selectedPackage ? selectedPackage.name : "Credits"}
                            </button>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#80868b" }}>
                                <Lock size={12} /> Secure payment via Stripe
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", cursor: "pointer", color: "#5f6368", fontSize: "14px", fontWeight: "500" }} onClick={() => setShowCheckout(false)}>
                                <ChevronLeft size={18} /> Back to packages
                            </div>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#202124", margin: "0 0 24px 0" }}>Select Payment Gateway</h3>

                            {selectedPackage && (
                            <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "16px", marginBottom: "24px", border: "1px solid #e8eaed" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
                                    <span style={{ color: "#202124" }}>Total Due</span>
                                    <span style={{ color: "#137333" }}>{currencySymbol}{(quantity * selectedPackage.base_price * (1 - selectedPackage.discount_percentage/100)).toFixed(2)}</span>
                                </div>
                            </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
                                {paymentMethods.length > 0 ? paymentMethods.map(pm => (
                                    <button key={pm.id} onClick={async () => {
                                        try {
                                            const res = await api.post('/user/billing/checkout', { provider: pm.provider, package_id: selectedPackage.id, quantity: quantity, country: countryCode });
                                            window.location.href = res.data.url;
                                        } catch(e) {
                                            alert("Checkout failed");
                                        }
                                    }} style={{ width: "100%", backgroundColor: pm.provider === 'Stripe' ? "#1a73e8" : pm.provider === 'Razorpay' ? "#3b82f6" : pm.provider === 'PayPal' ? "#003087" : "#1a73e8", color: "white", border: "none", borderRadius: "4px", padding: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                                        Subscribe via {pm.method_name}
                                    </button>
                                )) : (
                                    <div style={{ padding: "12px", textAlign: "center", fontSize: "14px", color: "#5f6368", border: "1px solid #ddd", borderRadius: "4px" }}>No payment methods available</div>
                                )}
                            </div>
                            
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#80868b", marginTop: "16px" }}>
                                <Lock size={12} /> Secure encrypted checkout
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );


    const renderTransactions = () => {
        
        return (
            <div style={{ border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaed" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#202124" }}>Transactions</h3>
                </div>
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase" }}>
                    <div style={{ width: "60px" }}>NO</div>
                    <div style={{ flex: 1.5 }}>DATE</div>
                    <div style={{ flex: 1 }}>TYPE</div>
                    <div style={{ flex: 1 }}>AMOUNT</div>
                    <div style={{ flex: 1 }}>STATUS</div>
                </div>
                {transactions.map((tx, i) => (
                    <div key={tx.id} style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "13px" }}>
                        <div style={{ width: "60px", color: "#1a73e8" }}>{i + 1}</div>
                        <div style={{ flex: 1.5, color: "#3c4043" }}>{new Date(tx.created_at).toLocaleString()}</div>
                        <div style={{ flex: 1, color: "#3c4043" }}>{tx.type}</div>
                        <div style={{ flex: 1, color: "#3c4043" }}> {tx.currency}</div>
                        <div style={{ flex: 1 }}>
                            <span style={{ backgroundColor: "#e6f4ea", color: "#137333", border: "1px solid #ceead6", borderRadius: "12px", padding: "2px 8px", fontSize: "11px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Check size={12} strokeWidth={3} /> {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ color: "#5f6368", fontSize: "13px" }}>Showing 1-3 of 3 transactions</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}><ChevronLeft size={16} /></button>
                        <button style={{ border: "none", background: "#1a73e8", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500" }}>1</button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCreditHistory = () => {
        
        return (
            <div style={{ border: "1px solid #e8eaed", borderRadius: "8px", backgroundColor: "#fff" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaed" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#202124" }}>Credit History</h3>
                </div>
                <div style={{ padding: "12px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase" }}>
                    <div style={{ width: "60px" }}>NO</div>
                    <div style={{ flex: 1.5 }}>DATE</div>
                    <div style={{ flex: 1 }}>CREDITS</div>
                    <div style={{ flex: 1.5 }}>TRANSACTION ID</div>
                    <div style={{ flex: 1.5 }}>NOTES</div>
                </div>
                {creditHistory.map((h, i) => (
                    <div key={h.id} style={{ padding: "16px 24px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", fontSize: "13px" }}>
                        <div style={{ width: "60px", color: "#1a73e8" }}>{i + 1}</div>
                        <div style={{ flex: 1.5, color: "#3c4043" }}>{new Date(h.created_at).toLocaleString()}</div>
                        <div style={{ flex: 1 }}>
                            <span style={{ backgroundColor: "#e6f4ea", color: "#137333", border: "1px solid #ceead6", borderRadius: "12px", padding: "2px 8px", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <ArrowUpRight size={14} strokeWidth={2.5} /> {h.credit_change > 0 ? `+${h.credit_change}` : h.credit_change}
                            </span>
                        </div>
                        <div style={{ flex: 1.5, color: "#5f6368" }}>{h.transaction_id || "N/A"}</div>
                        <div style={{ flex: 1.5, color: "#3c4043" }}>{h.notes || h.source}</div>
                    </div>
                ))}
                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ color: "#5f6368", fontSize: "13px" }}>Showing 1-3 of 3 entries</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}><ChevronLeft size={16} /></button>
                        <button style={{ border: "none", background: "#1a73e8", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500" }}>1</button>
                        <button style={{ border: "none", background: "transparent", color: "#c1c7cd", padding: "4px", cursor: "not-allowed" }}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: "32px 40px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px", fontFamily: 'system-ui, -apple-system, sans-serif', width: "100%" }}>
            
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#9aa0a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    OVERVIEW
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#202124", margin: 0 }}>
                    Account
                </h1>
            </div>

            {/* Horizontal Tabs */}
            <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e8eaed", marginBottom: "32px" }}>
                {tabs.map(t => (
                    <div 
                        key={t.id}
                        onClick={() => navigate(`/account/${t.id}`)}
                        style={{ 
                            fontSize: "14px", 
                            fontWeight: activeTab === t.id ? "500" : "400", 
                            color: activeTab === t.id ? "#1a73e8" : "#5f6368", 
                            borderBottom: activeTab === t.id ? "2px solid #1a73e8" : "2px solid transparent", 
                            paddingBottom: "12px", 
                            marginBottom: "-1px", 
                            cursor: "pointer" 
                        }}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div>
                {activeTab === "profile" && renderProfile()}
                {activeTab === "credits" && renderCredits()}
                {activeTab === "transactions" && renderTransactions()}
                {activeTab === "credit-history" && renderCreditHistory()}
            </div>

            
        </div>
    );

}
