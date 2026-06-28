import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventBySlug } from '../lib/api';
import { CheckCircle, Clock, Package, HelpCircle, ChevronLeft, Shield, Star, ArrowRight, Zap, MapPin, Users, CalendarDays } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getEventBySlug(id).then(data => {
      setEvent(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#666' }}>
      Loading event details...
    </div>
  );
  if (!event) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      Event not found.
    </div>
  );

  const isFeatured = event.slug === 'summer-robotics-2026';

  return (
    <div className="event-details-page">

      {/* Hero Banner */}
      <section className="event-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <ChevronLeft size={18} /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-grid"
          >
            {/* Text Side */}
            <div className="hero-text">
              <div className="hero-top-badges">
                <span className="event-type-pill">{event.type}</span>
                {isFeatured && (
                  <span className="featured-pill">
                    <Star size={13} fill="currentColor" /> Featured Camp
                  </span>
                )}
              </div>

              <h1>{event.title}</h1>
              <p className="hero-desc">{event.description}</p>

              <div className="hero-meta">
                <div className="meta-chip">
                  <Clock size={15} /> {event.duration}
                </div>
                <div className="meta-chip">
                  <CheckCircle size={15} /> Certificate
                </div>
                <div className="meta-chip price-chip">
                  {event.price}
                </div>
              </div>

              {isFeatured && (
                <div className="refund-banner">
                  <div className="refund-icon"><Shield size={22} /></div>
                  <div>
                    <strong>100% Refund Guarantee</strong>
                    <p>No skill learned? You get your full money back.</p>
                  </div>
                </div>
              )}

              <div className="hero-cta">
                <button
                  className="btn-register"
                  onClick={() => {
                    if (event.batches && event.batches.length === 1) {
                      navigate(`/register/${event.slug}?batch=${event.batches[0].name}`);
                    } else {
                      document.getElementById('batches').scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Register Now <ArrowRight size={18} />
                </button>
                {event.batches && event.batches.length > 1 && (
                  <span className="seats-note">↓ Choose your batch below</span>
                )}
              </div>
            </div>

            {/* Image Side */}
            <div className="hero-img-wrap">
              <img src={event.image} alt={event.title} className="hero-img" />
              {isFeatured && (
                <div className="img-badge">
                  <Zap size={14} fill="currentColor" /> Summer 2026
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="details-content container">
        <div className="details-grid">
          <div className="main-content">

            {/* Camp Highlights Strip */}
            {isFeatured && (
              <div className="highlights-strip">
                <div className="highlight-chip">
                  <span className="hc-icon">📅</span>
                  <div><strong>2 Weeks</strong><span>14 Full Days</span></div>
                </div>
                <div className="highlight-chip">
                  <span className="hc-icon">🎒</span>
                  <div><strong>Kit Included</strong><span>Take-home hardware</span></div>
                </div>
                <div className="highlight-chip">
                  <span className="hc-icon">👦</span>
                  <div><strong>Ages 10–18</strong><span>All skill levels</span></div>
                </div>
                <div className="highlight-chip">
                  <span className="hc-icon">🏆</span>
                  <div><strong>Certificate</strong><span>+ Refund Guarantee</span></div>
                </div>
              </div>
            )}

            {/* Batch Selection */}
            {event.batches && (
              <div id="batches" className="batches-section">
                <div className="section-label"><CheckCircle size={18} /> Choose Your Training Track</div>
                <div className="batches-grid">
                  {event.batches.map((batch, i) => (
                    <div key={i} className={`batch-card ${batch.name.toLowerCase()}`}>
                      <div className="batch-level-tag">{batch.level}</div>
                      <h4>{batch.name} Batch</h4>
                      <div className="batch-price">₹{batch.price}</div>
                      <p className="batch-focus"><strong>Focus:</strong> {batch.focus}</p>
                      <div className="capstone-box">
                        <small>Capstone Project</small>
                        <p>{batch.capstone}</p>
                      </div>
                      <Link to={`/register/${event.slug}?batch=${batch.name}`} className="btn-select-batch">
                        Select {batch.name} Track <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Syllabus / Timeline */}
            {event.syllabus && (
              <div className="syllabus">
                <div className="section-label"><Clock size={18} /> Course Syllabus & Timeline</div>
                {typeof event.syllabus[0] === 'object' ? (
                  <div className="timeline">
                    {event.syllabus.map((item, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-left">
                          <div className="timeline-day">{item.day}</div>
                          {i < event.syllabus.length - 1 && <div className="timeline-line" />}
                        </div>
                        <div className="timeline-body">
                          <h4 className="timeline-title">{item.title}</h4>
                          <ul className="topic-list">
                            {item.topics.map((t, ti) => (
                              <li key={ti}><span className="topic-dot" />{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="syllabus-list">
                    {event.syllabus.map((item, i) => (
                      <li key={i}>
                        <div className="bullet">{i + 1}</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="sidebar">

            {/* Kit Box */}
            {event.kits && (
              <div className="sidebar-card kit-box">
                <div className="sidebar-card-header">
                  <Package size={18} />
                  Hardware Kit Inclusions
                </div>
                <ul className="kit-list">
                  {event.kits.map((kit, i) => (
                    <li key={i}>
                      <CheckCircle size={14} className="kit-check" />
                      {kit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQ Box */}
            {event.faq && (
              <div className="sidebar-card faq-box">
                <div className="sidebar-card-header">
                  <HelpCircle size={18} />
                  Common Questions
                </div>
                {event.faq.map((item, i) => (
                  <div key={i} className="faq-item">
                    <strong>{item.q}</strong>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Refund Policy Card (sidebar) */}
            {isFeatured && (
              <div className="sidebar-card refund-card">
                <Shield size={32} />
                <h4>Refund Policy</h4>
                <p>If you don't learn a single new skill during the camp, we will refund 100% of your paid amount — no questions asked.</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .event-details-page { padding-top: 80px; }

        /* ── Hero ── */
        .event-hero {
          background: linear-gradient(160deg, #f8f9ff 0%, #eef1f8 100%);
          padding: 64px 0 72px;
          border-bottom: 1px solid #e8eaf0;
        }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #888; font-weight: 600; font-size: 0.9rem;
          margin-bottom: 2.5rem;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--color-primary); }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-top-badges {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 1rem;
        }

        .event-type-pill {
          background: var(--color-primary);
          color: white;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .featured-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #FF6B35, #FF9800);
          color: white; padding: 5px 14px;
          border-radius: 100px; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.04em;
        }

        .hero-text h1 {
          font-size: 2.8rem;
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
        }

        .hero-desc {
          font-size: 1.05rem;
          color: #556;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .hero-meta {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: 1.75rem;
        }

        .meta-chip {
          display: inline-flex; align-items: center; gap: 7px;
          background: white;
          border: 1px solid #dde1ef;
          padding: 7px 14px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .price-chip {
          background: var(--color-primary);
          color: white;
          border-color: transparent;
        }

        /* Refund Banner */
        .refund-banner {
          display: flex; align-items: flex-start; gap: 14px;
          background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
          border: 1.5px solid #81C784;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 2rem;
          color: #1b5e20;
        }
        .refund-icon {
          background: #4CAF50;
          color: white;
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .refund-banner strong { font-size: 1rem; display: block; margin-bottom: 3px; }
        .refund-banner p { margin: 0; font-size: 0.88rem; color: #2e7d32; }

        /* CTA */
        .hero-cta { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }

        .btn-register {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--color-primary);
          color: white;
          padding: 15px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(10,17,40,0.25);
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }
        .btn-register:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(10,17,40,0.35); }

        .seats-note { font-size: 0.85rem; color: #888; font-weight: 500; }

        /* Hero Image */
        .hero-img-wrap {
          position: relative;
        }
        .hero-img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          display: block;
        }
        .img-badge {
          position: absolute;
          top: 16px; left: 16px;
          background: rgba(10,17,40,0.8);
          backdrop-filter: blur(8px);
          color: white; padding: 8px 14px;
          border-radius: 100px;
          font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; gap: 6px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* ── Details Grid ── */
        .details-content { padding: 4rem 0 6rem; }
        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* Section label */
        .section-label {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        /* Batches */
        .batches-section { margin-bottom: 3.5rem; }
        .batches-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .batch-card {
          padding: 2rem;
          border-radius: 16px;
          background: white;
          border: 1px solid #e8eaf0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .batch-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: var(--color-primary); }
        .batch-card.starter { border-top: 4px solid #4CAF50; }
        .batch-card.advanced { border-top: 4px solid #FF9800; }

        .batch-level-tag {
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.08em; color: #888; margin-bottom: 0.6rem;
        }
        .batch-card h4 { font-size: 1.5rem; margin-bottom: 0.25rem; }
        .batch-price { font-size: 2rem; font-weight: 900; color: var(--color-primary); margin-bottom: 0.75rem; letter-spacing: -0.04em; }
        .batch-focus { font-size: 0.9rem; color: #666; margin-bottom: 1.25rem; min-height: 2.5rem; }

        .capstone-box {
          background: #f8f9ff;
          border: 1px dashed #c0c8e8;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 1.5rem;
        }
        .capstone-box small { text-transform: uppercase; font-size: 0.6rem; font-weight: 800; color: #888; display: block; margin-bottom: 4px; }
        .capstone-box p { font-size: 0.9rem; font-weight: 600; color: var(--color-primary); margin: 0; }

        .btn-select-batch {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%;
          background: var(--color-primary);
          color: white;
          padding: 13px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(10,17,40,0.2);
        }
        .btn-select-batch:hover { background: #1a2a4a; transform: translateY(-1px); }


        /* Camp Highlights Strip */
        .highlights-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .highlight-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .hc-icon { font-size: 1.6rem; }
        .highlight-chip div { display: flex; flex-direction: column; }
        .highlight-chip strong { font-size: 0.9rem; color: var(--color-navy); line-height: 1.2; }
        .highlight-chip span { font-size: 0.75rem; color: #888; }

        /* Syllabus / Timeline */
        .syllabus { margin-bottom: 3rem; }
        .syllabus-list { list-style: none; }
        .syllabus-list li {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #eef0f5;
          font-size: 0.95rem;
          color: #444;
        }
        .bullet {
          background: var(--color-primary);
          color: white;
          width: 26px; height: 26px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.75rem;
          flex-shrink: 0;
        }

        /* Timeline */
        .timeline { display: flex; flex-direction: column; gap: 0; }
        .timeline-item {
          display: grid;
          grid-template-columns: 88px 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        .timeline-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 4px;
        }
        .timeline-day {
          background: var(--color-primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          text-align: center;
          padding: 6px 10px;
          border-radius: 8px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          width: 80px;
        }
        .timeline-line {
          width: 2px;
          flex-grow: 1;
          min-height: 24px;
          background: linear-gradient(to bottom, var(--color-primary), #c8d0e8);
          margin: 6px 0;
        }
        .timeline-body {
          background: white;
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .timeline-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0 0 10px;
        }
        .topic-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .topic-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.87rem;
          color: #555;
          line-height: 1.5;
        }
        .topic-dot {
          width: 6px; height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* Sidebar Cards */
        .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }

        .sidebar-card {
          background: white;
          border: 1px solid #e8eaf0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }

        .sidebar-card-header {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-heading);
          font-size: 1.1rem; font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f0f2f8;
        }

        .kit-list { list-style: none; }
        .kit-list li {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #f4f5f9;
          font-size: 0.9rem; color: #555;
          font-weight: 500;
        }
        .kit-list li:last-child { border-bottom: none; }
        .kit-check { color: #4CAF50; flex-shrink: 0; }

        .faq-item { margin-bottom: 1.2rem; }
        .faq-item:last-child { margin-bottom: 0; }
        .faq-item strong { display: block; margin-bottom: 4px; color: var(--color-primary); font-size: 0.9rem; }
        .faq-item p { font-size: 0.85rem; color: #666; margin: 0; line-height: 1.6; }

        /* Refund Sidebar Card */
        .refund-card {
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          border-color: transparent;
          color: white;
          text-align: center;
        }
        .refund-card svg { color: #A5D6A7; margin-bottom: 0.75rem; }
        .refund-card h4 { color: white; font-size: 1.1rem; margin-bottom: 0.5rem; }
        .refund-card p { color: rgba(255,255,255,0.8); font-size: 0.85rem; line-height: 1.6; margin: 0; }

        @media (max-width: 968px) {
          .hero-grid, .details-grid, .batches-grid { grid-template-columns: 1fr; }
          .hero-text h1 { font-size: 2rem; }
          .hero-img-wrap { order: -1; }
          .highlights-strip { grid-template-columns: 1fr 1fr; }

          .timeline-item { grid-template-columns: 72px 1fr; gap: 0.75rem; }
          .timeline-day { width: 64px; font-size: 0.65rem; }
        }
      `}} />
    </div>
  );
};

export default EventDetails;
