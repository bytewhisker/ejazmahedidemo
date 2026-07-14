import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Using Dhaka timezone as requested previously
      setTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour12: false }) + ' GMT+6');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      padding: '80px 20px 40px', 
      marginTop: '60px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Top Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '80px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Location</span>
            <span>Dhaka, Bangladesh<br/>Available Worldwide</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Contact</span>
            <a href="mailto:hello@ejazmehedi.com" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>hello@ejazmehedi.com</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Socials</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="https://vimeo.com/ejazmehedi" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Vimeo</a>
              <a href="https://instagram.com/ejazmehedi" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Instagram</a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--text-muted)' }}>Local Time</span>
            <span style={{ color: 'var(--accent)' }}>{time}</span>
          </div>
        </div>

        {/* Massive Typographic Footer Logo */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(3rem, 12vw, 10rem)', 
              fontWeight: 300, 
              margin: 0, 
              letterSpacing: '0.02em',
              lineHeight: 1,
              color: 'rgba(255, 255, 255, 0.05)',
              textTransform: 'uppercase',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            Ejaz Mehedi
          </motion.h2>
        </div>

        {/* Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '40px' }}>
          <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          <span>Crafted with Precision</span>
        </div>

      </div>
    </footer>
  );
}
