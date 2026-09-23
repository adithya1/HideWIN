import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../api';

export default function AdminBilling() {
    const [overview, setOverview] = useState({ total_orders: 0, total_revenue: 0, active_subscriptions: 0 });
    const [orders, setOrders] = useState([]);
    const [methods, setMethods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchOverview();
        fetchOrders();
        api.get('/admin/pricing/methods').then(res => setMethods(res.data.items || []));
    }, []);

    const fetchOverview = async () => {
        try {
            const res = await api.get('/admin/billing/overview');
            setOverview(res.data);
        } catch (e) { console.error(e); }
    };

    
    
    const [packages, setPackages] = useState([]);
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    
    useEffect(() => {
        api.get('/admin/pricing/packages').then(res => setPackages(res.data.items || []));
    }, []);


    const handleAddClick = () => {
        setEditingPackage({ id: null, name: '', credits: 60, base_price: 9.99, discount_percentage: 0 });
        setShowPackageModal(true);
    };

    const handleEditClick = (p) => {
        setEditingPackage({ ...p });
        setShowPackageModal(true);
    };

    const savePackage = async () => {
        if(!editingPackage.name || !editingPackage.credits || !editingPackage.base_price) {
            alert("Please fill in all required fields.");
            return;
        }
        const payload = {
            name: editingPackage.name,
            credits: parseInt(editingPackage.credits),
            base_price: parseFloat(editingPackage.base_price),
            discount_percentage: parseFloat(editingPackage.discount_percentage || 0),
            active: editingPackage.active !== undefined ? editingPackage.active : true,
            display_order: editingPackage.display_order !== undefined ? editingPackage.display_order : packages.length
        };
        
        try {
            if(editingPackage.id) {
                await api.put(`/admin/pricing/packages/${editingPackage.id}`, payload);
            } else {
                await api.post('/admin/pricing/packages', payload);
            }
            setShowPackageModal(false);
            api.get('/admin/pricing/packages').then(res => setPackages(res.data.items || []));
        } catch(e) {
            alert("Error saving package");
        }
    };

    const togglePackage = async (p) => {
        await api.put(`/admin/pricing/packages/${p.id}`, { ...p, active: !p.active });
        api.get('/admin/pricing/packages').then(res => setPackages(res.data.items || []));
    };

    const deletePackage = async (id) => {
        if(confirm("Delete package?")) {
            await api.delete(`/admin/pricing/packages/${id}`);
            api.get('/admin/pricing/packages').then(res => setPackages(res.data.items || []));
        }
    };

    const toggleMethod = async (id, currentStatus) => {
        try {
            await api.put(`/admin/pricing/methods/${id}`, { is_active: !currentStatus });
            setMethods(methods.map(m => m.id === id ? { ...m, is_active: !currentStatus } : m));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/billing/orders');
            setOrders(res.data.items || []);
        } catch (e) { console.error(e); }
    };

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            try {
                const res = await api.get(`/admin/billing/search?q=${searchQuery}`);
                setSearchResults(res.data);
            } catch (e) { console.error(e); }
        } else {
            setSearchResults(null);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Admin Billing Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e8eaed', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('overview')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'overview' ? '2px solid #1a73e8' : '2px solid transparent', color: activeTab === 'overview' ? '#1a73e8' : '#5f6368', fontWeight: activeTab === 'overview' ? '600' : '400', cursor: 'pointer' }}>Overview & Orders</button>
                <button onClick={() => setActiveTab('subscriptions')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'subscriptions' ? '2px solid #1a73e8' : '2px solid transparent', color: activeTab === 'subscriptions' ? '#1a73e8' : '#5f6368', fontWeight: activeTab === 'subscriptions' ? '600' : '400', cursor: 'pointer' }}>Subscriptions & Packages</button>
                <button onClick={() => setActiveTab('gateways')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'gateways' ? '2px solid #1a73e8' : '2px solid transparent', color: activeTab === 'gateways' ? '#1a73e8' : '#5f6368', fontWeight: activeTab === 'gateways' ? '600' : '400', cursor: 'pointer' }}>Payment Gateways</button>
            </div>
            
            {activeTab === 'overview' && (
                <div>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#9aa0a6' }} size={20} />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Global Search (Orders, Users, Tx...)"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                        />
                        {searchResults && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ddd', borderRadius: '8px', zIndex: 100, maxHeight: '400px', overflowY: 'auto' }}>
                                {Object.entries(searchResults).map(([category, items]) => {
                                    if (items.length === 0) return null;
                                    return (
                                        <div key={category} style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>{category}</div>
                                            {items.map(item => (
                                                <div key={item.id} style={{ padding: '8px', background: '#f8f9fa', marginBottom: '4px', borderRadius: '4px' }}>
                                                    <div style={{ fontWeight: '600' }}>{item.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>{item.subtitle}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ padding: '20px', background: 'white', border: '1px solid #e8eaed', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Total Revenue</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a73e8' }}></div>
                        </div>
                        <div style={{ padding: '20px', background: 'white', border: '1px solid #e8eaed', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Active Subscriptions</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#137333' }}>{overview.active_subscriptions || 0}</div>
                        </div>
                        <div style={{ padding: '20px', background: 'white', border: '1px solid #e8eaed', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Total Orders</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e37400' }}>{overview.total_orders || 0}</div>
                        </div>
                    </div>
                    
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Orders</h3>
                    <div style={{ background: 'white', border: '1px solid #e8eaed', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e8eaed' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>Amount</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#5f6368', fontWeight: '600' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} style={{ borderBottom: '1px solid #e8eaed' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{o.order_number}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{o.user_id}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}></td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: o.status === 'COMPLETED' ? '#e6f4ea' : '#fef08a', color: o.status === 'COMPLETED' ? '#137333' : '#b45309' }}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#5f6368' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'subscriptions' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Subscription Packages</h3>
                        <button onClick={handleAddClick} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Package</button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {packages.map(p => (
                            <div key={p.id} style={{ padding: '16px', background: 'white', border: '1px solid #e8eaed', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600', fontSize: '15px' }}>{p.name}</span>
                                    <span style={{ fontSize: '11px', padding: '2px 6px', background: '#fef08a', borderRadius: '4px', color: '#854d0e', fontWeight: 'bold' }}>{p.discount_percentage}% OFF</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#5f6368' }}>{p.credits} Credits/Min</div>
                                <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>Base: ${p.base_price} <span style={{color: '#94a3b8', textDecoration: 'line-through'}}>${p.base_price}</span></div>
                                <div style={{ fontSize: '16px', color: '#1e293b', fontWeight: 'bold' }}>Final: ${(p.base_price * (1 - p.discount_percentage / 100)).toFixed(2)}</div>
                                
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                                    <button onClick={() => togglePackage(p)} style={{ flex: 1, padding: '6px', background: p.active ? '#fee2e2' : '#dcfce7', color: p.active ? '#ef4444' : '#16a34a', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                        {p.active ? 'Disable' : 'Enable'}
                                    </button>
                                    <button onClick={() => handleEditClick(p)} style={{ flex: 1, padding: '6px', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                                    <button onClick={() => deletePackage(p.id)} style={{ flex: 1, padding: '6px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'gateways' && (
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Payment Gateways</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {methods.map(m => (
                            <div key={m.id} style={{ padding: '16px', background: 'white', border: '1px solid #e8eaed', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{m.provider}</span>
                                    <span style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', color: '#64748b' }}>{m.region}</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#5f6368' }}>{m.method_name}</div>
                                <button onClick={() => toggleMethod(m.id, m.is_active)} style={{ marginTop: 'auto', padding: '8px', background: m.is_active ? '#fee2e2' : '#dcfce7', color: m.is_active ? '#ef4444' : '#16a34a', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>
                                    {m.is_active ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPackageModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', borderRadius: '12px', width: '800px', maxWidth: '90%', aspectRatio: '16/9', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e8eaed', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{editingPackage?.id ? 'Edit Package' : 'Create New Package'}</h2>
                            <button onClick={() => setShowPackageModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', color: '#6b7280', cursor: 'pointer' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '32px', flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Package Name</label>
                                <input type="text" value={editingPackage?.name || ''} onChange={e => setEditingPackage({...editingPackage, name: e.target.value})} placeholder="e.g., 5 Hours, 1 Month" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none' }} />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Credits / Minutes</label>
                                <input type="number" value={editingPackage?.credits || ''} onChange={e => setEditingPackage({...editingPackage, credits: e.target.value})} placeholder="e.g., 300" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none' }} />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Base Price (USD)</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '12px', color: '#6b7280', fontSize: '15px' }}>$</span>
                                    <input type="number" step="0.01" value={editingPackage?.base_price || ''} onChange={e => setEditingPackage({...editingPackage, base_price: e.target.value})} placeholder="9.99" style={{ width: '100%', padding: '12px 16px 12px 32px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none' }} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Discount Percentage</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" value={editingPackage?.discount_percentage || ''} onChange={e => setEditingPackage({...editingPackage, discount_percentage: e.target.value})} placeholder="20" style={{ width: '100%', padding: '12px 32px 12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none' }} />
                                    <span style={{ position: 'absolute', right: '16px', top: '12px', color: '#6b7280', fontSize: '15px' }}>%</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Set to 0 to disable offers</span>
                            </div>
                            
                            <div style={{ gridColumn: '1 / -1', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>Live Final Price Preview:</span>
                                <span style={{ fontSize: '20px', color: '#15803d', fontWeight: 'bold' }}>
                                    ${ ((parseFloat(editingPackage?.base_price || 0)) * (1 - (parseFloat(editingPackage?.discount_percentage || 0)) / 100)).toFixed(2) }
                                </span>
                            </div>
                        </div>
                        
                        <div style={{ padding: '24px 32px', borderTop: '1px solid #e8eaed', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8f9fa' }}>
                            <button onClick={() => setShowPackageModal(false)} style={{ padding: '10px 24px', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                            <button onClick={savePackage} style={{ padding: '10px 24px', background: '#2563eb', border: 'none', borderRadius: '6px', color: 'white', fontWeight: '500', cursor: 'pointer', fontSize: '14px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>Save Package</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
