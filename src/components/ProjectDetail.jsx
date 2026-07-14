import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CustomPlayer from './CustomPlayer';

export default function ProjectDetail({ project, onBack }) {
  // Page entry animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: 'blur(10px)',
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      className="project-detail-layout"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ paddingBottom: '120px' }}
    >
      <div className="container">
        {/* Back Button */}
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={14} /> <span>Back to Archive</span>
          </button>
        </div>

        {/* Custom Video Suite */}
        <CustomPlayer 
          videoSrc={project.videoUrl} 
          projectSpecs={{
            resolution: project.resolution,
            aspectRatio: project.aspectRatio,
            fps: project.fps,
            gear: project.gear
          }}
        />

        {/* Project Info Block */}
        <div className="project-details-grid" style={{ marginBottom: '60px' }}>
          {/* Narrative Content */}
          <div className="project-details-left">
            <h1>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', marginRight: '15px' }}>
                {project.id}
              </span>
              {project.title}
            </h1>
            <div className="project-description">
              <p>{project.notes}</p>
            </div>
          </div>

          {/* Camera & Production Metadata */}
          <div className="project-details-right">
            <div className="spec-list">
              <div className="spec-item">
                <span className="spec-label">Role</span>
                <span className="spec-value">{project.role}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Director</span>
                <span className="spec-value">{project.director}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Year</span>
                <span className="spec-value-mono">{project.year}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Camera &amp; Glass</span>
                <span className="spec-value">{project.gear}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Resolution</span>
                <span className="spec-value-mono">{project.resolution}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Frame Rate</span>
                <span className="spec-value-mono">{project.fps}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Aspect Ratio</span>
                <span className="spec-value-mono">{project.aspectRatio}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Production Stills / Film Frames Grid */}
        {project.stills && project.stills.length > 0 && (
          <div className="project-stills-section" style={{ marginTop: '80px', borderTop: '1px solid var(--border-color)', paddingTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '30px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Selected Film Frames
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {project.stills.length} SPECS // STICK_FRAMES
              </span>
            </div>
            
            <div className="stills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '20px' }}>
              {project.stills.map((still, idx) => (
                <motion.div 
                  key={idx}
                  className="still-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-color)', 
                    position: 'relative', 
                    aspectRatio: '16/9', 
                    background: '#090909',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={still} 
                    alt={`Film Frame ${idx + 1} - ${project.title}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                    className="still-img"
                  />
                  <div className="still-overlay" style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0, transition: 'opacity 0.3s ease', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    FRAME // {project.slug.toUpperCase()}_0{idx + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
