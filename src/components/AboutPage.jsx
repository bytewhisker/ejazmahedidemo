import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const pageVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { opacity: 0, y: -20, filter: 'blur(10px)', transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="about-page-layout"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ padding: '60px 0 120px', display: 'flex', gap: '80px', alignItems: 'flex-start', flexWrap: 'wrap' }}
    >
      <div style={{ flex: '1', minWidth: '350px' }}>
        <img 
          src="https://scontent.fdac147-1.fna.fbcdn.net/v/t39.30808-6/405766767_10160343566887585_8885037401858467009_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=vqebIvN69MQQ7kNvwGbz5fy&_nc_oc=AdocNHVK0R3RtO20qyJGFM0_9pwTJWfGpSrYkck8Zbp1JVTvhsEzyG6sYoSgjp5pdS4&_nc_zt=23&_nc_ht=scontent.fdac147-1.fna&_nc_gid=bvhDy4zGJnbzxlkzdgHb6w&_nc_ss=7b289&oh=00_AQDv5rqgYiTSYnIXUacAPqbmZ5AoKfaJC-tt0bZkBMZpHA&oe=6A5ABFD2" 
          alt="Ejaz Mehedi" 
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', filter: 'grayscale(100%)', border: '1px solid var(--border-color)', padding: '10px', background: 'rgba(255,255,255,0.02)' }} 
        />
      </div>
      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '50px', minWidth: '350px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 300, margin: '0 0 30px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Ejaz Mehedi</h1>
          <div className="bio-text">
            <p className="bio-paragraph" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
              Born and raised in Dhaka, Bangladesh. Ejaz Mehedi is a self-taught cinematographer and occasional director working across narrative film, commercials, and music videos for 7+ years.
            </p>
            <p className="bio-paragraph" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              His interest in the camera started young—fueled by cable TV and borrowed VHS tapes—and matured while studying photography, an education he largely built himself through relentless practice rather than formal training. He was deeply influenced early on by cinematic classics like <em>Stand By Me</em> and local masterpiece <em>Dipu Number Two</em>.
            </p>
            <p className="bio-paragraph" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              His narrative interests center on genre storytelling—horror, mystery, and drama shaped by South Asian identity and the migrant/diaspora experience. In parallel, he shoots commercial and branded content for international clients across automotive, sport, hospitality, banking, and telecom sectors, mostly across South Asia and the MENA region.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          <div className="info-section" style={{ flex: '1', minWidth: '250px' }}>
            <h3 className="info-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Preferred Systems</h3>
            <div className="gear-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span className="gear-tag" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>RED Epic</span>
              <span className="gear-tag" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>ARRI Alexa Mini</span>
              <span className="gear-tag" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>Zeiss CP.3 Primes</span>
              <span className="gear-tag" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>Zeiss Supreme Primes</span>
              <span className="gear-tag" style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>Anamorphic Format</span>
            </div>
          </div>
          
          <div className="info-section" style={{ flex: '1', minWidth: '300px' }}>
            <h3 className="info-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>Selected Recognition</h3>
            <div className="awards-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="award-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="award-name" style={{ color: 'var(--text-primary)' }}>SXSW Film Festival</span>
                <span className="award-detail" style={{ color: 'var(--accent)' }}>Jury Award</span>
              </div>
              <div className="award-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="award-name" style={{ color: 'var(--text-primary)' }}>Fantasia Festival</span>
                <span className="award-detail" style={{ color: 'var(--accent)' }}>Gold Award</span>
              </div>
              <div className="award-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="award-name" style={{ color: 'var(--text-primary)' }}>HollyShorts Festival</span>
                <span className="award-detail" style={{ color: 'var(--accent)' }}>Best Horror</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
