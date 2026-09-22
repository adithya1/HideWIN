import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Monitor, Globe, ChevronRight, Download } from 'lucide-react';

export default function JoinMeeting() {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const [launchStatus, setLaunchStatus] = useState('idle');

    useEffect(() => {
        // 1. Fetch public meeting info
        const fetchMeeting = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/public/meetings/${meetingId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMeeting(data);
                } else {
                    setMeeting(null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeeting();

        // 2. Check if logged in user is the host
        const token = localStorage.getItem('hidewin_token');
        if (token) {
            // Ideally an API checks if user owns this meeting, here we assume if they have a token they might be host
            // For a robust check, the backend `/public/meetings` could return `is_host: true` if token is passed.
            // We will do a basic decode or just assume logged in = host for this prototype's host enforcement.
            setIsHost(true); 
        }

    }, [meetingId]);

    const handleLaunchDesktop = () => {
        setLaunchStatus('launching');
        // Attempt deep link
        window.location.href = `hidewin://join?id=${meetingId}`;
        
        // Fallback detection
        setTimeout(() => {
            setLaunchStatus('failed');
        }, 3000);
    };

    const handleJoinBrowser = () => {
        // Route to the web-based meeting room placeholder
        navigate(`/room/${meetingId}`);
    };

    if (isLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6f7' }}><div className="lazy-skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div></div>;
    }

    if (!meeting) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6f7' }}>
                <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
                    <ShieldCheck size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Meeting Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>This meeting link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f6f7', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <ShieldCheck size={32} color="var(--primary)" />
                <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>HideWin</span>
            </div>

            <div className="card fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1c1e21', marginBottom: '8px' }}>{meeting.title}</h1>
                <p style={{ color: '#5f6368', fontSize: '15px' }}>Hosted by {meeting.host_name}</p>
                
                <div style={{ margin: '32px 0', borderTop: '1px solid #e5e7eb' }}></div>

                {isHost ? (
                    <div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', marginBottom: '24px', textAlign: 'left', display: 'flex', gap: '12px' }}>
                            <Monitor color="#2563eb" size={24} style={{ flexShrink: 0 }} />
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a', margin: '0 0 4px 0' }}>Host Authentication</h3>
                                <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: 1.5 }}>As the host, you must launch the meeting from the HideWin Desktop Application to enable secure overlay features.</p>
                            </div>
                        </div>
                        
                        <button onClick={handleLaunchDesktop} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {launchStatus === 'launching' ? 'Launching App...' : 'Launch Desktop App'}
                        </button>
                        
                        {launchStatus === 'failed' && (
                            <div className="fade-in" style={{ marginTop: '24px' }}>
                                <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '12px' }}>Don't have the app installed?</p>
                                <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    <Download size={18} /> Download for Windows
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1c1e21', marginBottom: '24px' }}>How would you like to join?</h2>
                        
                        <button onClick={handleLaunchDesktop} style={{ width: '100%', background: 'white', border: '1px solid #d1d5db', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '12px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = '#d1d5db'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                                    <Monitor size={24} color="#374151" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1c1e21' }}>Join from Desktop App</div>
                                    <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '2px' }}>Best for secure audio & video</div>
                                </div>
                            </div>
                            <ChevronRight color="#9ca3af" />
                        </button>

                        <button onClick={handleJoinBrowser} style={{ width: '100%', background: 'white', border: '1px solid #d1d5db', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = '#d1d5db'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                                    <Globe size={24} color="#374151" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1c1e21' }}>Join from Browser</div>
                                    <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '2px' }}>No installation required</div>
                                </div>
                            </div>
                            <ChevronRight color="#9ca3af" />
                        </button>
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '48px', color: '#9ca3af', fontSize: '13px' }}>
                &copy; {new Date().getFullYear()} HideWin. All rights reserved.
            </div>
        </div>
    );
}
