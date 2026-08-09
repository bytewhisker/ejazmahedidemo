import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CinematicLoadingScreen } from './components/CinematicLoadingScreen';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectListView } from './components/ProjectListView';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { StillsGallery } from './components/StillsGallery';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { projectsData } from './data/projectsData';
import { AnimatePresence, motion } from 'framer-motion';

function MainContent() {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'stills', 'about'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'films', 'commercial'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects list
  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === 'films') return project.category === 'Films';
    if (activeFilter === 'commercial') return project.category === 'Commercial';
    return true;
  });

  const handleSelectProject = (project) => {
    // Trigger video page full-screen loading GIF
    setIsVideoLoading(true);
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide loader after 1.1s page transition
    setTimeout(() => {
      setIsVideoLoading(false);
    }, 1100);
  };

  const handleBackToGallery = () => {
    setSelectedProject(null);
  };

  const viewKey = selectedProject ? `project-${selectedProject.id}` : `${activeTab}-${activeFilter}-${viewMode}`;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-ink selection:text-canvas relative">
      
      {/* Film Grain Subtle Overlay */}
      <div className="film-grain" />

      {/* Fullscreen Ligthelm Bootup Loading GIF */}
      <AnimatePresence>
        {isLoadingScreen && (
          <CinematicLoadingScreen onComplete={() => setIsLoadingScreen(false)} />
        )}
      </AnimatePresence>

      {/* Fullscreen Video Page Transition Loading GIF (Bigger simple-loading.gif) */}
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
              src="https://ligthelm.work/static/img/simple-loading.gif"
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
                  allProjects={projectsData}
                  onBack={handleBackToGallery}
                  onSelectProject={handleSelectProject}
                />
              ) : activeTab === 'stills' ? (
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StillsGallery />
                </motion.div>
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
              ) : (
                /* Projects Section with GRID / LIST View Mode Toggle */
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 pb-12 sm:pb-16"
                >
                  {/* Gallery Subheader Bar: GRID / LIST Toggle */}
                  <div className="flex items-center justify-end text-xs font-mono-custom tracking-[0.2em] uppercase text-muted">
                    {/* GRID / LIST Toggle Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`transition-colors font-bold ${
                          viewMode === 'grid'
                            ? 'text-ink'
                            : 'text-muted hover:text-ink'
                        }`}
                      >
                        GRID
                      </button>
                      <span>/</span>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`transition-colors font-bold ${
                          viewMode === 'list'
                            ? 'text-ink'
                            : 'text-muted hover:text-ink'
                        }`}
                      >
                        LIST
                      </button>
                    </div>
                  </div>

                  {/* Render Grid or List view */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6 md:gap-y-7">
                      {filteredProjects.map((project, idx) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          indexNumber={idx + 1}
                          onClick={handleSelectProject}
                        />
                      ))}
                    </div>
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

          {/* Minimal Footer */}
          <Footer />
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
