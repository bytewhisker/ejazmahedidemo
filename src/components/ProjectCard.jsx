import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Edit3 } from 'lucide-react';

export const ProjectCard = ({ project, indexNumber, onClick, isEditMode, onEditProject }) => {
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
        delay: Math.min((indexNumber - 1) * 0.1, 0.8),
        ease: [0.16, 1, 0.3, 1]
      }}
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onTouchStart={() => setIsCardHovered(true)}
      onTouchEnd={() => setIsCardHovered(false)}
      data-cursor="project"
      className={`group cursor-pointer space-y-2 select-none relative ${
        isEditMode ? 'ring-2 ring-accent/40 p-3 rounded-xl bg-surface/30' : ''
      }`}
    >
      {/* Edit Mode Header Overlay */}
      {isEditMode && (
        <div className="flex items-center justify-between bg-accent text-canvas px-3 py-1.5 rounded-lg text-xs font-mono-custom font-bold uppercase tracking-wider mb-2">
          <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 stroke-[3]" />
            <span>DRAG TO REORDER #{indexNumber}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEditProject) onEditProject(project);
            }}
            className="px-2.5 py-1 bg-black text-white hover:bg-black/80 rounded flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
          >
            <Edit3 className="w-3 h-3 text-accent" />
            <span>EDIT DETAILS</span>
          </button>
        </div>
      )}

      {/* MINIMALIST EDITORIAL PROJECT TITLE */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs md:text-sm font-mono-custom tracking-[0.16em] sm:tracking-[0.2em] uppercase font-normal text-ink gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            onClick={(e) => {
              if (isEditMode) e.stopPropagation();
            }}
            onBlur={(e) => {
              if (!isEditMode) return;
              if (onEditProject) {
                onEditProject({ ...project, title: e.target.innerText });
              }
            }}
            className={`truncate transition-colors ${
              isEditMode
                ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/10 px-1 rounded cursor-text'
                : 'group-hover:text-ink-soft'
            }`}
          >
            {project.title}
          </span>
          <span className="text-ink-soft font-mono-custom font-light tracking-widest shrink-0 normal-case">/ {project.category === 'Commercial' ? 'commercial' : 'film'}</span>
        </div>
        {project.comingSoon && (
          <span className="shrink-0 text-[10px] sm:text-[11px] font-mono-custom tracking-[0.2em] text-accent border border-accent/50 px-2 py-0.5">
            COMING SOON
          </span>
        )}
      </div>

      {/* 3 STILL FRAMES CONTAINER — WIDESCREEN FILM STILLS */}
      <div className="relative bg-canvas py-1 transition-colors">
        {project.fullWidthCardStill ? (
          <div
            className={`relative overflow-hidden bg-surface transition-all duration-300 border border-line/40 ${
              isCardHovered
                ? 'brightness-110 contrast-105 border-ink-soft'
                : 'brightness-90 opacity-95'
            }`}
          >
            <img
              src={project.fullWidthCardStill}
              alt={project.title}
              loading="lazy"
              className={`w-full h-auto object-cover transition-transform duration-500 ${
                isCardHovered ? 'scale-[1.02]' : 'scale-100'
              }`}
            />

            {/* GIF Preview Overlay on hover / touch */}
            {isCardHovered && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                <img
                  src="/project-loader.gif"
                  alt="Still preview loading"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-120"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {stills.map((stillUrl, idx) => (
              <div
                key={idx}
                className={`relative aspect-[16/9] overflow-hidden bg-surface transition-all duration-300 border border-line/40 ${
                  isCardHovered
                    ? 'brightness-110 contrast-105 border-ink-soft'
                    : 'brightness-90 opacity-95'
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

                {/* GIF Preview Overlay on hover / touch */}
                {isCardHovered && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                    <img
                      src="/project-loader.gif"
                      alt="Still preview loading"
                      className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-120"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
