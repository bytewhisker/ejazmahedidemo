import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectListView = ({ projects, onSelectProject }) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Position offset to right side of cursor
    const isRightHalf = x > window.innerWidth / 2;
    const offsetX = isRightHalf ? -520 : 60;
    
    // Clamp vertical position safely
    const clampedY = Math.min(Math.max(y - 140, 60), window.innerHeight - 320);

    setMousePos({
      x: x + offsetX,
      y: clampedY
    });
  };

  return (
    <div className="w-full relative select-none">
      {/* Plain Editorial Film List — Hover strictly limited to text bounding box (w-fit) */}
      <div className="flex flex-col space-y-1 py-2">
        {projects.map((project) => {
          const isHovered = hoveredProject?.id === project.id;

          return (
            <div
              key={project.id}
              className="py-3.5 flex items-center"
            >
              {/* Only Film Title and Director Name — Hover limited strictly to text area */}
              <div
                onClick={() => onSelectProject(project)}
                onMouseEnter={(e) => {
                  setHoveredProject(project);
                  handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredProject(null)}
                data-cursor="project"
                data-cursor-text="OPEN"
                data-cursor-subtext={project.category}
                className="group cursor-pointer inline-flex items-center gap-3 w-fit transition-colors"
              >
                <h3 className={`text-base sm:text-lg md:text-xl font-mono-custom tracking-[0.18em] uppercase font-normal transition-all duration-200 truncate ${
                  isHovered 
                    ? 'text-ink translate-x-2 font-medium' 
                    : 'text-muted/60 group-hover:text-ink'
                }`}>
                  {project.title}
                </h3>

                <span className={`text-xs font-mono-custom lowercase transition-colors truncate hidden sm:inline ${
                  isHovered ? 'text-ink-soft' : 'text-muted/80'
                }`}>
                  — {project.category === 'Commercial' ? 'commercial' : 'film'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain Floating Widescreen Video Preview Card */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: mousePos.x,
              y: mousePos.y
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300, 
              mass: 0.5 
            }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              pointerEvents: 'none',
              zIndex: 9999
            }}
            className="hidden md:block w-[460px] lg:w-[500px] bg-canvas shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-line/60 overflow-hidden"
          >
            {/* Plain 16:9 Widescreen Image Frame with Central GIF Preview Overlay */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={hoveredProject.hoverStills?.[0] || hoveredProject.thumbnail}
                alt={hoveredProject.title}
                className="w-full h-full object-cover brightness-105 contrast-105"
                onError={(e) => {
                  e.currentTarget.src = hoveredProject.thumbnail;
                }}
              />

              {/* Central GIF Preview Overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
                <img
                  src="/project-loader.gif"
                  alt="Video Preview Animation"
                  className="w-12 h-12 object-contain filter brightness-125"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
