import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="hero-section" style={{ position: 'relative', width: '100%', height: '75vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-color)' }}>
      {/* Background Vimeo Video Reel */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
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
            opacity: 0.35,
            filter: 'contrast(1.15) brightness(0.85)'
          }}
          title="Ejaz Mehedi Cinematography Reel"
        />
      </div>

      {/* Vignette & Color Fade Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, var(--bg-primary) 100%)', 
        zIndex: 2 
      }} />

      {/* Hero Content */}
      <motion.div 
        className="hero-content" 
        style={{ zIndex: 3, textAlign: 'center', position: 'relative', padding: '0 20px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
          DIRECTOR OF PHOTOGRAPHY
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 300, margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.05 }}>
          Ejaz Mehedi
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.25em', textTransform: 'uppercase', maxWidth: '600px', margin: '0 auto 25px' }}>
          Cinematography Reel &amp; Narrative Archive
        </p>
        <a 
          href="#archive"
          className="social-btn" 
          style={{ 
            display: 'inline-flex', 
            padding: '12px 26px', 
            fontSize: '0.75rem', 
            letterSpacing: '0.15em', 
            borderColor: 'var(--text-primary)', 
            color: 'var(--text-primary)', 
            background: 'rgba(0,0,0,0.3)', 
            backdropFilter: 'blur(10px)', 
            textDecoration: 'none',
            transition: 'all 0.3s ease' 
          }}
        >
          EXPLORE ARCHIVE
        </a>
      </motion.div>
    </div>
  );
}
