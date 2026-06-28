import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../lib/api';
import { Calendar, MapPin, Tag, ChevronRight } from 'lucide-react';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getEvents().then(setEvents);
    }, []);

    const upcomingEvents = events.filter(e => e.category === 'Upcoming');

    return (
        <div className="events-page">
            <section className="events-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Upcoming <span className="text-accent">Events</span>
                    </motion.h1>
                    <p>Don't miss out on our upcoming robotics championships, hackathons, and immersion programs.</p>
                </div>
            </section>

            <section className="events-list container">
                <div className="events-stack">
                    {upcomingEvents.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="event-wide-card"
                            onClick={() => navigate(`/event/${event.slug}`)}
                        >
                            <div className="event-date-box">
                                <span className="month">JUL</span>
                                <span className="day">{20 + i * 2}</span>
                            </div>
                            <div className="event-info">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div className="event-meta">
                                    <span><MapPin size={16} /> Online & Offline</span>
                                    <span><Tag size={16} /> {event.price}</span>
                                </div>
                            </div>
                            <button className="btn btn-outline">View Details</button>
                        </motion.div>
                    ))}
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        .events-page { padding-top: 80px; min-height: 100vh; background: #fafafa; }
        
        .events-hero {
          padding: 80px 0;
          background: var(--color-navy);
          color: white;
          text-align: center;
        }
        .events-hero h1 { font-size: 3.5rem; margin-bottom: 1rem; }
        .events-hero p { color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto; }
        .text-accent { color: var(--color-beige); }

        .events-list { padding: 80px 0; }
        .events-stack { display: flex; flex-direction: column; gap: 1.5rem; }

        .event-wide-card {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gray);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .event-wide-card:hover { transform: scale(1.02); border-color: var(--color-primary); }

        .event-date-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-beige-light);
          min-width: 100px;
          height: 100px;
          border-radius: 12px;
          font-weight: 800;
        }
        .event-date-box .month { font-size: 0.8rem; color: var(--color-primary); }
        .event-date-box .day { font-size: 2rem; }

        .event-info { flex: 1; }
        .event-info h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .event-info p { color: #666; font-size: 0.95rem; margin-bottom: 1rem; }

        .event-meta { display: flex; gap: 2rem; font-size: 0.85rem; font-weight: 600; color: #999; }
        .event-meta span { display: flex; align-items: center; gap: 8px; }

        @media (max-width: 768px) {
          .event-wide-card { flex-direction: column; text-align: center; }
          .event-meta { justify-content: center; }
        }
      `}} />
        </div>
    );
};

export default Events;
