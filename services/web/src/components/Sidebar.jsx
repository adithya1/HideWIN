import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, FileAudio, Users, FolderOpen, 
    Settings, EyeOff, Sparkles, UserCircle, PlayCircle
} from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

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
        padding: '12px 16px',
        margin: '4px 16px',
        borderRadius: '10px',
        textDecoration: 'none',
        color: active ? '#ffffff' : '#64748b',
        backgroundColor: active ? '#0f172a' : 'transparent',
        fontWeight: active ? '600' : '500',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
    });

    return (
        <div style={{ width: '260px', borderRight: '1px solid #e2e8f0', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Sparkles size={18} />
                </div>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>HuddleMate</span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '16px' }}>
                {topItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))} onMouseOver={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseOut={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <item.icon size={18} style={{ marginRight: '12px', opacity: isActive(item.path) ? 1 : 0.7 }} />
                        {item.name}
                    </Link>
                ))}

                <div style={{ margin: '32px 24px 8px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Preferences
                </div>

                {bottomItems.map(item => (
                    <Link key={item.name} to={item.path} style={linkStyle(isActive(item.path))} onMouseOver={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseOut={e => !isActive(item.path) && (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <item.icon size={18} style={{ marginRight: '12px', opacity: isActive(item.path) ? 1 : 0.7 }} />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        {item.badge && (
                            <span style={{ backgroundColor: '#3b82f6', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0e7ff)', padding: '16px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '700', color: '#0369a1' }}>Upgrade to Pro</p>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#0ea5e9' }}>Unlock unlimited transcripts and stealth mode.</p>
                    <Link to="/account" style={{ display: 'block', textAlign: 'center', background: '#0284c7', color: 'white', textDecoration: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Upgrade Now</Link>
                </div>
            </div>
        </div>
    );
}
