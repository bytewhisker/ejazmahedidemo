import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CinematicLoadingScreen } from './components/CinematicLoadingScreen';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectListView } from './components/ProjectListView';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { StillsGallery } from './components/StillsGallery';
import { AboutPage } from './components/AboutPage';
import { JournalPage } from './components/JournalPage';
import { ReelPage } from './components/ReelPage';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { SEOHead } from './components/SEOHead';
import { projectsData } from './data/projectsData';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid, List } from 'lucide-react';

function MainContent() {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reel'); // 'reel', 'projects', 'stills', 'about', 'journal'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'films', 'commercial'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter active projects list
  const HIDDEN_PROJECT_SLUGS = ['indalo-hobeki', 'attic-echoes-in-your-attic'];
  const PROJECT_ORDER = [
    'mai-natures-new-address',
    'moshari',
    'azura-the-azura-within',
    'foreigners-only',
    'a-thing-about-kashem',
    'changan-magic-hour',
    'golf-links-nature-of-luxury',
    'maktoob',
    'last-night-in-korea',
    'oqgn-unseen',
    'al-mouj-golf-10-years-of-golf',
    'yiti-dynamic-harmony',
    'bank-muscat-the-gamer',
    'yamaha-speed-girl',
  ];
  const projects = projectsData
    .filter((p) => !HIDDEN_PROJECT_SLUGS.includes(p.slug))
    .sort((a, b) => {
      const ai = PROJECT_ORDER.indexOf(a.slug);
      const bi = PROJECT_ORDER.indexOf(b.slug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'films') return project.category === 'Films';
    if (activeFilter === 'commercial') return project.category === 'Commercial';
    return true;
  });

  // URL sync: apply the current pathname to app state (deep links, back/forward)
  const applyPathToState = () => {
    const path = window.location.pathname;
    const projectMatch = path.match(/^\/projects\/([\w-]+)\/?$/);
    if (projectMatch) {
      const found = projectsData.find(
        (p) => p.slug === projectMatch[1] || p.id === projectMatch[1]
      );
      if (found) {
        setSelectedProject(found);
        return;
      }
    }
    setSelectedProject(null);
    // stills page hidden for now — route to reel
    if (path.startsWith('/about')) setActiveTab('about');
    else if (path.startsWith('/journal')) setActiveTab('journal');
    else if (path.startsWith('/reel')) setActiveTab('reel');
    else if (path.startsWith('/overview')) setActiveTab('projects');
    else if (path.startsWith('/projects')) setActiveTab('projects');
    else setActiveTab('reel');
  };

  useEffect(() => {
    applyPathToState();
    window.addEventListener('popstate', applyPathToState);
    return () => window.removeEventListener('popstate', applyPathToState);
  }, []);

  const handleSelectProject = (project) => {
    setIsVideoLoading(true);
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', `/projects/${project.slug || project.id}`);

    setTimeout(() => {
      setIsVideoLoading(false);
    }, 1100);
  };

  const handleBackToGallery = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/');
  };

  const viewKey = selectedProject ? `project-${selectedProject.id}` : activeTab;

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-700 ease-in-out ${
      activeTab === 'about' && !selectedProject
        ? 'about-inverted bg-[var(--about-bg)] text-[var(--about-ink)] selection:bg-[var(--about-ink)] selection:text-[var(--about-bg)]'
        : 'bg-canvas text-ink selection:bg-ink selection:text-canvas'
    }`}>
      
      {/* Dynamic SEO Head Manager */}
      <SEOHead activeTab={activeTab} selectedProject={selectedProject} activeFilter={activeFilter} />

      {/* Custom Trailing Mouse Cursor */}
      <CustomCursor />

      {/* Film Grain Subtle Overlay */}
      <div className="film-grain" />

      {/* Fullscreen Ligthelm Bootup Loading GIF */}
      <AnimatePresence>
        {isLoadingScreen && (
          <CinematicLoadingScreen onComplete={() => setIsLoadingScreen(false)} />
        )}
      </AnimatePresence>

      {/* Fullscreen Video Page Transition Loading GIF */}
      <AnimatePresence>
        {isVideoLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center select-none"
          >
            <img
              src="/project-loader.gif"
              alt="Loading project..."
              className="w-32 h-32 md:w-44 md:h-44 object-contain filter brightness-110"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoadingScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col"
        >
          {/* Single Clean Navigation Bar */}
          <Navbar
            activeTab={selectedProject ? 'project_detail' : activeTab}
            setActiveTab={(tab) => {
              setSelectedProject(null);
              setActiveTab(tab);
              if (tab === 'about') window.history.pushState(null, '', '/about');
              else if (tab === 'journal') window.history.pushState(null, '', '/journal');
              else if (tab === 'reel') window.history.pushState(null, '', '/');
              else window.history.pushState(null, '', '/overview');
            }}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* Main Content Area — Full Width Layout */}
          <main className="flex-1 w-full mx-auto px-4 sm:px-8 md:px-12 py-4 md:py-6 select-none">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <ProjectDetailPage
                  key={viewKey}
                  project={selectedProject}
                  allProjects={projects}
                  onBack={handleBackToGallery}
                  onSelectProject={handleSelectProject}
                />
              ) : activeTab === 'about' ? (
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AboutPage />
                </motion.div>
              ) : activeTab === 'journal' ? (
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JournalPage />
                </motion.div>
              ) : activeTab === 'reel' ? (
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ReelPage />
                </motion.div>
              ) : (
                /* Projects Section with GRID / LIST View Mode Toggle */
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 pb-12 sm:pb-16"
                >
                  {/* Gallery Subheader Bar: GRID / LIST Toggle */}
                  <div className="flex items-center justify-end text-xs font-mono-custom tracking-[0.2em] uppercase text-muted">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                        className={`transition-colors p-1.5 ${
                          viewMode === 'grid' ? 'text-ink' : 'text-muted hover:text-ink'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <span className="text-line-strong">/</span>
                      <button
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                        className={`transition-colors p-1.5 ${
                          viewMode === 'list' ? 'text-ink' : 'text-muted hover:text-ink'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Render Grid or List — filter animates IN-PLACE, no page transition */}
                  {viewMode === 'grid' ? (
                    <motion.div layout className="grid grid-cols-1 gap-y-4 sm:gap-y-6 md:gap-y-7">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {filteredProjects.map((project, idx) => (
                          <motion.div
                            key={project.id}
                            layout
                            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                          >
                            <ProjectCard
                              project={project}
                              indexNumber={idx + 1}
                              onClick={handleSelectProject}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <ProjectListView
                      projects={filteredProjects}
                      onSelectProject={handleSelectProject}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Signature Footer - MegaName typography only on Information page */}
          <Footer isLime={activeTab === 'about' && !selectedProject} showMegaName={activeTab === 'about' && !selectedProject} />
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}
