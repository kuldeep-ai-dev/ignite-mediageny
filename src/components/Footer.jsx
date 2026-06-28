import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-info">
          <h3>IGNITE</h3>
          <p>The educational arm of MediaGeny, empowering the next generation through robotics and innovation.</p>
          <a href="https://www.mediageny.com" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: '15px', color: 'var(--color-primary)', fontWeight: 'bold' }}>
            Visit MediaGeny.com <Globe size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />
          </a>
          <div className="social-links">
            <a href="https://www.mediageny.com"><Globe size={20} /></a>
            <a href="#"><Share2 size={20} /></a>
            <a href="#"><MessageSquare size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#events">Workshops & Events</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/admin">Admin Area</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Contact Info</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}><Phone size={16} /> +91-7896094895</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}><Mail size={16} /> hello@mediageny.com</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}><MapPin size={16} /> Guwahati, Assam</li>
          </ul>
        </div>

        <div className="footer-contact" id="contact">
          <h4>Contact Us</h4>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Message" rows="3" required></textarea>
            <button className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 MediaGeny. All rights reserved.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer {
          background-color: var(--color-beige-light);
          padding: var(--spacing-lg) 0 0 0;
          border-top: 1px solid var(--color-gray);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .footer h3, .footer h4 {
          margin-bottom: var(--spacing-sm);
        }

        .footer p {
          color: #666;
          margin-bottom: var(--spacing-sm);
        }

        .social-links {
          display: flex;
          gap: 15px;
          color: var(--color-primary);
        }

        .footer-links ul {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-form input, .contact-form textarea {
          padding: 10px;
          border: 1px solid var(--color-gray);
          border-radius: var(--radius-sm);
          font-family: inherit;
        }

        .footer-bottom {
          padding: 20px 0;
          border-top: 1px solid var(--color-gray);
          background: var(--color-white);
          text-align: center;
          font-size: 0.9rem;
          color: #888;
        }
      `}} />
    </footer>
  );
};

export default Footer;
