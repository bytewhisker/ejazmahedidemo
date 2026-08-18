import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ProjectCard = ({ project, indexNumber, onClick }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  const stills = project.hoverStills && project.hoverStills.length === 3
    ? project.hoverStills
    : [
        project.thumbnail,
        project.poster || project.thumbnail,
        (project.screengrabs && project.screengrabs[0]) || project.thumbnail
      ];

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
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onTouchStart={() => setIsCardHovered(true)}
      onTouchEnd={() => setIsCardHovered(false)}
      data-cursor="project"
      data-cursor-text="VIEW"
      data-cursor-subtext={project.category}
      className="group cursor-pointer space-y-2 select-none"
    >
      {/* CHRIS MACARI BOLD PROJECT TITLE */}
      <div className="flex items-center justify-between text-xs font-mono-custom tracking-[0.18em] uppercase font-bold text-ink">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate group-hover:text-ink-soft transition-colors">{project.title}</span>
        </div>
        <span className="text-[10px] text-muted font-mono-custom font-bold tracking-widest shrink-0">{project.category}</span>
      </div>

      {/* 3 Still Frames Container — Overall 3 stills hover preview */}
      <div className="relative bg-canvas p-1 transition-colors">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-1">
          {stills.map((stillUrl, idx) => (
            <div
              key={idx}
              className={`relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-surface transition-all duration-300 ${
                isCardHovered
                  ? 'brightness-110 contrast-105'
                  : 'brightness-90 opacity-90'
              }`}
            >
              <img
                src={stillUrl}
                alt={`${project.title} still ${idx + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = project.thumbnail || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop";
                }}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isCardHovered ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* GIF Preview Overlay — Plays across all 3 stills together on overall hover */}
              {isCardHovered && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                  <img
                    src="https://ligthelm.work/static/img/simple-loading.gif"
                    alt="Still preview loading"
                    className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-120"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
