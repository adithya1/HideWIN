import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, LayoutGrid, Zap, CheckCircle2, MoreHorizontal, Loader2 } from 'lucide-react';
import { API_BASE } from '../config';

export default function Dashboard() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Meeting Copilots');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tplRes = await fetch(`${API_BASE}/user/assistants/templates`);
                if (tplRes.ok) {
                    const data = await tplRes.json();
                    setTemplates(data);
                    if (data.length > 0) {
                        const uniqueCats = [...new Set(data.map(t => t.category || 'Meeting Copilots'))];
                        if (uniqueCats.length > 0) setActiveCategory(uniqueCats[0]);
                    }
                }
                
                const astRes = await fetch(`${API_BASE}/user/assistants/`);
                if (astRes.ok) setAssistants(await astRes.json());
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLaunchTemplate = (templateId) => {
        navigate(`/assistant/create?templateId=${templateId}`);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#6b7280' }}>
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    const uniqueCategories = [...new Set(templates.map(t => t.category || 'Meeting Copilots'))];
    const filteredTemplates = templates.filter(t => (t.category || 'Meeting Copilots') === activeCategory);
    
    // Group filtered templates by subcategory
    const subcategories = {};
    filteredTemplates.forEach(t => {
        const sub = t.subcategory || 'General';
        if (!subcategories[sub]) subcategories[sub] = [];
        subcategories[sub].push(t);
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px', fontFamily: 'Inter, system-ui, sans-serif' }} className="animate-fade-slide-up">
            
            {/* Header */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Dashboard</h1>
                    <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '15px', fontWeight: '400' }}>Access your specialized AI copilots and active meeting assistants.</p>
                </div>
            </div>

            {/* Horizontal Tabs for Categories */}
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e5e7eb', marginBottom: '40px', overflowX: 'auto' }}>
                {uniqueCategories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{ 
                            padding: '0 0 12px 0', 
                            border: 'none', 
                            background: 'transparent',
                            cursor: 'pointer', 
                            color: activeCategory === cat ? '#4f46e5' : '#6b7280',
                            fontWeight: activeCategory === cat ? '600' : '500',
                            fontSize: '14px',
                            borderBottom: activeCategory === cat ? '2px solid #4f46e5' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div>
                {Object.keys(subcategories).map((subcat, idx) => (
                    <div key={subcat} style={{ marginBottom: '56px' }} className={`animate-fade-slide-up stagger-${(idx % 3) + 1}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{subcat}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {subcategories[subcat].map((tpl) => (
                                <div 
                                    key={tpl.id} 
                                    className="posh-card group"
                                    style={{ 
                                        backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', 
                                        padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                                        position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => handleLaunchTemplate(tpl.id)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Zap size={22} fill="currentColor" strokeWidth={1} />
                                        </div>
                                        <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{tpl.name}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', flex: 1, marginBottom: '24px', lineHeight: '1.5' }}>
                                        {tpl.description || 'A ready-to-use co-pilot for your dynamic workflows.'}
                                    </p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleLaunchTemplate(tpl.id); }}
                                        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#111827'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#111827'; }}
                                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                                    >
                                        Configure
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTemplates.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', background: '#f9fafb', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
                        <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#9ca3af' }}><Sparkles size={24} /></div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>No templates found</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Ask your admin to create templates for this category.</p>
                    </div>
                )}

                <div className="animate-fade-slide-up stagger-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', marginTop: '48px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#111827', letterSpacing: '-0.01em' }}>Active Assistants</h2>
                    </div>
                </div>

                <div className="posh-card animate-fade-slide-up stagger-3" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
                    {assistants.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>You have no active assistants.</div>
                    ) : (
                        assistants.map((ast, i) => (
                            <div key={ast.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: i < assistants.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}>
                                <div style={{ marginRight: '16px', color: '#10b981' }}><CheckCircle2 size={20} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px', marginBottom: '2px' }}>{ast.name}</div>
                                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{ast.target_role ? `Role: ${ast.target_role}` : 'General Assistant'}</div>
                                </div>
                                <button style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5';}} onMouseOut={e => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151';}}>Manage</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
