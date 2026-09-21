import React, { useState, useEffect, useCallback } from 'react';
import { useCMS } from '../context/CMSContext';
import { CustomPlayer } from './CustomPlayer';
import { ChevronRight, ChevronLeft, Maximize2, X, Edit3, Plus, Trash2, RefreshCw, Zap, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const HeroStillsSlideshow = ({ slides: rawSlides, title, isFullWidth }) => {
  const slides = Array.from(new Set((rawSlides || []).filter(Boolean)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-canvas overflow-hidden flex items-center justify-center select-none">
        <span className="text-lg sm:text-2xl font-mono-custom tracking-[0.3em] uppercase text-muted">
          Coming Soon
        </span>
      </div>
    );
  }

  if (slides.length === 1) {
    return (
      <div className={`w-full bg-surface overflow-hidden shadow-2xl relative ${isFullWidth ? 'h-auto max-h-[85vh]' : 'aspect-video'}`}>
        <img
          src={slides[0]}
          alt={title}
          className={`w-full ${isFullWidth ? 'h-auto max-h-[85vh] object-contain' : 'h-full object-cover'}`}
        />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full bg-surface overflow-hidden shadow-2xl relative group ${isFullWidth ? 'h-auto max-h-[85vh]' : 'aspect-video'}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={slides[currentIndex]}
          src={slides[currentIndex]}
          alt={`${title} Still ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className={`w-full ${isFullWidth ? 'h-auto max-h-[85vh] object-contain' : 'h-full object-cover'}`}
        />
      </AnimatePresence>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>


    </div>
  );
};

export const ProjectDetailPage = ({ project, allProjects, activeFilter, onBack, onSelectProject, isEditMode }) => {
  const { updateProject, reorderStills, resolveImagePath } = useCMS();
  const isCommercial = project.category?.toLowerCase().includes('commercial');
  const [inlineNewStill, setInlineNewStill] = useState('');

  // Available tabs: DESCRIPTION, CREDITS, SCREENGRABS, and SET STILLS
  const availableTabs = [
    { id: 'description', label: 'DESCRIPTION' },
    { id: 'credits', label: 'CREDITS' },
    (isEditMode || (project.screengrabs && project.screengrabs.length > 0)) && { id: 'screengrabs', label: `SCREENGRABS (${project.screengrabs?.length || 0})` },
    (isEditMode || (project.setStills && project.setStills.length > 0)) && { id: 'setStills', label: `SET STILLS (${project.setStills?.length || 0})` }
  ].filter(Boolean);

  const [underVideoTab, setUnderVideoTab] = useState('description');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxType, setLightboxType] = useState('screengrabs'); // 'screengrabs' or 'setStills'

  const [replacingStill, setReplacingStill] = useState(null); // { type: 'screengrabs' | 'setStills', index: number, currentUrl: string }
  const [replacingInput, setReplacingInput] = useState('');

  const handleConfirmReplace = () => {
    if (!replacingStill || !replacingInput.trim()) return;
    const clean = replacingInput.trim();
    const formatted = clean.startsWith('/') || clean.startsWith('http')
      ? clean
      : `/projects/${project.slug}/${clean}`;

    if (replacingStill.type === 'screengrabs') {
      const updated = [...(project.screengrabs || [])];
      updated[replacingStill.index] = formatted;
      updateProject(project.id, { screengrabs: updated });
    } else {
      const updated = [...(project.setStills || [])];
      updated[replacingStill.index] = formatted;
      updateProject(project.id, { setStills: updated });
    }
    setReplacingStill(null);
    setReplacingInput('');
  };

  useEffect(() => {
    setUnderVideoTab('description');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project?.id]);

  const activeVideo = project.videos?.[0];

  // Find Prev / Next project (category-scoped navigation: Films cycle ONLY Films, Commercials cycle ONLY Commercials)
  const currentCategory = (project.category || '').toLowerCase();
  const categoryProjects = (allProjects || []).filter((p) => {
    if (activeFilter === 'films' || currentCategory.includes('film')) {
      return (p.category || '').toLowerCase().includes('film');
    }
    if (activeFilter === 'commercial' || currentCategory.includes('commercial')) {
      return (p.category || '').toLowerCase().includes('commercial');
    }
    return true;
  });

  let sortedNavList = categoryProjects.length > 0 ? categoryProjects : allProjects;
  if (activeFilter === 'films' || currentCategory.includes('film')) {
    sortedNavList = [...sortedNavList].sort((a, b) => {
      const aIsMoving = a.id === 'moving-bangladesh' || a.slug === 'moving-bangladesh';
      const bIsMoving = b.id === 'moving-bangladesh' || b.slug === 'moving-bangladesh';
      if (aIsMoving) return -1;
      if (bIsMoving) return 1;
      return 0;
    });
  }

  const currentIndex = sortedNavList.findIndex((p) => p.id === project.id);
  const validIndex = currentIndex !== -1 ? currentIndex : 0;
  const prevProject = sortedNavList[(validIndex - 1 + sortedNavList.length) % sortedNavList.length];
  const nextProject = sortedNavList[(validIndex + 1) % sortedNavList.length];

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
  const descriptionText = (project.id === 'mai-natures-new-address' || project.slug === 'mai-natures-new-address')
    ? (project.description || "A brand campaign for Madinat Al Irfan - An integrated urban ecosystem.")
    : (project.description || project.story?.background || project.story?.creativeProcess || "Commercial brand film directed & photographed by Ejaz Mehedi.");
  const synopsisText = project.synopsis || project.description || project.story?.creativeProcess || project.story?.background || "Feature narrative film photographed by Ejaz Mehedi.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen bg-canvas text-ink pt-2 pb-24 px-4 sm:px-8 md:px-12 font-sans select-none"
    >
      <div className="w-full space-y-8 md:space-y-12">
        
        {/* Simple Title Header with Direct Inline Editing */}
        <div className="pt-4 sm:pt-6 relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
          <h1
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              if (!isEditMode) return;
              updateProject(project.id, { title: e.target.innerText });
            }}
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium font-sans tracking-wide text-ink uppercase ${
              isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text' : ''
            }`}
          >
            {project.title}
          </h1>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              if (!isEditMode) return;
              const text = e.target.innerText;
              let category = project.category;
              let client = project.client;
              let year = project.year;

              const slashParts = text.split('/');
              if (slashParts[0]) {
                category = slashParts[0].trim();
              }
              if (slashParts[1]) {
                const dashParts = slashParts[1].split(/—|-/);
                client = dashParts[0] ? dashParts[0].trim() : '';
                if (dashParts[1]) {
                  year = dashParts[1].trim();
                }
              }
              updateProject(project.id, { category, client, year });
            }}
            className={`text-[11px] sm:text-xs font-mono-custom text-muted uppercase tracking-widest pt-0.5 ${
              isEditMode ? 'outline-dashed outline-1 outline-accent/40 hover:outline-accent p-1 rounded cursor-text' : ''
            }`}
          >
            {!isCommercial ? (
              project.id === 'last-night-in-korea' || project.slug === 'last-night-in-korea' ? (
                `FILMS / ${project.client ? project.client.toUpperCase() : 'CHANEL X BIFF ASIAN FILM ACADEMY'}`
              ) : (
                `FILMS${project.crew?.director ? ` / DIR. ${project.crew.director.replace(/\n/g, ' & ').toUpperCase()}` : ''}`
              )
            ) : (
              <>
                {project.category ? project.category.toUpperCase() : 'COMMERCIAL'}
                {project.client ? ` / ${project.client}` : ''}
              </>
            )}
          </p>
          </div>

          {/* Status Badge in Lime Green */}
          {(project.status || ['maktoob', 'mai-natures-new-address', 'moving-bangladesh'].includes(project.id) || ['maktoob', 'mai-natures-new-address', 'moving-bangladesh'].includes(project.slug)) && (
            <div className="pb-1">
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  if (!isEditMode) return;
                  const val = e.target.innerText.replace(/^Status\s*-\s*/i, '').trim();
                  updateProject(project.id, { status: val });
                }}
                className={`text-[11px] sm:text-xs font-mono-custom uppercase tracking-widest text-accent font-medium inline-block ${
                  isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text' : ''
                }`}
              >
                Status - {project.status || (project.id === 'maktoob' || project.slug === 'maktoob' ? 'On Festivals Circuit' : 'In Post-Production')}
              </span>
            </div>
          )}

          {/* Quick Vimeo ID Bar in Edit Mode */}
          {isEditMode && (
            <div className="flex items-center gap-2 pt-2 text-xs font-mono-custom text-accent font-bold">
              <span>🎥 VIMEO VIDEO ID:</span>
              <input
                type="text"
                value={activeVideo?.vimeoId || ''}
                onChange={(e) => {
                  const vId = e.target.value.trim();
                  const updatedVids = vId ? [
                    {
                      id: 'main',
                      labelKey: 'mainFilm',
                      title: project.title,
                      vimeoId: vId,
                      embedUrl: `https://player.vimeo.com/video/${vId}?title=0&byline=0&portrait=0&badge=0&autopause=0`
                    }
                  ] : [];
                  updateProject(project.id, { videos: updatedVids });
                }}
                placeholder="Enter Vimeo ID e.g. 1220862850"
                className="px-2 py-1 bg-surface border border-accent text-accent rounded font-mono-custom text-xs"
              />
            </div>
          )}
        </div>

        {/* Embedded Video Player / Hero Image Slideshow */}
        {activeVideo ? (
          <div className="w-full bg-black overflow-hidden shadow-2xl">
            <CustomPlayer
              poster={project.poster}
              videoUrl={activeVideo.videoUrl}
              embedUrl={activeVideo.embedUrl}
              vimeoId={activeVideo.vimeoId}
              title={project.title}
            />
          </div>
        ) : (
          <HeroStillsSlideshow
            slides={project.heroSlideshow && project.heroSlideshow.length > 0
              ? project.heroSlideshow
              : Array.from(new Set([
                  ...(project.hoverStills || []),
                  project.heroStill,
                  project.poster,
                  ...(project.screengrabs || []),
                  ...(project.setStills || [])
                ].filter(Boolean)))}
            title={project.title}
            isFullWidth={project.fullWidthHero || project.fullWidthScreengrabs}
          />
        )}

        {/* ─── GALLERY & SUB-SECTIONS (TABS) ─── */}
        <div className="space-y-8 pt-2">
          
          {/* Scrollable Tab Navigation Bar */}
          <div className="flex items-center justify-start gap-6 md:gap-10 pb-2 text-xs font-mono-custom tracking-[0.2em] uppercase font-bold overflow-x-auto no-scrollbar whitespace-nowrap border-b border-line/30">
            {availableTabs.map((tab) => {
              const displayLabel = tab.id === 'description'
                ? (project.labels?.descriptionTab || 'DESCRIPTION')
                : tab.id === 'credits'
                ? (project.labels?.creditsTab || 'CREDITS')
                : tab.id === 'screengrabs'
                ? `${project.labels?.screengrabsTab || 'SCREENGRABS'} (${project.screengrabs?.length || 0})`
                : `${project.labels?.setStillsTab || 'SET STILLS'} (${project.setStills?.length || 0})`;

              return (
                <button
                  key={tab.id}
                  onClick={() => setUnderVideoTab(tab.id)}
                  className={`transition-colors py-2 shrink-0 border-b-2 -mb-[9px] ${
                    underVideoTab === tab.id
                      ? 'text-accent border-accent font-bold'
                      : 'text-muted hover:text-ink-soft border-transparent'
                  }`}
                >
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (!isEditMode) return;
                      const raw = e.target.innerText.replace(/\s*\(\d+\)$/, '').trim();
                      const keyMap = {
                        description: 'descriptionTab',
                        credits: 'creditsTab',
                        screengrabs: 'screengrabsTab',
                        setStills: 'setStillsTab'
                      };
                      updateProject(project.id, {
                        labels: { ...(project.labels || {}), [keyMap[tab.id]]: raw }
                      });
                    }}
                    className={isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text' : ''}
                  >
                    {displayLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT 1: DESCRIPTION / SYNOPSIS */}
          {underVideoTab === 'description' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="pt-2"
            >
              {isCommercial ? (
                /* COMMERCIAL DESCRIPTION & DETAILS */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="md:col-span-7 space-y-3">
                    <h2
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        updateProject(project.id, {
                          labels: { ...(project.labels || {}), descriptionHeading: e.target.innerText.trim() }
                        });
                      }}
                      className={`text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text inline-block' : ''
                      }`}
                    >
                      {project.labels?.descriptionHeading || 'DESCRIPTION'}
                    </h2>
                    <p
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        const newText = e.target.innerText;
                        updateProject(project.id, { description: newText, synopsis: newText });
                      }}
                      className={`text-sm sm:text-base leading-relaxed font-sans text-ink-soft font-normal ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-2 rounded cursor-text' : ''
                      }`}
                    >
                      {descriptionText}
                    </p>
                  </div>

                  <div className="md:col-span-5 space-y-3">
                    <h2
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        updateProject(project.id, {
                          labels: { ...(project.labels || {}), detailsHeading: e.target.innerText.trim() }
                        });
                      }}
                      className={`text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text inline-block' : ''
                      }`}
                    >
                      {project.labels?.detailsHeading || 'ADDITIONAL DETAILS'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-custom">
                      <div className="space-y-1">
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), directorLabel: e.target.innerText.trim() } })}
                          className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.labels?.directorLabel || 'DIRECTED BY'}
                        </span>
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            updateProject(project.id, { crew: { ...project.crew, director: e.target.innerText } });
                          }}
                          className={`block text-xs text-ink-soft font-medium ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.crew?.director || (isEditMode ? 'Director Name' : '')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), dopLabel: e.target.innerText.trim() } })}
                          className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.labels?.dopLabel || 'DIRECTOR OF PHOTOGRAPHY'}
                        </span>
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            updateProject(project.id, { crew: { ...project.crew, dop: e.target.innerText } });
                          }}
                          className={`block text-xs text-ink-soft font-medium ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.crew?.dop || (isEditMode ? 'Cinematographer Name' : '')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), clientLabel: e.target.innerText.trim() } })}
                          className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.labels?.clientLabel || 'AGENCY / CLIENT'}
                        </span>
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            updateProject(project.id, { client: e.target.innerText });
                          }}
                          className={`block text-xs text-ink-soft font-medium ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.client || (isEditMode ? 'Client Name' : '')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), productionLabel: e.target.innerText.trim() } })}
                          className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.labels?.productionLabel || 'PRODUCTION COMPANY'}
                        </span>
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            updateProject(project.id, { crew: { ...project.crew, productionCompany: e.target.innerText } });
                          }}
                          className={`block text-xs text-ink-soft font-medium ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                          }`}
                        >
                          {project.crew?.productionCompany || project.crew?.producer || project.crew?.executiveProducer || (isEditMode ? 'Production House' : '')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FILM SYNOPSIS & DETAILS */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="md:col-span-3 lg:col-span-3 space-y-2">
                    <div className="w-full overflow-hidden rounded-md bg-surface shadow-xl relative group">
                      <img
                        src={project.poster || project.thumbnail}
                        alt={`${project.title} Official Poster`}
                        className="w-full h-auto object-contain block group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-5 lg:col-span-5 space-y-3">
                    <h2
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        updateProject(project.id, {
                          labels: { ...(project.labels || {}), synopsisHeading: e.target.innerText.trim() }
                        });
                      }}
                      className={`text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text inline-block' : ''
                      }`}
                    >
                      {project.labels?.synopsisHeading || 'SYNOPSIS'}
                    </h2>
                    <p
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        const newText = e.target.innerText;
                        updateProject(project.id, { synopsis: newText, description: newText });
                      }}
                      className={`text-sm sm:text-base leading-relaxed font-sans text-ink-soft font-normal ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-2 rounded cursor-text' : ''
                      }`}
                    >
                      {synopsisText}
                    </p>
                    {project.story?.background && project.story.background !== synopsisText && (
                      <div className="pt-4 space-y-3">
                        <h2
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            updateProject(project.id, {
                              labels: { ...(project.labels || {}), infoHeading: e.target.innerText.trim() }
                            });
                          }}
                          className={`text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text inline-block' : ''
                          }`}
                        >
                          {project.labels?.infoHeading || 'INFORMATION'}
                        </h2>
                        <p
                          contentEditable={isEditMode}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            if (!isEditMode) return;
                            const newText = e.target.innerText;
                            updateProject(project.id, { story: { ...(project.story || {}), background: newText } });
                          }}
                          className={`text-sm sm:text-base leading-relaxed font-sans text-ink-soft font-normal whitespace-pre-line ${
                            isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-2 rounded cursor-text' : ''
                          }`}
                        >
                          {project.story.background}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4 lg:col-span-4 space-y-3">
                    <h2
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        updateProject(project.id, {
                          labels: { ...(project.labels || {}), detailsHeading: e.target.innerText.trim() }
                        });
                      }}
                      className={`text-[11px] font-mono-custom tracking-[0.2em] uppercase font-bold text-ink ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text inline-block' : ''
                      }`}
                    >
                      {project.labels?.detailsHeading || 'ADDITIONAL DETAILS'}
                    </h2>
                    <div className="space-y-4 text-xs font-mono-custom">
                      {(project.crew?.director || project.crew?.writerDirector || project.crew?.writerDirectorEditorVfx || project.crew?.writtenDirectedBy || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), directorLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.directorLabel || 'DIRECTED BY'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...project.crew, director: e.target.innerText } })}
                            className={`block text-xs text-ink-soft font-medium ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.director || project.crew?.writerDirector || project.crew?.writerDirectorEditorVfx || project.crew?.writtenDirectedBy || (isEditMode ? 'Director Name' : '')}
                          </span>
                        </div>
                      )}

                      {(project.crew?.writer || project.crew?.writtenBy || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), writerLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.writerLabel || 'WRITTEN BY'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...(project.crew || {}), writer: e.target.innerText } })}
                            className={`block text-xs text-ink-soft font-medium whitespace-pre-line ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.writer || project.crew?.writtenBy || (isEditMode ? 'Writer Name' : '')}
                          </span>
                        </div>
                      )}

                      {(project.crew?.dop || project.crew?.cinematographer || project.crew?.cinematography || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), dopLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.dopLabel || 'DIRECTOR OF PHOTOGRAPHY'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...project.crew, dop: e.target.innerText } })}
                            className={`block text-xs text-ink-soft font-medium ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.dop || project.crew?.cinematographer || project.crew?.cinematography || (isEditMode ? 'Cinematographer Name' : '')}
                          </span>
                        </div>
                      )}

                      {(project.crew?.starring || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), starringLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.starringLabel || 'STARRING'}
                          </span>
                          <div
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...project.crew, starring: e.target.innerText } })}
                            className={`text-xs text-ink-soft font-medium leading-relaxed ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.starring || (isEditMode ? 'Cast Names' : '')}
                          </div>
                        </div>
                      )}

                      {(project.crew?.executiveProducer || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), executiveProducerLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.executiveProducerLabel || project.labels?.distributorLabel || 'EXECUTIVE PRODUCER'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...(project.crew || {}), executiveProducer: e.target.innerText } })}
                            className={`block text-xs text-ink-soft font-medium whitespace-pre-line ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.executiveProducer || (isEditMode ? 'Executive Producer' : '')}
                          </span>
                        </div>
                      )}

                      {(project.crew?.producer || project.crew?.producers || project.crew?.production || isEditMode) && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), producerLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.producerLabel || 'PRODUCED BY'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { crew: { ...(project.crew || {}), producer: e.target.innerText } })}
                            className={`block text-xs text-ink-soft font-medium whitespace-pre-line ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.crew?.producer || project.crew?.producers || project.crew?.production || (isEditMode ? 'Producer Name' : '')}
                          </span>
                        </div>
                      )}

                      {!isCommercial && (
                        <div className="space-y-1">
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { labels: { ...(project.labels || {}), aspectRatioLabel: e.target.innerText.trim() } })}
                            className={`block text-[10px] tracking-widest text-muted uppercase font-bold ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.labels?.aspectRatioLabel || 'FORMAT / ASPECT RATIO'}
                          </span>
                          <span
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => isEditMode && updateProject(project.id, { aspectRatio: e.target.innerText })}
                            className={`block text-xs text-ink-soft font-medium ${
                              isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                            }`}
                          >
                            {project.aspectRatio || '2.39:1 Anamorphic'}
                          </span>
                        </div>
                      )}

                      {/* Custom Dynamic Crew Entries */}
                      {project.crew && Object.entries(project.crew).map(([key, value]) => {
                        if (!value) return null;
                        const standardKeys = ['director', 'writer', 'writtenBy', 'writerDirector', 'writerDirectorEditorVfx', 'writtenDirectedBy', 'dop', 'cinematographer', 'cinematography', 'starring', 'executiveProducer', 'producer', 'producers', 'production', 'productionCompany', 'agency', 'client'];
                        if (standardKeys.includes(key)) return null;

                        const formattedLabel = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .toUpperCase();

                        return (
                          <div key={key} className="space-y-1">
                            <span className="block text-[10px] tracking-widest text-muted uppercase font-bold">
                              {formattedLabel}
                            </span>
                            <span
                              contentEditable={isEditMode}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => {
                                if (!isEditMode) return;
                                updateProject(project.id, {
                                  crew: { ...(project.crew || {}), [key]: e.target.innerText }
                                });
                              }}
                              className={`block text-xs text-ink-soft font-medium whitespace-pre-line ${
                                isEditMode ? 'outline-dashed outline-1 outline-accent/40 bg-accent/5 p-0.5 rounded cursor-text' : ''
                              }`}
                            >
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB CONTENT 1: SCREENGRABS */}
          {underVideoTab === 'screengrabs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* On-Page Edit Toolbar for Screengrabs */}
              {isEditMode && (
                <div className="p-3 bg-accent/10 border border-accent/40 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono-custom text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-bold text-accent uppercase tracking-wider">EDIT SCREENGRABS GALLERY</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={inlineNewStill}
                      onChange={(e) => setInlineNewStill(e.target.value)}
                      placeholder="e.g. still-07.png or my-pic.jpg"
                      className="px-3 py-1.5 bg-canvas border border-line text-ink text-xs font-mono-custom rounded-md w-48 sm:w-64 focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => {
                        if (!inlineNewStill.trim()) return;
                        const clean = inlineNewStill.trim();
                        const formatted = clean.startsWith('/') || clean.startsWith('http')
                          ? clean
                          : `/projects/${project.slug}/${clean}`;
                        const current = project.screengrabs || [];
                        updateProject(project.id, { screengrabs: [...current, formatted] });
                        setInlineNewStill('');
                      }}
                      className="px-3 py-1.5 bg-accent text-canvas font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Still</span>
                    </button>
                    <button
                      onClick={() => {
                        const autoStills = [
                          `/projects/${project.slug}/still-01.png`,
                          `/projects/${project.slug}/still-02.png`,
                          `/projects/${project.slug}/still-03.png`,
                          `/projects/${project.slug}/still-04.png`,
                          `/projects/${project.slug}/still-05.png`,
                          `/projects/${project.slug}/still-06.png`
                        ];
                        updateProject(project.id, { screengrabs: autoStills });
                      }}
                      className="px-3 py-1.5 bg-accent/20 hover:bg-accent/40 text-accent font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer"
                      title="Auto-sync standard Hostinger folder filenames"
                    >
                      <Zap className="w-3.5 h-3.5 fill-accent" />
                      <span>Auto-Sync Stills</span>
                    </button>
                  </div>
                </div>
              )}

              <div className={project.fullWidthScreengrabs ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5 md:gap-2"}>
                {project.screengrabs && project.screengrabs.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden bg-black/30 flex items-center justify-center transition-all duration-300 ${
                      project.fullWidthScreengrabs ? "w-full h-auto" : "aspect-video"
                    } ${isEditMode ? 'outline-dashed outline-2 outline-accent/80 p-0.5' : 'cursor-pointer'}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Screengrab ${idx + 1}`}
                      loading="lazy"
                      className={`w-full ${project.fullWidthScreengrabs ? "h-auto object-contain" : "h-full object-contain sm:object-cover"} ${!isEditMode ? 'group-hover:scale-[1.02] transition-transform duration-500' : ''}`}
                      onError={(e) => { e.target.src = '/projects/moshari/still-01.png'; }}
                    />

                    {/* View mode lightbox trigger */}
                    {!isEditMode && (
                      <div
                        onClick={() => {
                          setLightboxType('screengrabs');
                          setLightboxIndex(idx);
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Edit mode hover overlay toolbar */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/80 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20 font-mono-custom">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-accent font-bold truncate">
                            #{idx + 1} {imgUrl.split('/').pop()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Remove this screengrab?')) {
                                const updated = project.screengrabs.filter((_, i) => i !== idx);
                                updateProject(project.id, { screengrabs: updated });
                              }
                            }}
                            className="p-1.5 bg-red-600/90 text-white rounded cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplacingStill({ type: 'screengrabs', index: idx, currentUrl: imgUrl });
                              setReplacingInput(imgUrl.split('/').pop());
                            }}
                            className="px-3 py-1.5 bg-accent text-canvas text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-accent/90 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Replace Image</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx > 0) {
                                const updated = [...project.screengrabs];
                                const temp = updated[idx - 1];
                                updated[idx - 1] = updated[idx];
                                updated[idx] = temp;
                                updateProject(project.id, { screengrabs: updated });
                              }
                            }}
                            className="px-2 py-1 bg-canvas text-ink font-bold rounded disabled:opacity-30 cursor-pointer"
                          >
                            ← Move Left
                          </button>
                          <button
                            disabled={idx === project.screengrabs.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx < project.screengrabs.length - 1) {
                                const updated = [...project.screengrabs];
                                const temp = updated[idx + 1];
                                updated[idx + 1] = updated[idx];
                                updated[idx] = temp;
                                updateProject(project.id, { screengrabs: updated });
                              }
                            }}
                            className="px-2 py-1 bg-canvas text-ink font-bold rounded disabled:opacity-30 cursor-pointer"
                          >
                            Move Right →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT 2: SET STILLS */}
          {underVideoTab === 'setStills' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* On-Page Edit Toolbar for Set Stills */}
              {isEditMode && (
                <div className="p-3 bg-accent/10 border border-accent/40 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono-custom text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-bold text-accent uppercase tracking-wider">EDIT SET STILLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inlineNewStill}
                      onChange={(e) => setInlineNewStill(e.target.value)}
                      placeholder="e.g. set-01.jpg"
                      className="px-3 py-1.5 bg-canvas border border-line text-ink text-xs font-mono-custom rounded-md w-48 sm:w-64 focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => {
                        if (!inlineNewStill.trim()) return;
                        const clean = inlineNewStill.trim();
                        const formatted = clean.startsWith('/') || clean.startsWith('http')
                          ? clean
                          : `/projects/${project.slug}/${clean}`;
                        const current = project.setStills || [];
                        updateProject(project.id, { setStills: [...current, formatted] });
                        setInlineNewStill('');
                      }}
                      className="px-3 py-1.5 bg-accent text-canvas font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add Set Still</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
                {project.setStills && project.setStills.length > 0 ? (
                  project.setStills.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-video overflow-hidden bg-black/30 flex items-center justify-center transition-all duration-300 ${
                        isEditMode ? 'outline-dashed outline-2 outline-accent/80 p-0.5' : 'cursor-pointer'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Set Still ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-contain sm:object-cover"
                      />

                      {!isEditMode && (
                        <div
                          onClick={() => {
                            setLightboxType('setStills');
                            setLightboxIndex(idx);
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      )}

                      {/* Edit mode hover toolbar */}
                      {isEditMode && (
                        <div className="absolute inset-0 bg-black/80 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20 font-mono-custom">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] text-accent font-bold truncate">
                              #{idx + 1} {imgUrl.split('/').pop()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = project.setStills.filter((_, i) => i !== idx);
                                updateProject(project.id, { setStills: updated });
                              }}
                              className="p-1.5 bg-red-600/90 text-white rounded cursor-pointer"
                              title="Remove Set Still"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplacingStill({ type: 'setStills', index: idx, currentUrl: imgUrl });
                                setReplacingInput(imgUrl.split('/').pop());
                              }}
                              className="px-3 py-1.5 bg-accent text-canvas text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-accent/90 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Replace Image</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-xs font-mono-custom uppercase tracking-widest text-muted">
                    No set stills currently available for this project.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT 3: FULL CREDITS */}
          {underVideoTab === 'credits' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 pt-2"
            >
              {isEditMode && (
                <div className="p-3 bg-accent/10 border border-accent/40 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono-custom text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-bold text-accent uppercase tracking-wider">EDIT CAST & CREW CREDITS</span>
                  </div>
                  <button
                    onClick={() => {
                      const custom = project.customCredits || [];
                      const newId = 'credit_' + Date.now();
                      const updated = [...custom, { id: newId, role: 'NEW ROLE', value: 'Member Name' }];
                      updateProject(project.id, { customCredits: updated });
                    }}
                    className="px-3.5 py-1.5 bg-accent text-canvas font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 cursor-pointer shadow hover:bg-accent/90 transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Custom Credit Field</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
                {/* Standard Crew Object Entries */}
                {project.crew && Object.entries(project.crew).map(([key, val]) => {
                  const roleMap = {
                    dop: 'DIRECTOR OF PHOTOGRAPHY',
                    writerDirectorEditorVfx: 'WRITER / DIRECTOR / EDITOR / VFX',
                    writerDirector: 'WRITER / DIRECTOR',
                    writtenDirectedBy: 'WRITTEN / DIRECTED BY',
                    productionSupport: 'PRODUCTION SUPPORT',
                    cinematographer: 'CINEMATOGRAPHER',
                    cinematography: 'CINEMATOGRAPHY',
                    producers: 'PRODUCERS',
                    production: 'PRODUCTION'
                  };
                  const displayRole = roleMap[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();

                  return (
                    <div key={key} className="space-y-1 group relative">
                      {isEditMode && (
                        <button
                          onClick={() => {
                            const newCrew = { ...(project.crew || {}) };
                            delete newCrew[key];
                            updateProject(project.id, { crew: newCrew });
                          }}
                          className="absolute -top-1 right-0 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                          title="Remove this credit field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          if (!isEditMode) return;
                          const newRole = e.target.innerText.trim();
                          if (!newRole) return;
                          if (newRole !== displayRole) {
                            const camelKey = newRole
                              .toLowerCase()
                              .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                            const newCrew = { ...(project.crew || {}) };
                            delete newCrew[key];
                            newCrew[camelKey] = val;
                            updateProject(project.id, { crew: newCrew });
                          }
                        }}
                        className={`text-[10px] font-mono-custom uppercase tracking-wider text-muted font-semibold ${
                          isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-0.5 rounded cursor-text inline-block min-w-[60px]' : ''
                        }`}
                      >
                        {displayRole}
                      </div>
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          if (!isEditMode) return;
                          updateProject(project.id, {
                            crew: { ...(project.crew || {}), [key]: e.target.innerText }
                          });
                        }}
                        className={`text-xs sm:text-sm font-sans font-medium text-ink whitespace-pre-line leading-relaxed ${
                          isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text min-h-[24px]' : ''
                        }`}
                      >
                        {typeof val === 'string' && val.includes(',') && !val.includes('\n')
                          ? val.split(',').map((item) => item.trim()).join('\n')
                          : val}
                      </div>
                    </div>
                  );
                })}

                {/* Dynamic Custom Credit Fields */}
                {project.customCredits && project.customCredits.map((item, idx) => (
                  <div key={item.id || idx} className="space-y-1 group relative">
                    {isEditMode && (
                      <button
                        onClick={() => {
                          const updated = project.customCredits.filter((_, i) => i !== idx);
                          updateProject(project.id, { customCredits: updated });
                        }}
                        className="absolute -top-1 right-0 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        title="Remove custom credit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        const updated = [...project.customCredits];
                        updated[idx] = { ...updated[idx], role: e.target.innerText.trim().toUpperCase() };
                        updateProject(project.id, { customCredits: updated });
                      }}
                      className={`text-[10px] font-mono-custom uppercase tracking-wider text-muted font-semibold ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-0.5 rounded cursor-text inline-block min-w-[60px]' : ''
                      }`}
                    >
                      {item.role}
                    </div>
                    <div
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (!isEditMode) return;
                        const updated = [...project.customCredits];
                        updated[idx] = { ...updated[idx], value: e.target.innerText };
                        updateProject(project.id, { customCredits: updated });
                      }}
                      className={`text-xs sm:text-sm font-sans font-medium text-ink whitespace-pre-line leading-relaxed ${
                        isEditMode ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-1 rounded cursor-text min-h-[24px]' : ''
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Prev / Next Project Navigation Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-12 text-xs sm:text-sm font-mono-custom font-bold text-ink tracking-wider">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-2 text-ink font-bold font-mono-custom tracking-wider truncate max-w-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span className="truncate"><span className="lowercase font-medium text-muted">prev:</span> {prevProject.title}</span>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-2 text-ink font-bold font-mono-custom tracking-wider truncate max-w-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="truncate">{nextProject.title} <span className="lowercase font-medium text-muted">:next</span></span>
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

      {/* Sleek Custom Replace Image Modal Dialog */}
      <AnimatePresence>
        {replacingStill && (
          <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-black/95 border border-accent/40 rounded-2xl p-6 max-w-md w-full shadow-2xl font-mono-custom space-y-5"
            >
              <div className="flex items-center justify-between border-b border-line/40 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-accent animate-spin-slow" />
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider">REPLACE GALLERY IMAGE</h3>
                </div>
                <button
                  onClick={() => setReplacingStill(null)}
                  className="p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Image Preview */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-muted uppercase font-bold">Current Image Preview</label>
                <div className="aspect-video bg-surface rounded-xl overflow-hidden border border-line relative">
                  <img src={replacingStill.currentUrl} alt="Current Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] text-accent font-bold">
                    #{replacingStill.index + 1} {replacingStill.type === 'screengrabs' ? 'Screengrab' : 'Set Still'}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest text-accent uppercase font-bold">New Filename or Full Hostinger URL</label>
                <input
                  type="text"
                  value={replacingInput}
                  onChange={(e) => setReplacingInput(e.target.value)}
                  placeholder="e.g. still-01.png or my-image.jpg"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmReplace();
                    if (e.key === 'Escape') setReplacingStill(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-surface border border-accent/60 text-ink text-xs font-mono-custom rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <p className="text-[10px] text-muted leading-relaxed">
                  Tip: Standard filenames like <code className="text-accent">still-02.png</code> automatically resolve to <code className="text-muted">/projects/{project.slug}/still-02.png</code>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setReplacingStill(null)}
                  className="px-4 py-2 bg-surface hover:bg-line text-muted hover:text-ink text-xs uppercase tracking-wider font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReplace}
                  className="px-5 py-2 bg-accent text-canvas text-xs uppercase tracking-wider font-bold rounded-xl cursor-pointer hover:bg-accent/90 transition-colors shadow-lg active:scale-95"
                >
                  Save & Replace Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
