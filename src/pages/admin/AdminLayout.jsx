import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, School } from 'lucide-react';
// Assuming lucide-react exports Calendar as well, we'll use standard icons

const AdminLayout = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7' }}>
                <Loader2 size={40} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/events', label: 'Events Manager', icon: <Calendar size={20} /> },
        { path: '/admin/registrations', label: 'Registrations', icon: <Users size={20} /> },
        { path: '/admin/institutes', label: 'Institutes', icon: <School size={20} /> },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
            <aside className="admin-sidebar" style={{ width: '260px', background: 'var(--color-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>IGNITE <span style={{ color: 'var(--color-primary)' }}>Admin</span></h2>
                </div>
                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                    borderRadius: '8px', color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    textDecoration: 'none', fontWeight: isActive ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ padding: '2rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            <main className="admin-main" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet context={[session]} />
            </main>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                `
            }} />
        </div>
    );
};

export default AdminLayout;
