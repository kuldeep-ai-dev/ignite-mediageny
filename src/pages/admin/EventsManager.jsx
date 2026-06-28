import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const EventsManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data } = await supabase.from('events').select('*, batches(*)').order('created_at', { ascending: false });
        if (data) setEvents(data);
        setLoading(false);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('events').update({
            title: editingEvent.title,
            type: editingEvent.type,
            price: editingEvent.price,
            is_active: editingEvent.is_active
        }).eq('id', editingEvent.id);

        setIsSaving(false);
        if (error) {
            alert('Failed to update event: ' + error.message);
        } else {
            setEditingEvent(null);
            fetchEvents();
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading events...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)' }}>Events Manager</h1>
                <button className="btn btn-primary" onClick={() => alert('New Event creation form coming soon!')}>+ Create New Event</button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Event Title</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Batches Configured</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{event.title}</td>
                                <td style={{ padding: '1rem' }}><span style={{ background: 'var(--color-beige)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--color-navy)' }}>{event.type}</span></td>
                                <td style={{ padding: '1rem' }}>{event.price}</td>
                                <td style={{ padding: '1rem' }}>{event.batches?.length || 0} Batches</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: event.is_active ? '#4CAF50' : '#FF9800', fontWeight: '600', fontSize: '0.9rem' }}>
                                        {event.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        onClick={() => setEditingEvent(event)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No events found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingEvent && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-navy)', fontSize: '1.5rem' }}>Edit Event</h2>
                        <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-navy)' }}>Event Title</label>
                                <input required type="text" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-navy)' }}>Type (e.g. Workshops, Webinars)</label>
                                <input required type="text" value={editingEvent.type} onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-navy)' }}>Price Display (e.g. ₹2999 or Free)</label>
                                <input required type="text" value={editingEvent.price} onChange={e => setEditingEvent({ ...editingEvent, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-navy)' }}>
                                <input type="checkbox" checked={editingEvent.is_active} onChange={e => setEditingEvent({ ...editingEvent, is_active: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                Event is Active (Publicly visible)
                            </label>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setEditingEvent(null)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                                <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ flex: 1, padding: '12px', background: '#4CAF50', border: 'none', color: 'white' }}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsManager;
