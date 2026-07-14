import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ currentFilter, setFilter, onGoHome, onGoAbout, onGoContact, isHeroPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'narrative', label: 'Narrative' },
    { id: 'commercial', label: 'Commercials' },
    { id: 'music-video', label: 'Music Videos' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showTitle = !isHeroPage || isScrolled;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleMobileNav = (action) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container">
        
        {/* Mobile Hamburger Layout */}
        <div className="mobile-header-layout" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="site-title" style={{ opacity: showTitle ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); handleMobileNav(() => { setFilter('all'); onGoHome(); }); }} className="site-title-link" style={{ fontSize: '1.2rem' }}>Ejaz Mehedi</a>
          </div>
          <button onClick={toggleMobileMenu} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', zIndex: 999 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="nav-grid desktop-nav-layout">
          <div className="nav-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setFilter(cat.id); onGoHome(); }}
                className={`filter-btn ${currentFilter === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div 
            className="site-title" 
            style={{ 
              opacity: showTitle ? 1 : 0, 
              transform: showTitle ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              pointerEvents: showTitle ? 'auto' : 'none'
            }}
          >
            <a href="/" onClick={(e) => { e.preventDefault(); setFilter('all'); onGoHome(); }} className="site-title-link">Ejaz Mehedi</a>
            <div className="site-subtitle">Director of Photography</div>
          </div>

          <div className="nav-info">
            <a href="/about" onClick={(e) => { e.preventDefault(); onGoAbout(); }} className="nav-link-item">
              <span className="nav-link-label">About</span>
              <span className="nav-link-line"></span>
            </a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onGoContact(); }} className="nav-link-item">
              <span className="nav-link-label">Contact</span>
              <span className="nav-link-line"></span>
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 998,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <span className="nav-label" style={{ color: 'var(--accent)', marginBottom: '10px' }}>Projects</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleMobileNav(() => { setFilter(cat.id); onGoHome(); })}
                  style={{ background: 'none', border: 'none', color: currentFilter === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', marginTop: '30px' }}>
              <span className="nav-label" style={{ color: 'var(--accent)', marginBottom: '10px' }}>Studio</span>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleMobileNav(() => onGoAbout()); }} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleMobileNav(() => onGoContact()); }} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
