import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Users, BookOpen } from 'lucide-react';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        Engineering the <span className="text-primary">Future</span>
                    </motion.h1>
                    <p>Ignite by MediaGeny is dedicated to empowering the next generation of engineers through hands-on robotics and tech immersion.</p>
                </div>
            </section>

            <section className="about-content container">
                <div className="mission-grid">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="mission-text">
                        <h2>Our Mission</h2>
                        <p>At MediaGeny, we believe that education should be as dynamic as the industry itself. Our robotics camps and workshops are designed to bridge the gap between classroom theory and real-world application.</p>
                        <div className="stats">
                            <div className="stat-item">
                                <span className="number">300+</span>
                                <span className="label">Students Trained</span>
                            </div>
                            <div className="stat-item">
                                <span className="number">15+</span>
                                <span className="label">Workshops Held</span>
                            </div>
                        </div>
                    </motion.div>
                    <div className="mission-image">
                        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Robotics Lab" />
                    </div>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <Target className="icon" />
                        <h3>Pragmatic Learning</h3>
                        <p>We focus on building actual products that work, rather than just solving theoretical equations.</p>
                    </div>
                    <div className="value-card">
                        <Users className="icon" />
                        <h3>Community Centric</h3>
                        <p>Join a network of young innovators and industrial mentors who are shaping the tech landscape.</p>
                    </div>
                    <div className="value-card">
                        <BookOpen className="icon" />
                        <h3>Modern Curriculum</h3>
                        <p>Our syllabus is updated monthly to reflect the latest trends in IoT, AI, and Autonomous systems.</p>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        .about-page { padding-top: 80px; }
        
        .about-hero {
          padding: 120px 0 80px;
          text-align: center;
          background: var(--color-beige-light);
        }
        .about-hero h1 { font-size: 4rem; margin-bottom: 1.5rem; }
        .about-hero p { font-size: 1.25rem; color: #666; max-width: 800px; margin: 0 auto; line-height: 1.6; }
        .text-primary { color: var(--color-primary); }

        .about-content { padding: 100px 0; }
        
        .mission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 100px; }
        .mission-text h2 { font-size: 2.5rem; margin-bottom: 1.5rem; }
        .mission-text p { font-size: 1.1rem; color: #555; line-height: 1.8; margin-bottom: 2rem; }

        .mission-image img { width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-medium); }

        .stats { display: flex; gap: 3rem; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-item .number { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); }
        .stat-item .label { font-size: 0.9rem; color: #888; font-weight: 600; text-transform: uppercase; }

        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .value-card { background: white; padding: 2.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-gray); transition: var(--transition-smooth); }
        .value-card:hover { transform: translateY(-5px); border-color: var(--color-primary); }
        .value-card .icon { color: var(--color-primary); margin-bottom: 1.5rem; width: 40px; height: 40px; }
        .value-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .value-card p { color: #666; line-height: 1.6; }

        @media (max-width: 968px) {
          .mission-grid, .values-grid { grid-template-columns: 1fr; }
          .about-hero h1 { font-size: 2.5rem; }
        }
      `}} />
        </div>
    );
};

export default About;
