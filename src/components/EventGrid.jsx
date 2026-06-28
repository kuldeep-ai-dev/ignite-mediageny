import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../lib/api';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

const EventGrid = () => {
  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(data => {
      // Pin Summer Robotics Camp as the featured (first) card
      const sorted = [...data].sort((a, b) => {
        if (a.slug === 'summer-robotics-2026') return -1;
        if (b.slug === 'summer-robotics-2026') return 1;
        return 0;
      });
      setEvents(sorted);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Upcoming', 'Past', 'Workshops'];

  const filteredEvents = filter === 'All'
    ? events
    : events.filter(e => e.category === filter || e.type === filter);

  return (
    <section id="events" className="event-section section-padding">
      <div className="container">
        <div className="section-header">
          <h2>Latest Events & Workshops</h2>
          <div className="filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="bento-grid">
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bento-item event-card"
                onClick={() => navigate(`/event/${event.slug}`)}
              >
                <div className="card-thumb">
                  <img src={event.image} alt={event.title} />
                  <div className="card-badge">{event.type}</div>
                  {index === 0 && (
                    <div style={{
                      position: 'absolute', bottom: '20px', left: '20px',
                      background: 'linear-gradient(135deg, #FF6B35, #FF9800)',
                      color: 'white', padding: '8px 16px', borderRadius: '100px',
                      fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em',
                      textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,107,53,0.5)',
                      display: 'flex', alignItems: 'center', gap: '6px', zIndex: 2
                    }}>
                      ⭐ Featured Camp
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p>{event.description.substring(0, 80)}...</p>
                  <div className="card-meta">
                    <span><Calendar size={14} /> {event.duration}</span>
                    <span><Tag size={14} /> {event.price}</span>
                  </div>
                  <button className="btn-view">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--spacing-md);
          flex-wrap: wrap;
          gap: 2rem;
        }

        .section-header h2 {
          font-size: 3rem;
          max-width: 500px;
          line-height: 1;
        }

        .filters {
          display: flex;
          gap: 0.5rem;
          background: rgba(10, 17, 40, 0.05);
          padding: 6px;
          border-radius: 12px;
          border: 1px solid rgba(10, 17, 40, 0.1);
        }

        .filter-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          background: transparent;
          color: var(--color-primary);
          opacity: 0.6;
          transition: var(--transition-smooth);
        }

        .filter-btn.active {
          background: var(--color-primary);
          color: var(--color-white);
          opacity: 1;
          box-shadow: 0 4px 12px rgba(10, 17, 40, 0.2);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 220px;
          gap: 20px;
        }

        .event-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          padding: 0 !important;
          background: var(--color-white);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .event-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: var(--color-primary);
        }

        /* Bento variation logic */
        /* Large Featured Card */
        .event-card:nth-child(1) {
          grid-column: span 4;
          grid-row: span 2;
          flex-direction: row;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          border-radius: 24px;
          overflow: hidden;
        }

        .event-card:nth-child(1) .card-thumb { 
          width: 40%;
          height: 100%; 
          order: 2;
        }

        .event-card:nth-child(1) .card-content { 
          width: 60%; 
          height: 100%; 
          padding: 4rem;
          order: 1;
        }

        .event-card:nth-child(1):hover .card-thumb img {
          transform: scale(1.05);
        }

        /* Medium Card */
        .event-card:nth-child(2) {
          grid-column: span 2;
          grid-row: span 1;
        }

        /* Normal Cards */
        .event-card:nth-child(n+3) {
          grid-column: span 1;
          grid-row: span 1;
        }

        .card-thumb {
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: var(--color-beige-light);
        }

        .event-card:nth-child(2) .card-thumb { display: none; } /* Text focus for some balance */
        .event-card:nth-child(2) .card-thumb { display: none; } /* Text focus for some balance */
        
        /* Make child 2 have a specific background */
        .event-card:nth-child(2) {
          background: var(--color-primary);
          color: white;
        }
        .event-card:nth-child(2) h3 { color: white; }
        .event-card:nth-child(2) p { color: rgba(255,255,255,0.7); }
        .event-card:nth-child(2) .card-meta { color: rgba(255,255,255,0.5); }
        .event-card:nth-child(2) .btn-view { color: var(--color-beige); }

        .card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .event-card:nth-child(1) .card-badge {
          top: 30px;
          left: 30px;
          padding: 10px 20px;
          font-size: 0.8rem;
          background: var(--color-primary);
          color: white;
        }

        .card-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          color: var(--color-primary);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .card-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }

        .card-content h3 {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .event-card:nth-child(1) h3 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .event-card:nth-child(1) p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .card-content p {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-card:nth-child(1) .card-meta {
          gap: 3rem;
          margin-bottom: 2.5rem;
        }

        .event-card:nth-child(1) .card-meta span {
          font-size: 1rem;
          color: var(--color-navy);
          background: var(--color-beige-light);
          padding: 8px 16px;
          border-radius: 100px;
        }

        .event-card:nth-child(1) .btn-view {
          background: var(--color-primary);
          color: white;
          padding: 14px 28px;
          border-radius: 12px;
          width: fit-content;
          transition: var(--transition-smooth);
        }

        .event-card:nth-child(1) .btn-view:hover {
          background: #1a2a4a;
          transform: translateX(5px);
        }

        .card-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .card-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-view {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: var(--color-primary);
          background: none;
          padding: 0;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1100px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: minmax(200px, auto);
          }
        }

        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .event-card:nth-child(n) {
             grid-column: span 1;
             grid-row: span 1;
          }
          .event-card:nth-child(1) {
             grid-column: span 1;
             grid-row: span 1;
             flex-direction: column;
          }
          .event-card:nth-child(1) .card-thumb, .event-card:nth-child(1) .card-content {
            width: 100%;
          }
          .event-card:nth-child(1) .card-content { padding: 2rem; }
          .event-card:nth-child(1) h3 { font-size: 1.4rem; }
          .event-card:nth-child(1) p { font-size: 0.95rem; }
          .event-card:nth-child(1) .card-thumb { height: 200px; }
          .event-card:nth-child(2) .card-thumb { display: none; }
        }
      `}} />
    </section>
  );
};

export default EventGrid;
