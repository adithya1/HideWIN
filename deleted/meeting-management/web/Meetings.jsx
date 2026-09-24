import { API_BASE } from '../config.js';
import React, { useState, useEffect } from 'react';

import { Calendar, Plus, Clock, Edit2, Trash2, MonitorPlay, Users } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;
    
    const [isScheduling, setIsScheduling] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
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
            const res = await fetch(`${API_BASE}/user/meetings/${selectedMeeting.id}`, {
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
                setSelectedMeeting({...selectedMeeting, title: editForm.title, start_time: startStr, end_time: endStr, timezone: editForm.timezone});
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
            const res = await fetch(API_BASE + '/user/meetings', {
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
            
            const res = await fetch(API_BASE + '/user/meetings', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: form.title || 'Untitled Meeting',
                    start_time: start_time.toISOString(),
                    end_time: end_time.toISOString(),
                    timezone: form.timezone
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

                        </div>
                    </div>
                </div>
            )}
</div>
    );
}
