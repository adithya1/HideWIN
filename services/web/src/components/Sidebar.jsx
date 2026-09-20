import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, FileAudio, Users, FolderOpen, 
    Settings, EyeOff, UserCircle, PlayCircle
} from 'lucide-react';
import { API_BASE } from '../config';

export default function Sidebar() {
    const location = useLocation();
    const [branding, setBranding] = useState({ logo_light: '', logo_dark: '', browser_icon: '' });

    useEffect(() => {
        fetch(`${API_BASE}/auth/branding`)
            .then(res => res.json())
            .then(data => setBranding(data))
            .catch(err => console.error('Failed to load branding', err));
    }, []);

    const topItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Copilots', path: '/assistants', icon: Users },
        { name: 'Meeting Notes', path: '/sessions', icon: FileAudio },
        { name: 'Knowledge Base', path: '/documents', icon: FolderOpen },
    ];

    const bottomItems = [
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Billing', path: '/account', icon: UserCircle },
        { name: 'Stealth Mode', path: '/invisible', icon: EyeOff },
        { name: 'Tutorials', path: '/help', icon: PlayCircle },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const linkStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        margin: '4px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: active ? '#111827' : '#6b7280',
        backgroundColor: active ? '#f3f4f6' : 'transparent',
        fontWeight: active ? '600' : '500',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{ width: '260px', borderRight: '1px solid #e5e7eb', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {branding.logo_light ? (
                    <img src={branding.logo_light} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
                ) : (
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>HideWin</span>
                )}
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px' }}>
                <div style={{ margin: '0 24px 8px 24px', fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Menu
                </div>
                {topItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))} onMouseOver={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseOut={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <item.icon size={18} style={{ marginRight: '12px', color: isActive(item.path) ? '#4f46e5' : '#9ca3af' }} />
                        {item.name}
                    </Link>
                ))}

                <div style={{ margin: '32px 24px 8px 24px', fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Preferences
                </div>

                {bottomItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))} onMouseOver={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseOut={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <item.icon size={18} style={{ marginRight: '12px', color: isActive(item.path) ? '#4f46e5' : '#9ca3af' }} />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        {item.badge && (
                            <span style={{ backgroundColor: '#4f46e5', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
