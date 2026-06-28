import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Loader2, School } from 'lucide-react';

const InstitutesManager = () => {
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // New institute form state
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const fetchInstitutes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('institutes')
            .select('*')
            .order('name', { ascending: true });

        if (!error && data) {
            setInstitutes(data);
        }
        setLoading(false);
    };

    const handleAddInstitute = async (e) => {
        e.preventDefault();
        if (!newCode || !newName) return;

        setSaving(true);
        const { data, error } = await supabase
            .from('institutes')
            .insert([{ code: newCode.toUpperCase().trim(), name: newName.trim() }])
            .select();

        if (error) {
            alert('Failed to add institute: ' + error.message);
        } else {
            setNewCode('');
            setNewName('');
            fetchInstitutes();
        }
        setSaving(false);
    };

    const handleDeleteInstitute = async (code) => {
        if (!window.confirm(`Are you sure you want to delete institute ${code}?`)) return;

        const { error } = await supabase
            .from('institutes')
            .delete()
            .eq('code', code);

        if (error) {
            alert('Failed to delete institute: ' + error.message);
        } else {
            fetchInstitutes();
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className="institutes-manager">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <School size={28} /> Manage Institutes
                </h1>
            </div>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Add New Institute</h3>
                <form onSubmit={handleAddInstitute} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Institute Code</label>
                        <input
                            type="text"
                            placeholder="e.g. KV-GHY"
                            value={newCode}
                            onChange={e => setNewCode(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                        />
                    </div>
                    <div style={{ flex: '2', minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Institute Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Kendriya Vidyalaya Guwahati"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '10.5px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
                    >
                        {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                        Add Institute
                    </button>
                </form>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#555' }}>Code</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#555' }}>Institute Name</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#555', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {institutes.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                    No institutes added yet. Add one above.
                                </td>
                            </tr>
                        ) : (
                            institutes.map(inst => (
                                <tr key={inst.code} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-primary)' }}>{inst.code}</td>
                                    <td style={{ padding: '1rem' }}>{inst.name}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDeleteInstitute(inst.code)}
                                            title="Delete Institute"
                                            style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '5px' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                `
            }} />
        </div>
    );
};

export default InstitutesManager;
