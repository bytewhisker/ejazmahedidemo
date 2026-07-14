import React from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
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
      className="contact-page-layout"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ padding: '80px 0 100px', textAlign: 'center' }}
    >
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 300, margin: '0 0 10px', textTransform: 'uppercase' }}>Connect</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '60px' }}>Currently based between Dhaka and the wider Asia/MENA region, available for projects worldwide.</p>
      
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '40px', textAlign: 'left', minWidth: '300px' }}>
        <div className="contact-item" style={{ textAlign: 'center' }}>
          <span className="contact-label" style={{ marginBottom: '10px' }}>Email Representation</span>
          <a href="mailto:hello@ejazmehedi.com" className="contact-link" style={{ fontSize: '1.8rem', display: 'block' }}>hello@ejazmehedi.com</a>
        </div>
        
        <div className="social-links-row" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <a href="https://vimeo.com/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}><path d="M22.396 7.377c-.116 2.483-1.82 5.882-5.114 10.198-3.377 4.43-6.241 6.643-8.59 6.643-1.465 0-2.703-1.35-3.715-4.052L1.87 9.176c-.958-3.498-1.986-5.247-3.08-5.247-.23 0-.73.402-1.505 1.205L-.01 3.7c1.3-1.144 2.576-2.288 3.827-3.433C5.568.27 6.844.02 7.644.02c1.88 0 3.033 1.267 3.46 3.801.46 2.716.782 5.56 1.012 8.528.322 2.115.82 3.172 1.493 3.172.602 0 1.488-.98 2.659-2.935 1.13-1.902 1.745-3.308 1.848-4.218.173-1.52-.373-2.282-1.637-2.282-.576 0-1.173.13-1.794.39 1.185-3.877 3.255-5.816 6.21-5.816 2.19 0 3.23 1.442 3.12 4.327z"/></svg> Vimeo
          </a>
          <a href="https://instagram.com/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
          </a>
          <a href="https://linkedin.com/in/ejazmehedi" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
}
