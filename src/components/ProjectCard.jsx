import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ProjectCard = ({ project, indexNumber, onClick }) => {
  const [hoveredStillIndex, setHoveredStillIndex] = useState(null);

  const stills = project.hoverStills && project.hoverStills.length === 3
    ? project.hoverStills
    : [
        project.thumbnail,
        project.poster || project.thumbnail,
        (project.screengrabs && project.screengrabs[0]) || project.thumbnail
      ];

  const formattedIndex = String(indexNumber).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.9,
        delay: Math.min((indexNumber - 1) * 0.1, 0.8), // Staggered slow cinematic reveal
        ease: [0.16, 1, 0.3, 1]
      }}
      onClick={() => onClick(project)}
      className="group cursor-pointer space-y-2 select-none"
    >
      {/* Monospace 01 PROJECT TITLE */}
      <div className="flex items-center justify-between text-xs font-mono-custom tracking-widest uppercase text-ink font-medium">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-muted">{formattedIndex}</span>
          <span className="truncate group-hover:text-ink-soft transition-colors">{project.title}</span>
        </div>
        <span className="text-[10px] text-muted font-normal shrink-0">{project.category}</span>
      </div>

      {/* 3 Still Frames Container — Each Still has its own individual hover preview */}
      <div className="relative bg-canvas p-1 border border-line group-hover:border-line-strong transition-colors">
        <div className="grid grid-cols-3 gap-1">
          {stills.map((stillUrl, idx) => {
            const isThisStillHovered = hoveredStillIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredStillIndex(idx)}
                onMouseLeave={() => setHoveredStillIndex(null)}
                onTouchStart={() => setHoveredStillIndex(idx)}
                onTouchEnd={() => setHoveredStillIndex(null)}
                className={`relative aspect-[16/10] overflow-hidden bg-surface transition-all duration-300 ${
                  isThisStillHovered ? 'brightness-110 contrast-105 border border-ink' : 'brightness-90 opacity-90'
                }`}
              >
                <img
                  src={stillUrl}
                  alt={`${project.title} still ${idx + 1}`}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isThisStillHovered ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Individual Still Hover GIF Overlay (simple-loading.gif preview) */}
                {isThisStillHovered && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                    <img
                      src="https://ligthelm.work/static/img/simple-loading.gif"
                      alt="Still preview loading"
                      className="w-10 h-10 object-contain filter brightness-120"
                    />
                  </div>
                )}

                {/* Frame Number Tag */}
                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-[9px] font-mono-custom text-neutral-400 rounded">
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
