import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, Bot, Clock, Folder, 
    User, EyeOff, Gift, Volume2, ShieldAlert, HelpCircle, ChevronDown, ChevronUp, Star, Download, LogOut, MoreVertical, CreditCard, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_BASE } from '../config';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef(null);

    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccountExpanded, setIsAccountExpanded] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('hidewin_token');
        navigate('/login');
    };

    const location = useLocation();
    const [branding, setBranding] = useState({ logo_light: '', logo_dark: '', browser_icon: '' });
    const [currentUser, setCurrentUser] = useState(() => {
        // Decode email from JWT immediately so sidebar never shows "Loading..."
        try {
            const token = localStorage.getItem('hidewin_token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.sub) return { email: payload.sub, full_name: null };
            }
        } catch {}
        return null;
    });

    useEffect(() => {
        fetch(`${API_BASE}/auth/branding`)
            .then(res => res.json())
            .then(data => setBranding(data))
            .catch(err => console.error('Failed to load branding', err));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('hidewin_token');
        if (token) {
            fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => res.ok ? res.json() : null)
                .then(data => { if (data) setCurrentUser(data); })
                .catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            let newWidth = e.clientX;
            if (newWidth < 200) newWidth = 200;
            if (newWidth > 400) newWidth = 400;
            setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const topItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Assistants', path: '/assistants', icon: Bot },
        { name: 'Sessions', path: '/sessions', icon: Clock },
        { name: 'Documents', path: '/documents', icon: Folder },
    ];

    const bottomItems = [
        { name: 'Go Invisible', path: '/go-invisible', icon: EyeOff, star: true },
        { name: 'Refer & Earn', path: '/refer', icon: Gift, badge: 'Free' },
        { name: 'Help', path: '/help', icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
                `}
            </style>
            <div 
                ref={sidebarRef}
                className="custom-scrollbar" 
                style={{ 
                    width: isSidebarOpen ? `${sidebarWidth}px` : '72px', 
                    minWidth: isSidebarOpen ? `${sidebarWidth}px` : '72px', 
                    borderRight: '1px solid #e2e8f0', 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    backgroundColor: '#ffffff', 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    overflowY: 'auto', 
                    overflowX: 'hidden', 
                    transition: isResizing ? 'none' : 'width 0.2s, min-width 0.2s',
                    position: 'relative',
                    userSelect: isResizing ? 'none' : 'auto'
                }}
            >
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', marginBottom: '8px' }}>
                    {isSidebarOpen && (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            {branding.logo_light ? (
                                <img src={branding.logo_light} alt="HideWin" style={{ maxHeight: '36px', maxWidth: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>HideWin</span>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        style={{ 
                            background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' 
                        }}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                    {topItems.map(item => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.name} to={item.path} style={{
                                display: 'flex', alignItems: 'center', padding: isSidebarOpen ? '10px 16px' : '10px', gap: '16px', borderRadius: '8px',
                                textDecoration: 'none', color: active ? '#1a73e8' : '#475569',
                                backgroundColor: active ? '#eff6ff' : 'transparent',
                                fontWeight: active ? '600' : '500', fontSize: '14px', position: 'relative',
                                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                whiteSpace: 'nowrap', overflow: 'hidden'
                            }}>
                                {active && <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', height: '60%', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                                <item.icon size={18} style={{ minWidth: '18px', color: active ? '#1a73e8' : '#64748b' }} strokeWidth={active ? 2.5 : 2} />
                                <span style={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0, overflow: 'hidden', textOverflow: 'ellipsis', transition: 'opacity 0.2s' }}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}

                    <div style={{ margin: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: isSidebarOpen ? 'block' : 'none' }}>
                        MORE
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => setIsAccountExpanded(!isAccountExpanded)} style={{
                            display: 'flex', alignItems: 'center', padding: isSidebarOpen ? '10px 16px' : '10px', gap: '16px', borderRadius: '8px',
                            border: 'none', cursor: 'pointer',
                            color: isActive('/account') ? '#1a73e8' : '#475569',
                            backgroundColor: isActive('/account') ? '#eff6ff' : 'transparent',
                            fontWeight: isActive('/account') ? '600' : '500', fontSize: '14px', position: 'relative',
                            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                            whiteSpace: 'nowrap', overflow: 'hidden'
                        }}>
                            {isActive('/account') && <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', height: '60%', width: '3px', backgroundColor: '#1a73e8', borderRadius: '0 4px 4px 0' }} />}
                            <User size={18} style={{ minWidth: '18px', color: isActive('/account') ? '#1a73e8' : '#64748b' }} strokeWidth={isActive('/account') ? 2.5 : 2} />
                            <span style={{ flex: 1, opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0, overflow: 'hidden', textOverflow: 'ellipsis', transition: 'opacity 0.2s', textAlign: 'left' }}>
                                Account
                            </span>
                            {isSidebarOpen && (isAccountExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                        </button>
                        
                        {isAccountExpanded && isSidebarOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '44px', marginTop: '4px', gap: '4px' }}>
                                <Link to="/account/profile" style={{ textDecoration: 'none', color: location.pathname.includes('profile') ? '#1a73e8' : '#64748b', fontSize: '13px', padding: '6px 0' }}>Profile</Link>
                                <Link to="/account/credits" style={{ textDecoration: 'none', color: location.pathname.includes('credits') ? '#1a73e8' : '#64748b', fontSize: '13px', padding: '6px 0' }}>Credits</Link>
                                <Link to="/account/transactions" style={{ textDecoration: 'none', color: location.pathname.includes('transactions') ? '#1a73e8' : '#64748b', fontSize: '13px', padding: '6px 0' }}>Transactions</Link>
                                <Link to="/account/credit-history" style={{ textDecoration: 'none', color: location.pathname.includes('credit-history') ? '#1a73e8' : '#64748b', fontSize: '13px', padding: '6px 0' }}>Credit History</Link>
                            </div>
                        )}
                    </div>

                    {bottomItems.map(item => {
                        const active = isActive(item.path);
                        return (
                            <Link key={item.name} to={item.path} style={{
                                display: 'flex', alignItems: 'center', padding: isSidebarOpen ? '10px 16px' : '10px', gap: '16px', borderRadius: '8px',
                                textDecoration: 'none', color: active ? '#1a73e8' : '#475569',
                                backgroundColor: active ? '#eff6ff' : 'transparent',
                                fontWeight: active ? '600' : '500', fontSize: '14px', position: 'relative',
                                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                whiteSpace: 'nowrap', overflow: 'hidden'
                            }}>
                                <item.icon size={18} style={{ minWidth: '18px', color: active ? '#1a73e8' : '#64748b' }} strokeWidth={active ? 2.5 : 2} />
                                <span style={{ flex: 1, opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0, overflow: 'hidden', textOverflow: 'ellipsis', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {item.name}
                                    {item.star && <Star size={16} color="#f59e0b" style={{ strokeWidth: 2 }} />}
                                </span>
                                
                                {item.badge && isSidebarOpen && (
                                    <span style={{ backgroundColor: '#1d4ed8', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
                
                {/* Resizer Handle */}
                {isSidebarOpen && (
                    <div 
                        onMouseDown={() => setIsResizing(true)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '4px',
                            height: '100%',
                            cursor: 'col-resize',
                            backgroundColor: isResizing ? '#1a73e8' : 'transparent',
                            transition: 'background-color 0.2s',
                            zIndex: 10
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 115, 232, 0.5)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = isResizing ? '#1a73e8' : 'transparent'}
                    />
                )}

                {/* Profile Chip */}
                <div style={{ padding: '16px', position: 'relative', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
                    {isProfileMenuOpen && (
                        <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '16px', right: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, padding: '8px 0', overflow: 'hidden' }}>
                            <Link to="/account/profile" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: '12px', textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                                <User size={16} /> Profile
                            </Link>
                            <Link to="/account/credits" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: '12px', textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                                <CreditCard size={16} /> Billing
                            </Link>
                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }}></div>
                            <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 16px', gap: '12px', textDecoration: 'none', color: '#ef4444', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', width: '100%', padding: isSidebarOpen ? '8px 12px' : '8px', background: isProfileMenuOpen ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                                {currentUser
                                    ? (currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase())
                                    : '?'}
                            </div>
                            {isSidebarOpen && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                                        {currentUser
                                            ? (currentUser.full_name ? currentUser.full_name.split(' ')[0] : currentUser.email.split('@')[0])
                                            : 'Loading...'}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                                        {currentUser ? currentUser.email : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                        {isSidebarOpen && <MoreVertical size={16} color="#94a3b8" />}
                    </button>
                </div>
            </div>
            {isProfileMenuOpen && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }} onClick={() => setIsProfileMenuOpen(false)}></div>}
        </>
    );
}
