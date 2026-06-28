import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, User, Phone, Mail, Award, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');
    const regId = searchParams.get('regId');
    const orderId = searchParams.get('orderId');
    const msg = searchParams.get('msg') || '';

    const [loading, setLoading] = useState(true);
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (regId) {
            supabase
                .from('registrations')
                .select('*, students(*), events(*), batches(*)')
                .eq('id', regId)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setRegistration(data);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [regId]);

    const isSuccess = status === 'paid';

    if (loading) {
        return (
            <div className="payment-status-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <RefreshCw size={40} className="spinner" />
                </motion.div>
                <p>Verifying transaction payment status...</p>
            </div>
        );
    }

    return (
        <div className="payment-status-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="status-card-wrapper"
                >
                    <div className={`status-banner ${isSuccess ? 'success' : 'failure'}`}>
                        {isSuccess ? (
                            <CheckCircle size={64} className="icon-glow" />
                        ) : (
                            <XCircle size={64} className="icon-glow" />
                        )}
                        <h2>{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</h2>
                        <p className="order-ref">Order Ref: {orderId || 'N/A'}</p>
                    </div>

                    <div className="status-content">
                        {isSuccess ? (
                            <div className="success-message">
                                <h3>Welcome to Ignite Robotics!</h3>
                                <p>Provide details below at the venue when you attend. A confirmation email has been queued.</p>
                            </div>
                        ) : (
                            <div className="failure-message col-full">
                                <h3>Reason for decline:</h3>
                                <p className="decline-reason">{msg || 'Transaction cancelled or declined by banks/Paytm.'}</p>
                                <button onClick={() => navigate(-1)} className="btn btn-secondary retry-btn">
                                    Try Again
                                </button>
                            </div>
                        )}

                        {registration && (
                            <div className="receipt-details">
                                <div className="receipt-header">
                                    <h4>Registration Receipt</h4>
                                </div>
                                <div className="receipt-body">
                                    <div className="receipt-row">
                                        <span className="label">Student Name:</span>
                                        <span className="value">{registration.students?.full_name}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="label">Contact Info:</span>
                                        <span className="value">{registration.students?.phone} | {registration.students?.email}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="label">Registered Event:</span>
                                        <span className="value">{registration.events?.title}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="label">Selected Track:</span>
                                        <span className="value-badge">{registration.batches?.name}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="label">Registration Status:</span>
                                        <span className="status-indicator confirmed">{registration.status}</span>
                                    </div>
                                    <hr />
                                    <div className="receipt-row total-row">
                                        <span className="label">Amount Paid:</span>
                                        <span className="price">₹{registration.batches?.price}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="status-actions">
                        <button onClick={() => navigate('/')} className="btn btn-primary home-btn">
                            Return Home <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .payment-status-page {
                    padding: 140px 0 80px;
                    min-height: 100vh;
                    background: var(--color-beige-light);
                }
                .payment-status-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: var(--color-beige-light);
                    gap: 1.5rem;
                }
                .spinner {
                    color: var(--color-primary);
                }
                .status-card-wrapper {
                    background: white;
                    max-width: 650px;
                    margin: 0 auto;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-subtle);
                    overflow: hidden;
                    border: 1px solid var(--color-gray);
                }
                .status-banner {
                    padding: 3rem 2rem;
                    text-align: center;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                }
                .status-banner.success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }
                .status-banner.failure {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                }
                .icon-glow {
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
                }
                .status-banner h2 {
                    font-size: 2.25rem;
                    margin: 0;
                    font-weight: 800;
                }
                .order-ref {
                    font-size: 0.9rem;
                    opacity: 0.85;
                    font-family: monospace;
                    margin: 0;
                }
                .status-content {
                    padding: 2.5rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .success-message h3 {
                    font-size: 1.25rem;
                    color: var(--color-navy);
                    margin-bottom: 0.5rem;
                }
                .success-message p {
                    color: #555;
                    line-height: 1.6;
                }
                .failure-message h3 {
                    font-size: 1.25rem;
                    color: var(--color-navy);
                    margin-bottom: 0.5rem;
                }
                .decline-reason {
                    color: #ef4444;
                    background: #fef2f2;
                    border: 1px solid #fee2e2;
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }
                .retry-btn {
                    padding: 0.75rem 1.5rem;
                }
                .receipt-details {
                    background: #f9fafb;
                    border: 1px solid var(--color-gray);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .receipt-header {
                    background: var(--color-navy);
                    color: white;
                    padding: 0.75rem 1.25rem;
                }
                .receipt-header h4 {
                    margin: 0;
                    font-size: 1rem;
                    letter-spacing: 0.5px;
                }
                .receipt-body {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .receipt-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.95rem;
                }
                .receipt-row .label {
                    color: #666;
                }
                .receipt-row .value {
                    font-weight: 600;
                    color: var(--color-navy);
                }
                .receipt-row .value-badge {
                    background: var(--color-primary);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .status-indicator.confirmed {
                    color: #059669;
                    background: #ecfdf5;
                    padding: 2px 10px;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    text-transform: capitalize;
                    font-weight: 600;
                }
                .receipt-row.total-row {
                    font-size: 1.15rem;
                    font-weight: 800;
                    align-items: center;
                }
                .receipt-row.total-row .price {
                    color: var(--color-primary);
                    font-size: 1.35rem;
                }
                .status-actions {
                    padding: 0 2rem 2.5rem;
                    display: flex;
                    justify-content: center;
                }
                .home-btn {
                    width: 100%;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 1.1rem;
                }
                `
            }} />
        </div>
    );
};

export default PaymentStatus;
