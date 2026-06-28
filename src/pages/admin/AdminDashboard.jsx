import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Calendar as CalendarIcon, CreditCard, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalStudents: 0,
        totalRegistrations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [eventsReq, studentsReq, regsReq] = await Promise.all([
                supabase.from('events').select('*', { count: 'exact', head: true }),
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('registrations').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                totalEvents: eventsReq.count || 0,
                totalStudents: studentsReq.count || 0,
                totalRegistrations: regsReq.count || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Active Events', value: stats.totalEvents, icon: <CalendarIcon size={24} />, color: '#4CAF50' },
        { label: 'Total Students', value: stats.totalStudents, icon: <Users size={24} />, color: '#2196F3' },
        { label: 'Total Registrations', value: stats.totalRegistrations, icon: <Activity size={24} />, color: '#FF9800' },
        { label: 'Revenue (Estimates)', value: '₹--', icon: <CreditCard size={24} />, color: '#9C27B0' },
    ];

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard metrics...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--color-navy)' }}>Overview Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ background: `${stat.color}20`, color: stat.color, width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '600' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', margin: 0 }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>Recent Registrations (Coming Soon)</h2>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #eee', borderRadius: '8px', color: '#999' }}>
                    Registration Data Table Placeholder
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
