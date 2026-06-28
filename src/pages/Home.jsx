import React from 'react';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import { motion } from 'framer-motion';
import { Rocket, Shield, Users, Smartphone, Globe, Lightbulb } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />

            {/* Bento Information Hub */}
            <section className="bento-hub section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2>The Ignite Hub</h2>
                        <p>Driving innovation through structured learning and state-of-the-art technology.</p>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-item feature-card navy-bg">
                            <Rocket size={32} />
                            <h3>Our Mission</h3>
                            <p>To nurture the next generation of engineers, developers, and tech visionaries.</p>
                        </div>

                        <div className="bento-item feature-card beige-bg">
                            <Shield size={32} />
                            <h3>Certified Training</h3>
                            <p>All our workshops are industry-recognized and certified by MediaGeny.</p>
                        </div>

                        <div className="bento-item feature-card tall tech-stack-bg">
                            <Smartphone size={48} strokeWidth={1.5} />
                            <h3>Tech Stack</h3>
                            <p>Learn Arduino, ESP32, Python, and ROS2 in a hands-on environment.</p>
                        </div>

                        <div className="bento-item feature-card wide">
                            <div className="flex-center">
                                <div className="stat">
                                    <span>300+</span>
                                    <p>Students Trained</p>
                                </div>
                                <div className="divider"></div>
                                <div className="stat">
                                    <span>20+</span>
                                    <p>Annual Events</p>
                                </div>
                            </div>
                        </div>

                        <div className="bento-item feature-card">
                            <Users size={32} />
                            <h3>Community</h3>
                            <p>Join a network of 500+ local innovators and makers.</p>
                        </div>

                        <div className="bento-item feature-card">
                            <Lightbulb size={32} />
                            <h3>Innovation Lab</h3>
                            <p>Get exclusive access to our robotics hardware and prototyping tools.</p>
                        </div>
                    </div>
                </div>
            </section>

            <EventGrid />

            <style dangerouslySetInnerHTML={{
                __html: `
        .section-header h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .section-header p { color: #666; margin-bottom: 2rem; }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
        }

        .feature-card.navy-bg {
          background: var(--color-primary);
          color: white;
        }
        .feature-card.navy-bg p { color: #ccc; }
        .feature-card.navy-bg h3 { color: white; }

        .feature-card.beige-bg {
          background: var(--color-beige);
        }

        .feature-card.tall { grid-row: span 2; }
        .tech-stack-bg { 
          background: linear-gradient(135deg, #0A1128 0%, #1A2A4A 100%);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          justify-content: center;
          padding: 2rem !important;
        }
        .tech-stack-bg h3 { color: white; margin-top: 1rem; }
        .tech-stack-bg p { color: rgba(255,255,255,0.7); }
        .card-overlay h3 { color: white; }

        .flex-center {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 100%;
        }

        .stat { text-align: center; }
        .stat span { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); display: block; }
        .stat p { font-size: 0.9rem; font-weight: 600; color: #666; }

        .divider { width: 1px; height: 50%; background: var(--color-gray); }

        @media (max-width: 768px) {
          .feature-card.wide { grid-column: span 1; }
          .feature-card.tall { grid-row: span 1; height: 300px; }
        }
      `}} />
        </div>
    );
};

export default Home;
