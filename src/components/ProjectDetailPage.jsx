import React, { useState, useEffect, useCallback } from 'react';
import { CustomPlayer } from './CustomPlayer';
import { ChevronRight, ChevronLeft, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectDetailPage = ({ project, allProjects, onBack, onSelectProject }) => {
  const isCommercial = project.category?.toLowerCase().includes('commercial');

  // Available tabs: FULL CREDITS, SCREENGRABS, and SET STILLS
  const availableTabs = [
    { id: 'credits', label: 'FULL CREDITS' },
    { id: 'screengrabs', label: `SCREENGRABS (${project.screengrabs?.length || 0})` },
    { id: 'setStills', label: `SET STILLS (${project.setStills?.length || 0})` }
  ];

  const [underVideoTab, setUnderVideoTab] = useState('credits');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxType, setLightboxType] = useState('screengrabs'); // 'screengrabs' or 'setStills'

  useEffect(() => {
    setUnderVideoTab('credits');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project]);

  const activeVideo = project.videos?.[0];

  // Find Prev / Next project
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  // Lightbox helpers
  const activeGallery = lightboxType === 'setStills' ? (project.setStills || []) : (project.screengrabs || []);
  const lightboxOpen = lightboxIndex !== null;
  const totalLightboxImages = activeGallery.length;

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + totalLightboxImages) % totalLightboxImages);
  }, [totalLightboxImages]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % totalLightboxImages);
  }, [totalLightboxImages]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'Escape') { closeLightbox(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goToPrev, goToNext, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  // Explicit text logic: Commercials display Description, Films display Synopsis
  const descriptionText = project.description || project.story?.background || project.story?.creativeProcess || "Commercial brand film directed & photographed by Ejaz Mehedi.";
  const synopsisText = project.synopsis || project.description || project.story?.creativeProcess || project.story?.background || "Feature narrative film photographed by Ejaz Mehedi.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen bg-canvas text-ink pt-2 pb-24 px-4 sm:px-8 md:px-12 font-sans select-none"
    >
      <div className="max-w-[1700px] mx-auto space-y-8 md:space-y-12">
        
        {/* Simple Title Header */}
        <div className="space-y-3 pt-4 sm:pt-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-sans tracking-wide text-ink uppercase">
            {project.title}
          </h1>
          <p className="text-[11px] sm:text-xs font-mono-custom text-muted uppercase tracking-widest pt-1">
            {project.category ? project.category.toUpperCase() : (isCommercial ? 'COMMERCIAL' : 'FILM')}
            {project.client ? ` / ${project.client}` : ''}
            {project.year ? ` — ${project.year}` : ''}
          </p>
        </div>

        {/* Embedded Video Player */}
        {project.comingSoon || !activeVideo ? (
          <div className="w-full aspect-video bg-canvas overflow-hidden flex items-center justify-center select-none">
            <span className="text-lg sm:text-2xl font-mono-custom tracking-[0.3em] uppercase text-muted">
              Coming Soon
            </span>
          </div>
        ) : (
          <div className="w-full bg-black overflow-hidden shadow-2xl">
            <CustomPlayer
              poster={project.poster}
              videoUrl={activeVideo.videoUrl}
              embedUrl={activeVideo.embedUrl}
              vimeoId={activeVideo.vimeoId}
              title={project.title}
            />
          </div>
        )}

        {/* ─── UNDER-VIDEO OVERVIEW (NO DIVIDER LINES) ─── */}
        <div className="pt-2 pb-6">
          {isCommercial ? (
            /* COMMERCIAL OVERVIEW: NO POSTER & NO SYNOPSIS — ONLY DESCRIPTION + DETAILS */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* DESCRIPTION (8 Columns) */}
              <div className="md:col-span-8 space-y-4">
                <h2 className="text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink">
                  DESCRIPTION
                </h2>
                <p className="text-sm sm:text-base leading-relaxed font-sans text-ink-soft font-normal">
                  {descriptionText}
                </p>
              </div>

              {/* ADDITIONAL DETAILS (4 Columns) */}
              <div className="md:col-span-4 space-y-4">
                <h2 className="text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink">
                  ADDITIONAL DETAILS
                </h2>

                <div className="space-y-4 text-xs font-mono-custom">
                  {project.crew?.director && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        DIRECTED BY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew.director}
                      </span>
                    </div>
                  )}

                  {project.crew?.dop && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        CINEMATOGRAPHY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew.dop}
                      </span>
                    </div>
                  )}

                  {project.client && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        AGENCY / CLIENT
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.client}
                      </span>
                    </div>
                  )}

                  {(project.crew?.productionCompany || project.crew?.producer || project.crew?.executiveProducer) && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        PRODUCTION COMPANY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew?.productionCompany || project.crew?.producer || project.crew?.executiveProducer}
                      </span>
                    </div>
                  )}

                  {project.aspectRatio && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        FORMAT / ASPECT RATIO
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.aspectRatio}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* FILM OVERVIEW: 3 COLUMNS (POSTER | SYNOPSIS | ADDITIONAL DETAILS) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* COLUMN 1: POSTER FRAME */}
              <div className="md:col-span-3 lg:col-span-3 space-y-2">
                <div className="w-full aspect-[2/3] overflow-hidden rounded-md bg-surface shadow-xl relative group">
                  <img
                    src={project.poster || project.thumbnail}
                    alt={`${project.title} Official Poster`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* COLUMN 2: SYNOPSIS */}
              <div className="md:col-span-5 lg:col-span-5 space-y-4">
                <h2 className="text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink">
                  SYNOPSIS
                </h2>
                
                <p className="text-sm sm:text-base leading-relaxed font-sans text-ink-soft font-normal">
                  {synopsisText}
                </p>
              </div>

              {/* COLUMN 3: ADDITIONAL DETAILS */}
              <div className="md:col-span-4 lg:col-span-4 space-y-4">
                <h2 className="text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink">
                  ADDITIONAL DETAILS
                </h2>

                <div className="space-y-4 text-xs font-mono-custom">
                  {project.crew?.director && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        DIRECTED BY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew.director}
                      </span>
                    </div>
                  )}

                  {project.crew?.dop && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        CINEMATOGRAPHY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew.dop}
                      </span>
                    </div>
                  )}

                  {project.crew?.starring && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        STARRING
                      </span>
                      <div className="text-xs text-ink-soft font-medium whitespace-pre-line leading-relaxed">
                        {project.crew.starring.split(',').map((name, i) => (
                          <span key={i} className="block">{name.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.client && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        PRESENTED BY / DISTRIBUTOR
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.client}
                      </span>
                    </div>
                  )}

                  {(project.crew?.producer || project.crew?.executiveProducer) && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        PRODUCED BY
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.crew?.producer || project.crew?.executiveProducer}
                      </span>
                    </div>
                  )}

                  {project.aspectRatio && (
                    <div className="space-y-1">
                      <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                        FORMAT / ASPECT RATIO
                      </span>
                      <span className="block text-xs text-ink-soft font-medium">
                        {project.aspectRatio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ─── GALLERY & SUB-SECTIONS (NO DIVIDER LINES) ─── */}
        <div className="space-y-8 pt-4">
          
          {/* Scrollable Tab Navigation Bar (No Border Lines) */}
          <div className="flex items-center justify-start gap-6 md:gap-10 pb-2 text-xs font-mono-custom tracking-[0.2em] uppercase font-bold overflow-x-auto no-scrollbar whitespace-nowrap">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setUnderVideoTab(tab.id)}
                className={`transition-colors py-1 shrink-0 ${
                  underVideoTab === tab.id
                    ? 'text-ink font-bold text-accent'
                    : 'text-muted hover:text-ink-soft'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENT 1: SCREENGRABS */}
          {underVideoTab === 'screengrabs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {project.screengrabs && project.screengrabs.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxType('screengrabs');
                    setLightboxIndex(idx);
                  }}
                  className="group relative aspect-video overflow-hidden bg-surface cursor-pointer transition-all duration-300"
                >
                  <img
                    src={imgUrl}
                    alt={`Screengrab ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB CONTENT 2: SET STILLS */}
          {underVideoTab === 'setStills' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {project.setStills && project.setStills.length > 0 ? (
                project.setStills.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxType('setStills');
                      setLightboxIndex(idx);
                    }}
                    className="group relative aspect-video overflow-hidden bg-surface cursor-pointer transition-all duration-300"
                  >
                    <img
                      src={imgUrl}
                      alt={`Set Still ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs font-mono-custom uppercase tracking-widest text-muted">
                  No set stills currently available for this project.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB CONTENT 3: FULL CREDITS */}
          {underVideoTab === 'credits' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {project.crew && Object.entries(project.crew).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <span className="block text-[10px] font-mono-custom tracking-widest text-muted uppercase">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="block text-xs font-mono-custom text-ink-soft">
                    {val}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

        </div>

        {/* Prev / Next Project Navigation Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-12 text-xs sm:text-sm font-mono-custom font-bold text-ink uppercase tracking-widest">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-2 text-ink font-bold font-mono-custom uppercase tracking-widest truncate max-w-full cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span className="truncate">PREV: {prevProject.title}</span>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-2 text-ink font-bold font-mono-custom uppercase tracking-widest truncate max-w-full cursor-pointer"
          >
            <span className="truncate">NEXT: {nextProject.title}</span>
            <ChevronRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Lightbox Popup — Full Gallery with Left/Right Navigation */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onContextMenu={(e) => e.preventDefault()}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center select-none"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white z-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono-custom tracking-widest z-50">
              {lightboxIndex + 1} / {totalLightboxImages}
            </div>

            {/* Left Arrow */}
            {totalLightboxImages > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
              </button>
            )}

            {/* Right Arrow */}
            {totalLightboxImages > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 text-white/50 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
              </button>
            )}
            
            {/* Image Container */}
            <div 
              className="relative max-w-full max-h-[90vh] flex items-center justify-center px-16 sm:px-24"
              onClick={closeLightbox}
              onContextMenu={(e) => e.preventDefault()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={activeGallery[lightboxIndex]}
                  alt={`Gallery image ${lightboxIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  draggable="false"
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-full max-h-[85vh] object-contain pointer-events-none select-none"
                />
              </AnimatePresence>
              {/* Transparent overlay over image to block right-click 'Save Image As' */}
              <div 
                onContextMenu={(e) => e.preventDefault()} 
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 z-20 cursor-default"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
