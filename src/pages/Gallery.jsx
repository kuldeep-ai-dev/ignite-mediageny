import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { events } from '../data/events';

const Gallery = () => {
    const { id } = useParams();
    const event = events.find(e => e.id === id);

    const images = [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        'https://images.unsplash.com/photo-1558002038-1055907df827',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    ];

    if (!event) return <div className="container" style={{ paddingTop: '100px' }}>Event not found</div>;

    return (
        <div className="gallery-page container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
            <Link to={`/event/${id}`} className="back-link"><ChevronLeft size={20} /> Back to Event Details</Link>

            <div className="section-header">
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <ImageIcon size={32} /> {event.title} - Photo Gallery
                </h1>
                <p>Memories from our previous sessions of {event.title}.</p>
            </div>

            <div className="masonry-gallery">
                {images.map((img, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`gallery-item ${i % 3 === 0 ? 'large' : ''}`}
                    >
                        <img src={`${img}?auto=format&fit=crop&q=80&w=800`} alt={`Event photo ${i}`} />
                        <div className="img-overlay">
                            <span>Session {2024 + (i % 3)}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .masonry-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-auto-rows: 250px;
          gap: 15px;
          margin-top: 2rem;
        }

        .gallery-item {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
        }

        .gallery-item.large {
          grid-row: span 2;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.05);
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-weight: 700;
        }

        .gallery-item:hover .img-overlay {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .masonry-gallery { grid-template-columns: 1fr; grid-auto-rows: 200px; }
          .gallery-item.large { grid-row: span 1; }
        }
      `}} />
        </div>
    );
};

export default Gallery;
