import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventBySlug, registerStudent, createPayment, getInstitutes } from '../lib/api';
import { ChevronLeft, ShieldCheck, CreditCard, School, User, Phone, Mail, QrCode, CheckCircle2, Clipboard, PhoneCall } from 'lucide-react';

const Registration = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const selectedBatchName = queryParams.get('batch') || 'Starter';

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [institutes, setInstitutes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1 = Details, 2 = UPI Payment
    const [copied, setCopied] = useState(false);

    // Success State
    const [showSuccess, setShowSuccess] = useState(false);
    const [regId, setRegId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        instituteCode: '',
        studentClass: '',
        transactionId: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        getEventBySlug(id).then(data => {
            setEvent(data);
            return getInstitutes();
        }).then(insts => {
            setInstitutes(insts);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    const batch = event?.batches?.find(b => b.name === selectedBatchName) || event?.batches?.[0];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCopyUpi = () => {
        navigator.clipboard.writeText("mediagenytechsolutions@pthdfc");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        // Validation
        if (!formData.name || !formData.phone || !formData.email || !formData.instituteCode) {
            alert('Please fill out all required fields.');
            return;
        }
        if (formData.instituteCode !== 'none' && !formData.studentClass) {
            alert('Please select your class.');
            return;
        }
        setStep(2);
    };

    const handleSubmitRegistration = async (e) => {
        e.preventDefault();
        if (!formData.transactionId) {
            alert('Payment reference number (UPI Transaction ID) is required.');
            return;
        }

        setSubmitting(true);
        try {
            const studentData = {
                full_name: formData.name,
                phone: formData.phone,
                email: formData.email,
                institute_code: formData.instituteCode
            };
            const registrationData = {
                event_id: event.id,
                batch_id: batch.id,
                status: 'pending',
                payment_status: 'pending'
            };

            // 1. Insert student & registration
            const res = await registerStudent(studentData, registrationData);
            const registrationId = res.registration_id;

            const baseAmt = parseFloat(batch.price);
            const totalPayable = isNaN(baseAmt) ? 0 : baseAmt + Math.round(baseAmt * 0.18);

            // 2. Insert payment details
            await createPayment({
                registration_id: registrationId,
                transaction_id: formData.transactionId,
                amount: totalPayable || 0,
                status: 'pending'
            });

            // 3. Show Success Screen
            setRegId(registrationId);
            setShowSuccess(true);
        } catch (err) {
            console.error("Registration error:", err);
            alert("Registration failed: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '120px', minHeight: '100vh' }}>Loading registration form...</div>;
    if (!event || !batch) return <div className="container" style={{ paddingTop: '120px', minHeight: '100vh' }}>Invalid registration details</div>;

    return (
        <div className="registration-page">
            <div className="container">
                {step === 2 && !showSuccess && (
                    <button onClick={() => setStep(1)} className="back-link">
                        <ChevronLeft size={20} /> Back to Edit Details
                    </button>
                )}
                {step === 1 && !showSuccess && (
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ChevronLeft size={20} /> Back to Selection
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {!showSuccess ? (
                        <div className="registration-grid">
                            {/* Left Column: Form Steps */}
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                                className="registration-form-container"
                            >
                                {step === 1 ? (
                                    <>
                                        <h2>Complete Your Registration</h2>
                                        <p className="subtitle">Secure your spot in the {event.title}</p>

                                        <form onSubmit={handleProceedToPayment} className="reg-form">
                                            <div className="form-group">
                                                <label><User size={16} /> Full Name <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label><Phone size={16} /> Phone Number <span className="req">*</span></label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        placeholder="+91 98765 43210"
                                                        required
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label><Mail size={16} /> Email Address <span className="req">*</span></label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="john@example.com"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label><School size={16} /> Select Institute / School <span className="req">*</span></label>
                                                <select
                                                    name="instituteCode"
                                                    value={formData.instituteCode}
                                                    onChange={handleChange}
                                                    required
                                                    className="styled-select"
                                                >
                                                    <option value="" disabled>Select your institute</option>
                                                    <option value="none">None / Other / Not Listed</option>
                                                    {institutes.map(inst => (
                                                        <option key={inst.code} value={inst.code}>{inst.name} ({inst.code})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {formData.instituteCode && formData.instituteCode !== 'none' && (
                                                <div className="form-group">
                                                    <label><User size={16} /> Class of the Student <span className="req">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="studentClass"
                                                        placeholder="E.g. Class 10"
                                                        value={formData.studentClass}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <button type="submit" className="btn btn-primary proceed-btn">
                                                Proceed to Pay <CreditCard size={18} />
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <h2>Scan & Complete Payment</h2>
                                        <p className="subtitle">Please scan the UPI QR code below with any payments app</p>

                                        <div className="upi-payment-details">
                                            <div className="qr-container">
                                                <img src="/upi-qr.jpg" alt="UPI Payment QR Code" className="qr-code-img" />
                                                <div className="upi-id-field">
                                                    <span className="label">UPI ID:</span>
                                                    <span className="value">mediagenytechsolutions@pthdfc</span>
                                                    <button onClick={handleCopyUpi} className="btn-copy">
                                                        {copied ? "Copied!" : <Clipboard size={14} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmitRegistration} className="reg-form" style={{ marginTop: '2rem' }}>
                                                <div className="form-group">
                                                    <label style={{ color: 'var(--color-primary)' }}>
                                                        <ShieldCheck size={18} /> UPI Reference No / Payment UID <span className="req">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="transactionId"
                                                        placeholder="Enter 12-digit UPI Ref / Transaction ID"
                                                        required
                                                        value={formData.transactionId}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="input-helper-text">
                                                        Find this in your payment receipt from GPay, Paytm, PhonePe, etc.
                                                    </span>
                                                </div>

                                                <button type="submit" className="btn btn-primary proceed-btn" disabled={submitting}>
                                                    {submitting ? 'Verifying Reference...' : 'Acknowledge & Submit Registration'}
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </motion.div>

                            {/* Right Column: Summary Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="order-summary"
                            >
                                <div className="summary-card">
                                    <h3>Order Summary</h3>
                                    <div className="summary-item">
                                        <span className="label">Event</span>
                                        <span className="value">{event.title}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Training Batch</span>
                                        <span className="value badge">{batch.name}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">Level</span>
                                        <span className="value">{batch.level}</span>
                                    </div>
                                    {batch.price !== 'Free' && (
                                        <div className="summary-item">
                                            <span className="label">Taxes & Charges (18%)</span>
                                            <span className="value" style={{ color: '#888' }}>+ ₹{Math.round(parseFloat(batch.price) * 0.18)}</span>
                                        </div>
                                    )}
                                    <hr />
                                    <div className="total-row">
                                        <span>Total Amount</span>
                                        <span className="price">
                                            {batch.price === 'Free' ? 'Free' : `₹${parseFloat(batch.price) + Math.round(parseFloat(batch.price) * 0.18)}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="support-sidebar-box mt-4">
                                    <h4 className="support-title"><PhoneCall size={16} /> Need Help?</h4>
                                    <p className="support-desc">For any queries regarding the registration or camp details, please contact us.</p>
                                    <a href="tel:7896094895" className="support-primary-phone">+91 7896094895</a>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Success Overlay Screen */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="registration-success-overlay"
                        >
                            <div className="success-card">
                                <div className="success-header">
                                    <CheckCircle2 size={64} className="success-icon" />
                                    <h2>Registration Request Received</h2>
                                    <p className="success-subtitle">We have logged your transaction details for verification</p>
                                </div>

                                <div className="registration-details-box">
                                    <div className="detail-item">
                                        <span className="label">Registration ID</span>
                                        <span className="value code-val">IGN-{regId.replace(/-/g, '').slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Student Name</span>
                                        <span className="value">{formData.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Selected Batch</span>
                                        <span className="value">{batch.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Provided Transaction ID</span>
                                        <span className="value code-val text-primary">{formData.transactionId}</span>
                                    </div>
                                </div>

                                <div className="notice-box">
                                    <p className="status-notice">
                                        Our agent will call you shortly to confirm your batch allocation after completing transaction audit.
                                    </p>
                                </div>

                                <div className="support-box">
                                    <h3>Need assistance? Call support:</h3>
                                    <div className="support-numbers">
                                        <a href="tel:7896094895" className="phone-link"><PhoneCall size={14} /> +91-7896094895</a>
                                        <a href="tel:8794525402" className="phone-link"><PhoneCall size={14} /> +91-8794525402</a>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/')} className="btn btn-primary home-btn">
                                    Back to Home
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .registration-page { padding: 120px 0 60px; min-height: 100vh; background: var(--color-beige-light); }
        
        .back-link {
          background: none; border: none; font-weight: 600; color: #666;
          display: flex; align-items: center; gap: 5px; cursor: pointer; margin-bottom: 2rem;
        }

        .registration-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; }

        .registration-form-container h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--color-navy); }
        .subtitle { color: #666; margin-bottom: 2.5rem; }

        .reg-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; color: var(--color-navy); }
        .form-group label .req { color: var(--color-primary); }
        .form-group input, .styled-select {
          background: white; border: 1px solid var(--color-gray); padding: 12px 16px;
          border-radius: 8px; font-family: inherit; font-size: 1rem; transition: border-color 0.2s;
          width: 100%;
        }
        .form-group input:focus, .styled-select:focus { border-color: var(--color-primary); outline: none; }
        .input-helper-text { font-size: 0.75rem; color: #777; margin-top: -4px; }

        .proceed-btn { width: 100%; padding: 1rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 1rem; }
        .security-note { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.8rem; color: #888; margin-top: 1rem; }

        /* UPI Payment Stage */
        .upi-payment-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gray);
          box-shadow: var(--shadow-subtle);
        }
        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .qr-code-img {
          width: 260px;
          height: auto;
          border: 4px solid var(--color-navy);
          border-radius: var(--radius-sm);
          padding: 8px;
          background: white;
        }
        .upi-id-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-beige-light);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--color-gray);
          font-size: 0.9rem;
        }
        .upi-id-field .label { color: #555; }
        .upi-id-field .value { font-weight: 700; color: var(--color-navy); }
        .btn-copy {
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        /* Order Summary Styling */
        .summary-card { background: white; padding: 2rem; border-radius: var(--radius-md); border: 1px solid var(--color-gray); box-shadow: var(--shadow-subtle); position: sticky; top: 120px; }
        .summary-card h3 { font-size: 1.4rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
        
        .summary-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .summary-item .label { color: #777; font-size: 0.9rem; }
        .summary-item .value { font-weight: 600; color: var(--color-navy); }
        .summary-item .value.badge { background: var(--color-primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

        .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; font-size: 1.25rem; font-weight: 800; }
        .total-row .price { color: var(--color-primary); font-size: 1.5rem; }

        .support-sidebar-box { margin-top: 1.5rem; background: #fdfbf7; border: 1px solid #e8e6e1; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03); text-align: center; }
        .support-title { display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--color-navy); font-size: 1.1rem; margin-bottom: 0.5rem; }
        .support-desc { font-size: 0.85rem; color: #666; margin-bottom: 1rem; line-height: 1.4; }
        .support-primary-phone { display: inline-block; font-size: 1.25rem; font-weight: 800; color: var(--color-primary); text-decoration: none; background: white; padding: 8px 16px; border-radius: 50px; border: 2px solid #f0eeea; transition: all 0.2s; }
        .support-primary-phone:hover { transform: scale(1.05); color: #1a2a4a; }

        /* Success screen styles */
        .registration-success-overlay {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 2rem 0;
        }
        .success-card {
          background: white;
          border: 1px solid var(--color-gray);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-subtle);
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .success-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .success-icon {
          color: #10B981;
        }
        .success-card h2 {
          font-size: 2rem;
          color: var(--color-navy);
          margin: 0;
        }
        .success-subtitle {
          color: #666;
          margin: 0;
        }
        .registration-details-box {
          background: var(--color-beige-light);
          border: 1px solid var(--color-gray);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 1.5rem;
          text-align: left;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #ddd;
          padding-bottom: 8px;
          font-size: 0.95rem;
        }
        .detail-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .detail-item .label {
          color: #666;
        }
        .detail-item .value {
          font-weight: 600;
          color: var(--color-navy);
        }
        .detail-item .code-val {
          font-family: monospace;
          background: #eee;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85rem;
        }
        .text-primary {
          color: var(--color-primary) !important;
        }
        .notice-box {
          background: #eef2ff;
          border-left: 4px solid var(--color-secondary);
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 2rem;
          text-align: left;
        }
        .status-notice {
          margin: 0;
          font-size: 0.95rem;
          color: #312e81;
          line-height: 1.5;
        }
        .support-box {
          border-top: 1px solid #eee;
          padding-top: 1.5rem;
          margin-bottom: 2rem;
        }
        .support-box h3 {
          font-size: 1.05rem;
          color: var(--color-navy);
          margin-bottom: 1rem;
        }
        .support-numbers {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .phone-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-primary);
          font-weight: 700;
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid var(--color-gray);
          border-radius: 20px;
          background: white;
          transition: background-color 0.2s;
        }
        .phone-link:hover {
          background: var(--color-beige-light);
        }
        .home-btn {
          width: 200px;
          margin: 0 auto;
        }

        @media (max-width: 968px) {
          .registration-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .order-summary { order: -1; }
        }
      `}} />
        </div>
    );
};

export default Registration;
