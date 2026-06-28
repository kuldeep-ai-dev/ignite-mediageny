import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <div className="badge">
            <Cpu size={16} />
            <span>Empowered by MediaGeny</span>
          </div>
          <h1>Igniting the Next <br /><span>Generation of Innovators</span></h1>
          <p>
            MediaGeny’s educational division dedicated to bridging the gap between curiosity and creation.
            From Summer Robotics Camps to advanced AI demonstrations, we provide the tools and expertise
            to shape the future of tech.
          </p>
          <div className="hero-btns">
            <Link to="/#events" className="btn btn-primary" onClick={() => {
              const el = document.getElementById('events');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#events';
              }
            }}>
              View Workshops <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image"
        >
          <div className="image-wrapper">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" alt="Robotics Innovation" />
            <div className="decoration-box beige"></div>
            <div className="decoration-box navy"></div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero {
          padding: 160px 0 100px 0;
          background-color: var(--color-white);
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(245, 245, 220, 0.5) 0%, transparent 70%);
          top: -200px;
          left: -100px;
          z-index: 0;
          filter: blur(80px);
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 40%;
          height: 100%;
          background: var(--color-beige-light);
          z-index: 0;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-beige);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 2rem;
        }

        .hero-text h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-text h1 span {
          color: transparent;
          -webkit-text-stroke: 1px var(--color-primary);
        }

        .hero-text p {
          font-size: 1.1rem;
          color: #555;
          max-width: 500px;
          margin-bottom: 2.5rem;
        }

        .hero-btns {
          display: flex;
          gap: 1rem;
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-medium);
        }

        .image-wrapper img {
          width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          display: block;
        }

        .decoration-box {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          z-index: -1;
        }

        .decoration-box.beige {
          background: var(--color-beige);
          top: -20px;
          right: -20px;
        }

        .decoration-box.navy {
          background: var(--color-primary);
          bottom: -20px;
          left: -20px;
        }

        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-text p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-btns {
            justify-content: center;
          }
          .hero::before { width: 100%; height: 30%; top: 0; }
        }
      `}} />
    </section>
  );
};

export default Hero;
