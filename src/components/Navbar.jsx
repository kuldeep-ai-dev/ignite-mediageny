import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <NavLink to="/" className="logo">
          <Zap size={24} fill="currentColor" />
          <span>IGNITE</span>
        </NavLink>

        <div className="nav-links desktop-only">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/workshops">Workshops</NavLink>
          <NavLink to="/events">Upcoming Events</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <button className="btn btn-primary" onClick={() => navigate('/workshops')}>Register Now</button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
        <NavLink to="/workshops" onClick={() => setIsOpen(false)}>Workshops</NavLink>
        <NavLink to="/events" onClick={() => setIsOpen(false)}>Upcoming Events</NavLink>
        <NavLink to="/about" onClick={() => setIsOpen(false)}>About Us</NavLink>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => { navigate('/workshops'); setIsOpen(false); }}>Register Now</button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: var(--transition-smooth);
          background: transparent;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          height: 70px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--color-primary);
          font-family: var(--font-heading);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          font-weight: 500;
          color: var(--color-black);
          position: relative;
        }

        .nav-links a.active {
          color: var(--color-primary);
        }

        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-primary);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          color: var(--color-primary);
        }

        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          width: 100%;
          background: var(--color-white);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: translateY(-150%);
          transition: var(--transition-smooth);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .mobile-menu.open {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
