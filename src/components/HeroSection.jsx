import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [0.35, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div ref={heroRef} className="hero-section" style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-color)' }}>
      
      {/* Background Video with Parallax Scale */}
      <motion.div style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        pointerEvents: 'none', zIndex: 1,
        scale: videoScale,
        opacity: videoOpacity
      }}>
        <iframe
          src="https://player.vimeo.com/video/782070615?background=1&autoplay=1&loop=1&muted=1&autopause=0&quality=1080p&byline=0&title=0&portrait=0#t=5"
          frameBorder="0"
          allow="autoplay; fullscreen"
          style={{ 
            width: '100vw', 
            height: '56.25vw',
            minHeight: '100vh', 
            minWidth: '177.77vh',
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            filter: 'contrast(1.15) brightness(0.85)'
          }}
          title="Ejaz Mehedi Cinematography Reel"
        />
      </motion.div>

      {/* Vignette & Scroll Fade Overlay */}
      <motion.div style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, var(--bg-primary) 100%)', 
        zIndex: 2,
        opacity: overlayOpacity
      }} />

      {/* Hero Content with Parallax Float */}
      <motion.div 
        className="hero-content" 
        style={{ 
          zIndex: 3, textAlign: 'center', position: 'relative', padding: '0 20px',
          y: contentY,
          opacity: contentOpacity
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span 
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.5em', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Director of Photography
        </motion.span>
        <motion.h1 
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 300, margin: '0 0 18px', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1.0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Ejaz Mehedi
        </motion.h1>
        <motion.p 
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.3em', textTransform: 'uppercase', maxWidth: '500px', margin: '0 auto 30px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.2 }}
        >
          Cinematography Reel &amp; Narrative Archive
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <a 
            href="#archive"
            className="social-btn hero-cta" 
            style={{ 
              display: 'inline-flex', 
              padding: '14px 36px', 
              fontSize: '0.68rem', 
              letterSpacing: '0.2em', 
              borderColor: 'rgba(255,255,255,0.2)', 
              color: 'var(--text-primary)', 
              background: 'rgba(255,255,255,0.03)', 
              backdropFilter: 'blur(10px)', 
              textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              border: '1px solid rgba(255,255,255,0.15)',
              textTransform: 'uppercase'
            }}
          >
            Explore Archive
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
