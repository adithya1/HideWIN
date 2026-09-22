import React, { useState, useEffect } from 'react';

import { Calendar, Plus, Clock, Edit2, Link as LinkIcon, Trash2, Mail, MessageCircle, Send, MonitorPlay, Users , FileText } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;
    
    const [isScheduling, setIsScheduling] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [csvError, setCsvError] = useState('');
    const [isSendingInvite, setIsSendingInvite] = useState(false);
    const [form, setForm] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        timezone: '(GMT-11:00) Midway Island, Samoa'
    });


    const [isEditingMeeting, setIsEditingMeeting] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', date: '', startTime: '', endTime: '', timezone: 'UTC' });
    const [isRescheduling, setIsRescheduling] = useState(false);

    useEffect(() => {
        fetchMeetings();
    }, []);

    
    const handleRescheduleMeeting = async () => {
        setIsRescheduling(true);
        try {
            const startStr = `${editForm.date}T${editForm.startTime}:00`;
            const endStr = `${editForm.date}T${editForm.endTime}:00`;
            const payload = {
                title: editForm.title,
                start_time: startStr,
                end_time: endStr,
                timezone: editForm.timezone,
            };

            const token = localStorage.getItem('hidewin_token');
            const res = await fetch(`http://127.0.0.1:8000/user/meetings/${selectedMeeting.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setSelectedMeeting({...selectedMeeting, title: editForm.title, start_time: startStr, end_time: endStr, timezone: editForm.timezone, join_url: data.join_url, google_cal_url: data.google_cal_url, outlook_cal_url: data.outlook_cal_url, ics_url: data.ics_url});
                setIsEditingMeeting(false);
                fetchMeetings();
                alert('Meeting successfully rescheduled!');
            } else {
                alert('Failed to reschedule meeting');
            }
        } catch (error) {
            console.error('Error rescheduling meeting:', error);
            alert('An error occurred while rescheduling.');
        } finally {
            setIsRescheduling(false);
        }
    };

    const fetchMeetings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('hidewin_token');
            const res = await fetch('http://127.0.0.1:8000/user/meetings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                localStorage.removeItem('hidewin_token');
                window.location.href = '/login';
                return;
            }
            if (res.status === 401) {
                localStorage.removeItem('hidewin_token');
                window.location.href = '/login';
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setMeetings(data.meetings);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSchedule = async (e) => {
        if (e) e.preventDefault();
        try {
            const token = localStorage.getItem('hidewin_token');
            
            // Generate full ISO strings
            const start_time = new Date(`${form.date}T${form.startTime}:00`);
            const end_time = new Date(`${form.date}T${form.endTime}:00`);
            
            const res = await fetch('http://127.0.0.1:8000/user/meetings', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: form.title || 'Untitled Meeting',
                    start_time: start_time.toISOString(),
                    end_time: end_time.toISOString(),
                    timezone: form.timezone,
                    participants: []
                })
            });
            
            if (res.status === 401) {
                localStorage.removeItem('hidewin_token');
                window.location.href = '/login';
                return;
            }
            if (res.ok) {
                setIsScheduling(false);
                fetchMeetings();
                setForm({
                    title: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    timezone: '(GMT-11:00) Midway Island, Samoa'
                });
            } else {
                const errText = await res.text();
                alert(`Failed to schedule meeting. Status: ${res.status}. Response: ${errText}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error scheduling meeting");
        }
    };

    
    const getInviteText = (meeting) => {
        const link = `${window.location.origin}/join/${meeting.id}?auth=auto`;
        return `You have been invited to a HideWin meeting.

Topic: ${meeting.title}
Date: ${new Date(meeting.start_time).toLocaleDateString()}
Time: ${new Date(meeting.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(meeting.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
Timezone: ${meeting.timezone}

Join Meeting:
${link}

Meeting ID: ${meeting.id}`;
    };

    
    
    
    
    const getHtmlContent = (meeting) => {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #1e3a8a; margin-top: 0;">You're Invited to a HideWin Meeting</h2>
                <p style="color: #374151; font-size: 16px;"><strong>Topic:</strong> ${meeting.title}</p>
                <p style="color: #374151; font-size: 16px;"><strong>Date:</strong> ${new Date(meeting.start_time).toLocaleDateString()}</p>
                <p style="color: #374151; font-size: 16px;"><strong>Time:</strong> ${new Date(meeting.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(meeting.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p style="color: #374151; font-size: 16px;"><strong>Timezone:</strong> ${meeting.timezone}</p>
                <div style="margin: 24px 0;">
                    <a href="${window.location.origin}/join/${meeting.id}?auth=auto" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Meeting</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Meeting ID: <strong>${meeting.id}</strong></p>
            </div>
        `;
    };

    const copyToClipboardAndOpen = async (url, includeBodyInUrl = false) => {
        const htmlContent = getHtmlContent(selectedMeeting);
        const plainContent = getInviteText(selectedMeeting);
        try {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([plainContent], { type: 'text/plain' }),
                'text/html': new Blob([htmlContent], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
        } catch (err) {
            navigator.clipboard.writeText(plainContent);
        }
        
        // Open the URL
        if (includeBodyInUrl) {
            window.open(url.replace('BODY_PLACEHOLDER', encodeURIComponent(plainContent)), '_blank');
        } else {
            window.open(url.replace('&body=BODY_PLACEHOLDER', ''), '_blank');
        }
    };

    const handleCsvUpload = (e) => {
        setCsvError('');
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            // Simple parsing: split by newline or comma, extract emails
            const matches = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
            if (matches && matches.length > 0) {
                const uniqueEmails = [...new Set(matches)];
                setInviteEmail(prev => {
                    const current = prev.split(',').map(e => e.trim()).filter(e => e);
                    const combined = [...new Set([...current, ...uniqueEmails])];
                    return combined.join(', ');
                });
                alert(`Successfully extracted ${uniqueEmails.length} email(s) from CSV.`);
            } else {
                setCsvError('No valid emails found in the CSV file.');
            }
            e.target.value = ''; // reset
        };
        reader.readAsText(file);
    };

    const handleSendCorporateInvite = async () => {
        if (!inviteEmail) return alert("Please enter at least one email address");
        setIsSendingInvite(true);
        
        const emails = inviteEmail.split(',').map(e => e.trim()).filter(e => e);
        
        try {
            const token = localStorage.getItem('hidewin_token');
            let successCount = 0;
            
            // Send sequentially or update backend to accept list (we'll just loop for now since it's easy)
            for (const email of emails) {
                const res = await fetch(`http://127.0.0.1:8000/user/meetings/${selectedMeeting.id}/invite`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });
                if (res.ok) successCount++;
            }
            
            alert(`Corporate HTML Invite successfully sent to ${successCount} recipient(s)!`);
            if (successCount === emails.length) {
                setInviteEmail('');
            }
        } catch(e) {
            console.error(e);
            alert("Error sending invites");
        } finally {
            setIsSendingInvite(false);
        }
    };


    const handleLaunch = (id) => {
        window.location.href = `hidewin://join?meetingId=${id}`;
    };

    const paginatedMeetings = meetings.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const timezones = [
        "(GMT-12:00) International Date Line West",
        "(GMT-11:00) Midway Island, Samoa",
        "(GMT-10:00) Hawaii",
        "(GMT-09:00) Alaska",
        "(GMT-08:00) Pacific Time (US & Canada)",
        "(GMT-07:00) Mountain Time (US & Canada)",
        "(GMT-06:00) Central Time (US & Canada)",
        "(GMT-05:00) Eastern Time (US & Canada)",
        "(GMT-04:00) Atlantic Time (Canada)",
        "(GMT-03:00) Buenos Aires, Georgetown",
        "(GMT-02:00) Mid-Atlantic",
        "(GMT-01:00) Azores, Cape Verde Is.",
        "(GMT+00:00) Greenwich Mean Time : London",
        "(GMT+01:00) Amsterdam, Berlin, Rome",
        "(GMT+02:00) Athens, Jerusalem",
        "(GMT+03:00) Moscow, St. Petersburg",
        "(GMT+04:00) Abu Dhabi, Muscat",
        "(GMT+05:00) Islamabad, Karachi",
        "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "(GMT+06:00) Astana, Dhaka",
        "(GMT+07:00) Bangkok, Hanoi, Jakarta",
        "(GMT+08:00) Beijing, Perth, Singapore",
        "(GMT+09:00) Tokyo, Seoul",
        "(GMT+10:00) Eastern Australia, Guam",
        "(GMT+11:00) Magadan, Solomon Is.",
        "(GMT+12:00) Auckland, Wellington"
    ];

    return (
        <div className="fade-in" style={{ padding: '24px 0', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>Meetings</h1>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setIsScheduling(true)}>
                    <Plus size={18} /> Schedule Meeting
                </button>
            </div>

            
            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meeting Details</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading meetings...</td>
                            </tr>
                        ) : paginatedMeetings.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Calendar size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                    <div>No meetings scheduled yet.</div>
                                    <div style={{ marginTop: '4px' }}>Click 'Schedule Meeting' to create one.</div>
                                </td>
                            </tr>
                        ) : (
                            paginatedMeetings.map(m => (
                                <tr key={m.id} onClick={() => setSelectedMeeting(m)} style={{ cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid #f1f5f9' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px', marginBottom: '6px' }}>{m.title}</div>
                                        <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                                            {m.id}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{new Date(m.start_time).toLocaleDateString()}</div>
                                        <div style={{ color: '#64748b', fontSize: '13px' }}>{new Date(m.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ 
                                            background: m.status === 'SCHEDULED' ? '#ecfdf5' : '#f1f5f9', 
                                            color: m.status === 'SCHEDULED' ? '#10b981' : '#64748b', 
                                            padding: '6px 12px', 
                                            borderRadius: '9999px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em'
                                        }}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button onClick={(e) => { e.stopPropagation(); handleLaunch(m.id); }} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#2563eb'} onMouseOut={e=>e.currentTarget.style.background='#3b82f6'}>Launch</button>
                                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#475569', transition: 'all 0.2s' }} title="Copy Invite Link" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/join/${m.id}`); alert('Link copied!'); }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='#f8fafc'}>
                                                <LinkIcon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {meetings.length > PER_PAGE && (
                    <div style={{ borderTop: '1px solid #f3f4f6' }}>
                        <Pagination currentPage={page} totalPages={Math.ceil(meetings.length / PER_PAGE)} onPageChange={setPage} isLoading={isLoading} />
                    </div>
                )}
            </div>

            {isScheduling && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card fade-in" style={{ width: '850px', background: '#f8f9fa', padding: '24px 32px', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb' }}>
                        
                        {/* Header matching screenshot */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151' }}>
                                <Calendar size={20} />
                                <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Schedule Meeting</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setIsScheduling(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSchedule} style={{ padding: '8px 16px', background: '#1d4ed8', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: 'white', cursor: 'pointer' }}>Generate</button>
                            </div>
                        </div>

                        {/* Body matching screenshot */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px 0 32px 0' }}>
                            
                            {/* Meeting Title */}
                            <div>
                                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Meeting Title" style={{ width: '100%', fontSize: '28px', fontWeight: 600, color: '#4b5563', border: 'none', borderBottom: '1px solid #d1d5db', background: 'transparent', padding: '8px 0', outline: 'none' }} />
                            </div>

                            {/* Date & Time Row */}
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                                <div style={{ flex: 1.2 }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Date</label>
                                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', color: '#374151' }} />
                                </div>
                                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Time</label>
                                        <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', color: '#374151' }} />
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '24px' }}>to</div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: 'transparent', marginBottom: '8px' }}>-</label>
                                        <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', color: '#374151' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Timezone */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Timezone</label>
                                <select value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', color: '#374151' }}>
                                    {timezones.map(tz => (
                                        <option key={tz} value={tz}>{tz}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {selectedMeeting && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedMeeting(null)}>
                    <div className="card fade-in" style={{ width: '850px', background: '#f8f9fa', padding: '24px 32px', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb' }} onClick={e => e.stopPropagation()}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#374151' }}>
                                <Calendar size={20} />
                                <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Meeting Details</h2>
                                <span className={`badge ${selectedMeeting.status === 'SCHEDULED' ? 'badge-active' : 'badge-pending'}`} style={{ marginLeft: '12px' }}>{selectedMeeting.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {!isEditingMeeting && <button onClick={() => { setIsEditingMeeting(true); setEditForm({ title: selectedMeeting.title, date: selectedMeeting.start_time.split('T')[0], startTime: selectedMeeting.start_time.split('T')[1].substring(0,5), endTime: selectedMeeting.end_time.split('T')[1].substring(0,5), timezone: selectedMeeting.timezone }); }} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer', marginRight: '12px' }}>Reschedule</button>}
                                <button onClick={() => { setSelectedMeeting(null); setIsEditingMeeting(false); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Close</button>
                                <button onClick={() => handleLaunch(selectedMeeting.id)} style={{ padding: '8px 16px', background: '#1d4ed8', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: 'white', cursor: 'pointer' }}>Launch</button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '40px', paddingBottom: '16px' }}>
                            
                            {isEditingMeeting ? (
                                <div style={{ flex: 1.5, paddingRight: '40px' }}>
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827' }}>Reschedule Meeting</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <input type="text" placeholder="Meeting Title" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <input type="time" value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                            <input type="time" value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                                        </div>
                                        <select value={editForm.timezone} onChange={e => setEditForm({...editForm, timezone: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        </select>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                            <button onClick={handleRescheduleMeeting} disabled={isRescheduling} style={{ flex: 1, background: '#10b981', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>{isRescheduling ? 'Saving...' : 'Save Changes'}</button>
                                            <button onClick={() => setIsEditingMeeting(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ flex: 1.5 }}>
                                    <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#4b5563', margin: '0 0 8px 0', paddingBottom: '8px', borderBottom: '1px solid #d1d5db' }}>
                                        {selectedMeeting.title}
                                    </h3>
                                    <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace', marginBottom: '24px' }}>ID: {selectedMeeting.id}</div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>Date</div>
                                        <div style={{ fontSize: '15px', color: '#374151', fontWeight: 500 }}>{new Date(selectedMeeting.start_time).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>Time</div>
                                        <div style={{ fontSize: '15px', color: '#374151', fontWeight: 500 }}>
                                            {new Date(selectedMeeting.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedMeeting.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>Timezone</div>
                                        <div style={{ fontSize: '15px', color: '#374151', fontWeight: 500 }}>{selectedMeeting.timezone}</div>
                                    </div>
                                </div>
                            )}

                            <div style={{ flex: 1, borderLeft: '1px solid #e5e7eb', paddingLeft: '40px' }}>
                                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '16px' }}>Direct Email (Multiple & CSV)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                                        Send the ultra-posh HTML template securely from the HideWin server. You can enter multiple emails separated by commas, or upload a CSV file.
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <textarea 
                                                placeholder="guest1@example.com, guest2@example.com..." 
                                                value={inviteEmail} 
                                                onChange={e => setInviteEmail(e.target.value)} 
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }} 
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <input type="file" id="csv-upload" accept=".csv" style={{ display: 'none' }} onChange={handleCsvUpload} />
                                                    <label htmlFor="csv-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>
                                                        <FileText size={14} /> Upload CSV
                                                    </label>
                                                    {csvError && <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>{csvError}</span>}
                                                </div>
                                                <button onClick={handleSendCorporateInvite} disabled={isSendingInvite} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 24px', fontSize: '14px', fontWeight: 600, cursor: isSendingInvite ? 'not-allowed' : 'pointer', opacity: isSendingInvite ? 0.7 : 1 }}>
                                                    {isSendingInvite ? 'Sending...' : 'Send'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '16px' }}>Web & App Sharing</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <button style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => { copyToClipboardAndOpen(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=Invitation to HideWin Meeting: ${encodeURIComponent(selectedMeeting.title)}&body=BODY_PLACEHOLDER`, false); alert('HTML Invite Copied! Press Ctrl+V (or right-click Paste) in the Gmail message body.'); }}>
                                        <Mail size={18} color="#ea4335" />
                                        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Gmail</span>
                                    </button>
                                    <button style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => { copyToClipboardAndOpen(`https://outlook.live.com/mail/0/deeplink/compose?subject=Invitation to HideWin Meeting: ${encodeURIComponent(selectedMeeting.title)}&body=BODY_PLACEHOLDER`, false); alert('HTML Invite Copied! Press Ctrl+V (or right-click Paste) in the Outlook message body.'); }}>
                                        <Mail size={18} color="#0078d4" />
                                        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Outlook</span>
                                    </button>
                                    <button style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => { copyToClipboardAndOpen(`mailto:?subject=Invitation to HideWin Meeting: ${encodeURIComponent(selectedMeeting.title)}&body=BODY_PLACEHOLDER`, false); alert('HTML Invite Copied! Press Ctrl+V (or right-click Paste) in your mail client body.'); }}>
                                        <Mail size={18} color="#4b5563" />
                                        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>Default Mail</span>
                                    </button>
                                    <button style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => { copyToClipboardAndOpen(`https://wa.me/?text=BODY_PLACEHOLDER`, true); }}>
                                        <MessageCircle size={18} color="#25D366" />
                                        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>WhatsApp</span>
                                    </button>
                                </div>
                                
                                <div style={{ marginTop: '16px' }}>
                                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '12px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={async () => { 
                                        const htmlContent = getHtmlContent(selectedMeeting);
                                        const plainContent = getInviteText(selectedMeeting);
                                        try {
                                            const clipboardItem = new ClipboardItem({
                                                'text/plain': new Blob([plainContent], { type: 'text/plain' }),
                                                'text/html': new Blob([htmlContent], { type: 'text/html' })
                                            });
                                            await navigator.clipboard.write([clipboardItem]);
                                            alert('Ultra-Posh HTML Invite Copied! Paste it anywhere.');
                                        } catch (err) {
                                            navigator.clipboard.writeText(plainContent);
                                            alert('Invite text copied!');
                                        }
                                    }}>
                                        <LinkIcon size={18} color="#2563eb" />
                                        <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 600 }}>Copy HTML Invite to Clipboard</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
</div>
    );
}
