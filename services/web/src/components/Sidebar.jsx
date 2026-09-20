import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home, Bot, Clock, Folder, 
    User, EyeOff, Gift, Volume2, ShieldAlert, HelpCircle, ChevronDown, ChevronUp, Star, Download
} from 'lucide-react';
import { API_BASE } from '../config';

export default function Sidebar() {
    const location = useLocation();
    const [branding, setBranding] = useState({ logo_light: '', logo_dark: '', browser_icon: '' });
    const [isAccountOpen, setIsAccountOpen] = useState(true); // Default open to match screenshot

    useEffect(() => {
        fetch(`${API_BASE}/auth/branding`)
            .then(res => res.json())
            .then(data => setBranding(data))
            .catch(err => console.error('Failed to load branding', err));
    }, []);

    const topItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Assistants', path: '/assistants', icon: Bot },
        { name: 'Sessions', path: '/sessions', icon: Clock },
        { name: 'Documents', path: '/documents', icon: Folder },
    ];

    const accountSubItems = [
        { name: 'Profile', path: '/account/profile' },
        { name: 'Credits', path: '/account/credits' },
        { name: 'Transactions', path: '/account/transactions' },
        { name: 'Credit History', path: '/account/credit-history' },
        
        
    ];

    const bottomItems = [
        { name: 'Go Invisible', path: '/invisible', icon: Download, star: true },
        { name: 'Refer & Earn', path: '/refer', icon: Gift, badge: 'NEW' },
        { name: 'Audio Check', path: '/audio', icon: Volume2 },
        { name: 'Invisibility Check', path: '/invisibility-check', icon: EyeOff },
        { name: 'Help', path: '/help', icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #8f8f8f;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: #707070;
                    }
                `}
            </style>
            <div className="custom-scrollbar" style={{ width: '250px', minWidth: '250px', borderRight: '1px solid #e0e0e0', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    {branding.logo_light ? (
                        <img src={branding.logo_light} alt="HideWin" style={{ height: '36px', objectFit: 'contain' }} />
                    ) : (
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>HideWin</span>
                    )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
                    {topItems.map(item => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.name} to={item.path} style={{
                                display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                                textDecoration: 'none', color: active ? '#1a73e8' : '#5f6368',
                                backgroundColor: active ? '#f0f4ff' : 'transparent',
                                fontWeight: active ? '600' : '500', fontSize: '15px', position: 'relative'
                            }}>
                                {active && <div style={{ position: 'absolute', left: '-12px', top: '10px', bottom: '10px', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                                <item.icon size={18} style={{ marginRight: '16px', color: active ? '#1a73e8' : '#5f6368' }} strokeWidth={active ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        )
                    })}

                    <div style={{ margin: '24px 16px 12px 16px', fontSize: '11px', fontWeight: '600', color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        MORE
                    </div>

                    {/* Account Accordion */}
                    <div 
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                            cursor: 'pointer', color: isAccountOpen ? '#202124' : '#5f6368',
                            backgroundColor: 'transparent', fontWeight: '500', fontSize: '15px'
                        }}
                    >
                        <User size={18} style={{ marginRight: '16px', color: isAccountOpen ? '#202124' : '#5f6368' }} />
                        <span style={{ flex: 1 }}>Account</span>
                        {isAccountOpen ? <ChevronUp size={16} color="#5f6368" /> : <ChevronDown size={16} color="#5f6368" />}
                    </div>

                    {/* Account Sub-items */}
                    {isAccountOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
                            {accountSubItems.map(sub => {
                                const active = location.pathname === sub.path;
                                return (
                                    <Link key={sub.name} to={sub.path} style={{
                                        display: 'block', padding: '10px 16px 10px 50px', borderRadius: '6px',
                                        textDecoration: 'none', color: active ? '#1a73e8' : '#6c7f93',
                                        backgroundColor: active ? '#f0f4ff' : 'transparent',
                                        fontWeight: active ? '500' : '400', fontSize: '14px'
                                    }}>
                                        {sub.name}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {bottomItems.map(item => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.name} to={item.path} style={{
                                display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '6px',
                                textDecoration: 'none', color: active ? '#1a73e8' : '#5f6368',
                                backgroundColor: active ? '#f0f4ff' : 'transparent',
                                fontWeight: '500', fontSize: '15px'
                            }}>
                                <item.icon size={18} style={{ marginRight: '16px', color: '#5f6368' }} />
                                <span style={{ flex: 1 }}>{item.name}</span>
                                
                                {item.star && <Star size={16} color="#fbbc04" style={{ strokeWidth: 1.5 }} />}
                                {item.badge && (
                                    <span style={{ backgroundColor: '#1a73e8', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    );
}
