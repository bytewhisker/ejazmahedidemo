import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectGrid({ projects, onSelectProject }) {
  return (
    <motion.div 
      layout 
      className="portfolio-grid" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            transition={{ 
              type: "tween", 
              ease: [0.16, 1, 0.3, 1], // Premium cinematic ease-out
              duration: 0.9,
              delay: index * 0.08
            }}
            className="project-card"
            onClick={() => onSelectProject(project.slug)}
          >
            {/* Metadata Header */}
            <div className="project-meta-row">
              <span className="project-number">{project.id}</span>
              <span>{project.title}</span>
            </div>

            {/* Thumbnail Image Container */}
            <div className="project-thumbnail-wrapper">
              <img 
                src={project.thumbnail} 
                alt={`${project.title} — Cinematography by Ejaz Mehedi`} 
                className="project-thumbnail"
                loading="lazy"
              />
              
              {/* Hover Specs Overlay */}
              <div className="project-overlay">
                <div className="project-overlay-specs">
                  <span>{project.resolution}</span>
                  <span>•</span>
                  <span>{project.aspectRatio}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
