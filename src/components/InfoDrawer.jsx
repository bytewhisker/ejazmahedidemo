import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export default function InfoDrawer({ isOpen, onClose }) {
  // Advanced spring-based drawer animations
  const drawerVariants = {
    hidden: { 
      x: '100%',
      opacity: 0.9
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 32, // Very smooth, high-class spring feeling
        stiffness: 150, 
        mass: 0.9,
        staggerChildren: 0.08, // Staggers the entrance of details
        delayChildren: 0.15
      }
    },
    exit: { 
      x: '100%',
      opacity: 0.9,
      transition: { 
        type: 'spring',
        damping: 35,
        stiffness: 220
      }
    }
  };

  // Staggered child block animations
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 24, 
        stiffness: 120 
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            className="info-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.div
            className="info-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Drawer Header */}
            <motion.div className="drawer-header" variants={itemVariants}>
              <h2 className="drawer-title">Information</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={16} /> <span>Close</span>
              </button>
            </motion.div>

            {/* Bio Section */}
            <motion.div className="info-section" variants={itemVariants}>
              <h3 className="info-section-title">Biography</h3>
              <div className="bio-text">
                <p className="bio-paragraph">
                  Born and raised in Dhaka, Bangladesh. Ezaz Mahedi (Ejaz Mehedi) is a self-taught cinematographer and occasional director working across narrative film, commercials, and music videos for 7+ years.
                </p>
                <p className="bio-paragraph">
                  His interest in the camera started young—fueled by cable TV and borrowed VHS tapes—and matured while studying photography, an education he largely built himself through relentless practice rather than formal training. He was deeply influenced early on by cinematic classics like <em>Stand By Me</em> and local masterpiece <em>Dipu Number Two</em>.
                </p>
                <p className="bio-paragraph">
                  His narrative interests center on genre storytelling—horror, mystery, and drama shaped by South Asian identity and the migrant/diaspora experience. In parallel, he shoots commercial and branded content for international clients across automotive, sport, hospitality, banking, and telecom sectors, mostly across South Asia and the MENA region.
                </p>
                <p className="bio-paragraph">
                  Currently based between Dhaka and the wider Asia/MENA region, available for projects worldwide.
                </p>
              </div>
            </motion.div>

            {/* Awards & Recognition */}
            <motion.div className="info-section" variants={itemVariants}>
              <h3 className="info-section-title">Selected Recognition</h3>
              <div className="awards-list">
                <div className="award-item">
                  <span className="award-name">SXSW Film Festival</span>
                  <span className="award-detail">Jury Award — Best Midnight Short (Moshari)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">Fantasia Festival</span>
                  <span className="award-detail">Gold Award — Best Asian Short (Moshari)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">HollyShorts Film Festival</span>
                  <span className="award-detail">Best Horror Short (Moshari)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">Atlanta Film Festival</span>
                  <span className="award-detail">Best Narrative Short (Moshari)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">Neuchâtel Int'l Fantastic Film Festival</span>
                  <span className="award-detail">Two Awards (Foreigners Only)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">BFI London Film Festival</span>
                  <span className="award-detail">Official Selection (Moshari)</span>
                </div>
                <div className="award-item">
                  <span className="award-name">Woodstock Film Festival</span>
                  <span className="award-detail">Best Narrative Short (Moshari)</span>
                </div>
                <div className="award-item" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                  <span className="award-name" style={{ color: 'var(--accent)' }}>Global Impact</span>
                  <span className="award-detail">11 Total Awards across 20+ Festivals in 2022</span>
                </div>
              </div>
            </motion.div>

            {/* Press & Features */}
            <motion.div className="info-section" variants={itemVariants}>
              <h3 className="info-section-title">Press & Features</h3>
              <div className="press-list">
                <a href="https://voyagela.com" target="_blank" rel="noopener noreferrer" className="press-item">
                  Voyage LA — "Rising Stars: Meet Ejaz Mehedi" <ExternalLink size={12} />
                </a>
                <a href="https://lenspire.zeiss.com" target="_blank" rel="noopener noreferrer" className="press-item">
                  ZEISS Cinematography Lenspire — Artist Interview <ExternalLink size={12} />
                </a>
                <a href="https://www.prothomalo.com" target="_blank" rel="noopener noreferrer" className="press-item">
                  Prothom Alo — MIFF 2022 Festival Feature <ExternalLink size={12} />
                </a>
                <a href="#" className="press-item" onClick={(e) => e.preventDefault()}>
                  Friday Night Movie Podcast — SXSW Filmmakers Panel <ExternalLink size={12} />
                </a>
                <span className="press-item" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  National Coverage: Channel24, Samakal, Protidiner Bangladesh, Daily Manabjamin
                </span>
              </div>
            </motion.div>

            {/* Gear & Formats */}
            <motion.div className="info-section" variants={itemVariants}>
              <h3 className="info-section-title">Preferred Systems</h3>
              <div className="gear-grid">
                <span className="gear-tag">RED Epic</span>
                <span className="gear-tag">ARRI Alexa Mini</span>
                <span className="gear-tag">Zeiss CP.3 Primes</span>
                <span className="gear-tag">Zeiss Supreme Primes</span>
                <span className="gear-tag">Anamorphic Format</span>
                <span className="gear-tag">Black Promist Filters</span>
                <span className="gear-tag">LowCon Filters</span>
                <span className="gear-tag">Practical Light Style</span>
                <span className="gear-tag">Available Light Specialist</span>
              </div>
            </motion.div>

            {/* Contact Details */}
            <motion.div className="info-section" variants={itemVariants} style={{ marginBottom: 0 }}>
              <h3 className="info-section-title">Contact & Social</h3>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-label">Email Representation</span>
                  <a href="mailto:hello@ezazmahedi.com" className="contact-link">hello@ezazmahedi.com</a>
                </div>
                
                <div className="social-links-row">
                  <a href="https://vimeo.com/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}><path d="M22.396 7.377c-.116 2.483-1.82 5.882-5.114 10.198-3.377 4.43-6.241 6.643-8.59 6.643-1.465 0-2.703-1.35-3.715-4.052L1.87 9.176c-.958-3.498-1.986-5.247-3.08-5.247-.23 0-.73.402-1.505 1.205L-.01 3.7c1.3-1.144 2.576-2.288 3.827-3.433C5.568.27 6.844.02 7.644.02c1.88 0 3.033 1.267 3.46 3.801.46 2.716.782 5.56 1.012 8.528.322 2.115.82 3.172 1.493 3.172.602 0 1.488-.98 2.659-2.935 1.13-1.902 1.745-3.308 1.848-4.218.173-1.52-.373-2.282-1.637-2.282-.576 0-1.173.13-1.794.39 1.185-3.877 3.255-5.816 6.21-5.816 2.19 0 3.23 1.442 3.12 4.327z"/></svg> Vimeo
                  </a>
                  <a href="https://instagram.com/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
                  </a>
                  <a href="https://linkedin.com/in/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
