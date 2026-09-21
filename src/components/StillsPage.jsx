import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STILLS_PROJECTS } from '../data/stillsData';

export const StillsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'index'

  // Synchronize state with URL query parameters (/stills?project=slug)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const projectSlug = params.get('project');
      if (projectSlug) {
        const found = STILLS_PROJECTS.find(
          (p) => p.slug === projectSlug || p.id === projectSlug
        );
        if (found) {
          setSelectedProject(found);
          setCurrentImageIndex(0);
          setViewMode('gallery');
          return;
        }
      }
      setSelectedProject(null);
      setCurrentImageIndex(0);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setViewMode('gallery');
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.history.pushState(null, '', `/stills?project=${project.slug}`);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    window.history.pushState(null, '', '/stills');
  };

  const handleNextImage = () => {
    if (!selectedProject || !selectedProject.images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const handlePrevImage = () => {
    if (!selectedProject || !selectedProject.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProject.images.length - 1 : prev - 1
    );
  };

  // Keyboard navigation when in project detail
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'Escape') {
        handleBackToList();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-black text-white font-sans select-none antialiased">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          /* ========================================================= */
          /* 1. STILLS LIST VIEW (MATCHES SCREENSHOT 1)               */
          /* ========================================================= */
          <motion.div
            key="stills-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen px-6 sm:px-12 md:px-20 lg:px-28 py-8 md:py-12 max-w-7xl mx-auto flex flex-col"
          >
            {/* Top Navigation: Lime Green Ejaz Mehedi Linking to Main Website */}
            <header className="flex items-center">
              <a
                href="/"
                className="text-[#b5ff32] hover:opacity-80 transition-opacity font-bold text-lg sm:text-xl md:text-[22px] tracking-tight leading-snug inline-block cursor-pointer"
              >
                Ejaz Mehedi
              </a>
            </header>

            {/* List of Projects (White Bold Text) */}
            <main className="mt-10 md:mt-14 max-w-3xl">
              <ul className="space-y-4 md:space-y-4.5">
                {STILLS_PROJECTS.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => handleSelectProject(project)}
                      className="text-left font-bold text-lg sm:text-xl md:text-[22px] tracking-tight leading-snug text-white hover:text-[#b5ff32] transition-colors cursor-pointer block"
                    >
                      {project.title}
                    </button>
                  </li>
                ))}
              </ul>
            </main>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* 2. STILLS DETAIL VIEW (MATCHES SCREENSHOT)               */
          /* ========================================================= */
          <motion.div
            key={`stills-detail-${selectedProject.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full min-h-screen bg-black text-white relative flex flex-col md:block"
          >
            {/* Desktop Fixed Left Column (Anchored at Top & Bottom) */}
            <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 lg:w-72 p-8 lg:p-12 flex-col justify-between z-30 pointer-events-none">
              {/* Top-Left: < Back button */}
              <div className="pointer-events-auto">
                <button
                  onClick={handleBackToList}
                  data-cursor-hover="true"
                  className="font-bold text-base lg:text-lg text-white hover:text-[#b5ff32] transition-colors cursor-pointer inline-flex items-center gap-1 group"
                >
                  <span className="group-hover:-translate-x-0.5 transition-transform">&lt;</span>
                  <span>Back</span>
                </button>
              </div>

              {/* Bottom-Left: Project Title & Gallery / Index Switcher */}
              <div className="pointer-events-auto space-y-2">
                <h2 className="font-bold text-base lg:text-lg text-white tracking-tight leading-snug">
                  {selectedProject.title}
                </h2>
                {selectedProject.subtitle && (
                  <p className="text-xs text-neutral-400 leading-snug">
                    {selectedProject.subtitle}
                  </p>
                )}
                {selectedProject.publisher && selectedProject.year && (
                  <p className="text-xs text-neutral-500 leading-snug">
                    {selectedProject.publisher}, {selectedProject.year}.
                  </p>
                )}

                {/* Gallery / Index Toggle (Matches Reference) */}
                <div className="pt-2 text-sm text-white flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('gallery')}
                    data-cursor-hover="true"
                    className={`cursor-pointer transition-colors ${
                      viewMode === 'gallery'
                        ? 'font-bold underline text-[#b5ff32]'
                        : 'font-normal text-white hover:text-neutral-300'
                    }`}
                  >
                    Gallery
                  </button>
                  <span className="text-neutral-600">/</span>
                  <button
                    onClick={() => setViewMode('index')}
                    data-cursor-hover="true"
                    className={`cursor-pointer transition-colors ${
                      viewMode === 'index'
                        ? 'font-bold underline text-[#b5ff32]'
                        : 'font-normal text-white hover:text-neutral-300'
                    }`}
                  >
                    Index
                  </button>
                </div>
              </div>
            </aside>

            {/* Mobile Header (< md) */}
            <header className="flex md:hidden items-center justify-between px-6 py-6 border-b border-neutral-900 sticky top-0 bg-black/90 backdrop-blur-md z-30">
              <button
                onClick={handleBackToList}
                data-cursor-hover="true"
                className="font-bold text-sm text-white hover:text-[#b5ff32] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>&lt;</span>
                <span>Back</span>
              </button>
              <div className="text-xs font-mono text-neutral-500">
                {viewMode === 'gallery'
                  ? `${currentImageIndex + 1} / ${selectedProject.images.length}`
                  : `${selectedProject.images.length} images`}
              </div>
            </header>

            {/* Main Area */}
            <main
              className={`md:ml-64 lg:ml-72 min-h-screen p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col ${
                viewMode === 'gallery' ? 'justify-center' : 'justify-start pt-8 md:pt-10'
              }`}
            >
              {viewMode === 'gallery' ? (
                /* ---------------- GALLERY VIEW ---------------- */
                <div className="w-full flex-1 flex flex-col justify-center items-center relative py-6">
                  {/* Top-Right Counter on Desktop */}
                  <div className="hidden md:block absolute top-0 right-0 text-xs font-mono text-neutral-500">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>

                  {/* Large Featured Image (Click to cycle next) */}
                  <div
                    onClick={handleNextImage}
                    role="button"
                    data-cursor-hover="true"
                    title="Click to view next image"
                    className="relative cursor-pointer group max-w-full max-h-[75vh] flex items-center justify-center my-auto"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={selectedProject.images[currentImageIndex]?.url}
                        alt={selectedProject.images[currentImageIndex]?.caption || selectedProject.title}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        draggable={false}
                        className="max-w-full max-h-[75vh] object-contain shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-[2px]"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Caption & Navigation Hint */}
                  <div className="w-full max-w-2xl mt-4 flex items-center justify-between text-xs text-neutral-500">
                    <p className="italic truncate pr-4">
                      {selectedProject.images[currentImageIndex]?.caption || ''}
                    </p>
                    <span className="hidden sm:inline whitespace-nowrap text-neutral-600">
                      Click image or press &rarr; to advance
                    </span>
                  </div>
                </div>
              ) : (
                /* ---------------- INDEX VIEW (MATCHES SCREENSHOT) ---------------- */
                <div className="w-full pb-16">
                  {/* Multi-row photography grid (one by one, then bottom, then bottom) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {selectedProject.images.map((img, idx) => (
                      <div
                        key={idx}
                        role="button"
                        data-cursor-hover="true"
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setViewMode('gallery');
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="flex items-center justify-center p-0 cursor-pointer group transition-opacity duration-200 hover:opacity-50 min-h-[160px] sm:min-h-[220px] lg:min-h-[280px]"
                        title={img.caption || `Image ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Image ${idx + 1}`}
                          loading="lazy"
                          className="max-h-[240px] sm:max-h-[280px] lg:max-h-[320px] w-auto h-auto max-w-full object-contain filter transition-all duration-200 select-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Mobile Bottom Bar (< md) */}
            <footer className="flex md:hidden flex-col gap-2 px-6 py-5 border-t border-neutral-900 bg-black/95 backdrop-blur-md sticky bottom-0 z-30">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-white tracking-tight">
                  {selectedProject.title}
                </h2>
                <div className="text-xs text-white flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('gallery')}
                    className={viewMode === 'gallery' ? 'font-bold underline text-[#b5ff32]' : 'text-neutral-400'}
                  >
                    Gallery
                  </button>
                  <span className="text-neutral-600">/</span>
                  <button
                    onClick={() => setViewMode('index')}
                    className={viewMode === 'index' ? 'font-bold underline text-[#b5ff32]' : 'text-neutral-400'}
                  >
                    Index
                  </button>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
