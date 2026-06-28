import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, ShieldAlert, BadgeCheck } from 'lucide-react';

const RegistrationsManager = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        const { data, error } = await supabase
            .from('registrations')
            .select(`
                *,
                students(*),
                events(*),
                batches(*),
                payments(*)
            `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching registrations:", error);
        } else {
            setRegistrations(data || []);
        }
        setLoading(false);
    };

    const handleVerifyStatus = async (regId, paymentId, isApproved) => {
        const actionText = isApproved ? 'APPROVE' : 'DECLINE';
        if (!confirm(`Are you sure you want to ${actionText} this registration?`)) return;

        try {
            const nextStatus = isApproved ? 'confirmed' : 'declined';
            const nextPayStatus = isApproved ? 'paid' : 'failed';

            // 1. Update registration row
            const { error: regErr } = await supabase
                .from('registrations')
                .update({
                    status: nextStatus,
                    payment_status: nextPayStatus
                })
                .eq('id', regId);

            if (regErr) throw regErr;

            // 2. Update payment row if present
            if (paymentId) {
                const { error: payErr } = await supabase
                    .from('payments')
                    .update({
                        status: nextPayStatus
                    })
                    .eq('id', paymentId);
                if (payErr) throw payErr;
            }

            fetchRegistrations(); // refetch data
        } catch (err) {
            console.error("Verification error:", err);
            alert("Error running update: " + err.message);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading registrations...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--color-navy)' }}>Student Registrations</h1>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1rem' }}>Student Name</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Email / Phone</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Event Enrolled</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Batch</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Payment UID (UPI Ref)</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                            <th style={{ padding: '1.25rem 1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map(reg => {
                            const paymentRecord = reg.payments?.[0];
                            const isPending = reg.payment_status === 'pending';
                            const isPaid = reg.payment_status === 'paid';
                            const isFailed = reg.payment_status === 'failed';

                            return (
                                <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--color-navy)' }}>{reg.students?.full_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {reg.students?.student_id}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#555' }}>
                                        <div>{reg.students?.email}</div>
                                        <div>{reg.students?.phone}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: '500' }}>{reg.events?.title}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{reg.batches?.name || 'Standard'}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        {paymentRecord ? (
                                            <span style={{ fontFamily: 'monospace', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                {paymentRecord.transaction_id}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#888', fontStyle: 'italic' }}>No payment record</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{
                                            background: isPaid ? '#e8f5e9' : isFailed ? '#ffebee' : '#fff3e0',
                                            color: isPaid ? '#2e7d32' : isFailed ? '#c62828' : '#e65100',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600',
                                            textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center'
                                        }}>
                                            {reg.payment_status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        {isPending ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleVerifyStatus(reg.id, paymentRecord?.id, true)}
                                                    title="Approve / Mark Paid"
                                                    style={{
                                                        background: '#4CAF50', border: 'none', color: 'white',
                                                        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <Check size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyStatus(reg.id, paymentRecord?.id, false)}
                                                    title="Decline / Reject Reference"
                                                    style={{
                                                        background: '#f44336', border: 'none', color: 'white',
                                                        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <X size={14} /> Decline
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#666', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {isPaid ? (
                                                    <BadgeCheck size={16} style={{ color: '#4CAF50' }} />
                                                ) : (
                                                    <ShieldAlert size={16} style={{ color: '#f44336' }} />
                                                )}
                                                Verified & {reg.status}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {registrations.length === 0 && (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No registrations found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegistrationsManager;

