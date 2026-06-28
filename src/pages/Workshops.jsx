import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../lib/api';
import { Calendar, Tag, ChevronRight, Zap } from 'lucide-react';

const Workshops = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getEvents().then(setEvents);
    }, []);

    const workshops = events.filter(e => e.type === 'Workshops' || e.category === 'Workshops');

    return (
        <div className="workshops-page">
            <section className="workshops-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Skill-Building <span className="text-accent">Workshops</span>
                    </motion.h1>
                    <p>Practical, hands-on sessions designed to take you from beginner to expert in robotics and IoT.</p>
                </div>
            </section>

            <section className="workshops-grid-section container">
                <div className="workshops-grid">
                    {workshops.map((workshop, i) => (
                        <motion.div
                            key={workshop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="workshop-card"
                            onClick={() => navigate(`/event/${workshop.slug}`)}
                        >
                            <div className="workshop-img">
                                <img src={workshop.image} alt={workshop.title} />
                            </div>
                            <div className="workshop-info">
                                <h3>{workshop.title}</h3>
                                <p>{workshop.description}</p>
                                <div className="workshop-meta">
                                    <span><Calendar size={16} /> {workshop.duration}</span>
                                    <span><Tag size={16} /> {workshop.price}</span>
                                </div>
                                <button className="btn-view">
                                    Explore Details <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="workshop-features container">
                <div className="feature-bento">
                    <div className="feature-box">
                        <Zap size={32} />
                        <h4>Hands-on Training</h4>
                        <p>Every workshop includes a physical hardware kit that you get to keep after the session.</p>
                    </div>
                    <div className="feature-box">
                        <Zap size={32} />
                        <h4>Industry Experts</h4>
                        <p>Learn from engineers who build real-world industrial robotics and AI solutions.</p>
                    </div>
                    <div className="feature-box">
                        <Zap size={32} />
                        <h4>Certification</h4>
                        <p>Receive a MediaGeny verified certificate of completion and project validation.</p>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        .workshops-page { padding-top: 80px; min-height: 100vh; }
        
        .workshops-hero {
          padding: 100px 0 60px;
          text-align: center;
          background: var(--color-beige-light);
        }

        .workshops-hero h1 { font-size: 4rem; margin-bottom: 1.5rem; font-family: var(--font-heading); }
        .workshops-hero p { font-size: 1.25rem; color: #666; max-width: 700px; margin: 0 auto; }
        .text-accent { color: var(--color-primary); }

        .workshops-grid-section { padding: 60px 0; }
        .workshops-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }

        .workshop-card {
          display: flex;
          background: white;
          border: 1px solid var(--color-gray);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .workshop-card:hover { transform: translateY(-10px); border-color: var(--color-primary); box-shadow: var(--shadow-medium); }

        .workshop-img { width: 40%; }
        .workshop-img img { width: 100%; height: 100%; object-fit: cover; }

        .workshop-info { width: 60%; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; }
        .workshop-info h3 { font-size: 1.8rem; margin-bottom: 1rem; }
        .workshop-info p { color: #666; margin-bottom: 1.5rem; line-height: 1.6; }

        .workshop-meta { display: flex; gap: 2rem; margin-bottom: 2rem; color: #888; font-weight: 600; font-size: 0.9rem; }
        .workshop-meta span { display: flex; align-items: center; gap: 8px; }

        .feature-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 100px; }
        .feature-box { background: var(--color-navy); color: white; padding: 2.5rem; border-radius: var(--radius-md); }
        .feature-box svg { color: var(--color-beige); margin-bottom: 1.5rem; }
        .feature-box h4 { font-size: 1.5rem; margin-bottom: 1rem; }
        .feature-box p { color: rgba(255,255,255,0.7); line-height: 1.6; }

        @media (max-width: 968px) {
          .workshops-grid { grid-template-columns: 1fr; }
          .feature-bento { grid-template-columns: 1fr; }
          .workshops-hero h1 { font-size: 2.5rem; }
        }

        @media (max-width: 600px) {
          .workshop-card { flex-direction: column; }
          .workshop-img, .workshop-info { width: 100%; }
          .workshop-img { height: 200px; }
        }
      `}} />
        </div>
    );
};

export default Workshops;
