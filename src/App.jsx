import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CMSProvider, useCMS } from './context/CMSContext';
import { AdminAuth } from './components/admin/AdminAuth';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminFloatingBar } from './components/admin/AdminFloatingBar';
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
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Grid, List, X, Plus, Save } from 'lucide-react';

function MainContent() {
  const { projects: cmsProjects, isAdminLoggedIn, reorderProjects, updateProject, addProject, showSaveToast } = useCMS();
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reel'); // 'reel', 'projects', 'stills', 'about', 'journal', 'admin'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'films', 'commercial'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  // Edit Project & Add Project Modals
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: '', category: 'Commercial', year: new Date().getFullYear().toString(), client: '', vimeoId: '', synopsis: '', thumbnail: 'still-01.png'
  });

  // Filter active projects list from CMS state
  const HIDDEN_PROJECT_SLUGS = ['indalo-hobeki', 'attic-echoes-in-your-attic'];
  const projects = cmsProjects.filter((p) => !HIDDEN_PROJECT_SLUGS.includes(p.slug));

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'films') return project.category === 'Films';
    if (activeFilter === 'commercial') return project.category === 'Commercial';
    return true;
  });

  // URL sync: apply the current pathname to app state (deep links, back/forward)
  const applyPathToState = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setIsAdminRoute(true);
      return;
    }
    setIsAdminRoute(false);

    const projectMatch = path.match(/^\/projects\/([\w-]+)\/?$/);
    if (projectMatch) {
      const found = cmsProjects.find(
        (p) => p.slug === projectMatch[1] || p.id === projectMatch[1]
      );
      if (found) {
        setSelectedProject(found);
        return;
      }
    }
    setSelectedProject(null);
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
  }, [cmsProjects]);

  // If on /admin route and NOT logged in: render Admin Auth
  if (isAdminRoute && !isAdminLoggedIn) {
    return <AdminAuth />;
  }

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

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectData.title) return;
    const created = addProject(newProjectData);
    setIsAddingNew(false);
    setNewProjectData({ title: '', category: 'Commercial', year: new Date().getFullYear().toString(), client: '', vimeoId: '', synopsis: '', thumbnail: 'still-01.png' });
    handleSelectProject(created);
  };

  const viewKey = selectedProject ? `project-${selectedProject.id}` : activeTab;

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-700 ease-in-out ${
      activeTab === 'about' && !selectedProject
        ? 'about-inverted bg-[var(--about-bg)] text-[var(--about-ink)] selection:bg-[var(--about-ink)] selection:text-[var(--about-bg)]'
        : 'bg-canvas text-ink selection:bg-ink selection:text-canvas'
    } ${isAdminLoggedIn ? 'pt-16' : ''}`}>
      
      {/* On-Page Live Webflow Admin Floating Bar */}
      {isAdminLoggedIn && (
        <AdminFloatingBar
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onOpenAddProject={() => setIsAddingNew(true)}
        />
      )}

      {/* Dynamic SEO Head Manager */}
      <SEOHead activeTab={activeTab} selectedProject={selectedProject} activeFilter={activeFilter} />

      {/* Custom Trailing Mouse Cursor */}
      <CustomCursor />

      {/* Film Grain Subtle Overlay */}
      <div className="film-grain" />

      {/* Fullscreen Bootup Loading GIF */}
      <AnimatePresence>
        {isLoadingScreen && (
          <CinematicLoadingScreen onComplete={() => setIsLoadingScreen(false)} />
        )}
      </AnimatePresence>

      {/* Fullscreen Video Transition Loading GIF */}
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
          {/* Navigation Bar */}
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

          {/* Main Content Area */}
          <main className="flex-1 w-full mx-auto px-4 sm:px-8 md:px-12 py-4 md:py-6 select-none">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <ProjectDetailPage
                  key={viewKey}
                  project={selectedProject}
                  allProjects={projects}
                  onBack={handleBackToGallery}
                  onSelectProject={handleSelectProject}
                  isEditMode={isAdminLoggedIn && isEditMode}
                />
              ) : activeTab === 'about' ? (
                <motion.div
                  key={viewKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AboutPage isEditMode={isAdminLoggedIn && isEditMode} />
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
                  {/* View Mode Toggle */}
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

                  {/* Render Live Reorderable Grid when in Edit Mode */}
                  {isAdminLoggedIn && isEditMode ? (
                    <Reorder.Group
                      values={filteredProjects}
                      onReorder={reorderProjects}
                      className="grid grid-cols-1 gap-y-6"
                    >
                      {filteredProjects.map((project, idx) => (
                        <Reorder.Item key={project.id} value={project} className="cursor-grab active:cursor-grabbing">
                          <ProjectCard
                            project={project}
                            indexNumber={idx + 1}
                            onClick={handleSelectProject}
                            isEditMode={true}
                            onEditProject={(p) => setEditingProject(p)}
                          />
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : viewMode === 'grid' ? (
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
                              isEditMode={false}
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

          <Footer isLime={activeTab === 'about' && !selectedProject} showMegaName={activeTab === 'about' && !selectedProject} />
        </motion.div>
      )}

      {/* MODAL: EDIT PROJECT DETAILS */}
      <AnimatePresence>
        {editingProject && (
          <div data-admin="true" className="admin-root fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-line-strong rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl font-mono-custom text-xs"
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                  Edit Project: {editingProject.title}
                </h3>
                <button onClick={() => setEditingProject(null)} className="p-1 text-muted hover:text-ink cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Films">Films</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Client / Festival</label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Vimeo Video ID</label>
                  <input
                    type="text"
                    value={editingProject.videos?.[0]?.vimeoId || ''}
                    onChange={(e) => {
                      const vId = e.target.value.trim();
                      const updatedVids = vId ? [
                        {
                          id: 'main',
                          labelKey: 'mainFilm',
                          title: editingProject.title,
                          vimeoId: vId,
                          embedUrl: `https://player.vimeo.com/video/${vId}?title=0&byline=0&portrait=0&badge=0&autopause=0`
                        }
                      ] : [];
                      setEditingProject({ ...editingProject, videos: updatedVids });
                    }}
                    placeholder="e.g. 1220862850"
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Synopsis / Description</label>
                  <textarea
                    rows={4}
                    value={editingProject.synopsis || editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, synopsis: e.target.value, description: e.target.value })}
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button onClick={() => setEditingProject(null)} className="px-4 py-2 bg-line/40 hover:bg-line text-ink rounded cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateProject(editingProject.id, editingProject);
                    setEditingProject(null);
                  }}
                  className="px-5 py-2 bg-accent text-canvas font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD NEW PROJECT */}
      <AnimatePresence>
        {isAddingNew && (
          <div data-admin="true" className="admin-root fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-line-strong rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono-custom text-xs"
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                  Add New Project
                </h3>
                <button onClick={() => setIsAddingNew(false)} className="p-1 text-muted hover:text-ink cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={newProjectData.title}
                    onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                    placeholder="MY NEW FILM"
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Category</label>
                    <select
                      value={newProjectData.category}
                      onChange={(e) => setNewProjectData({ ...newProjectData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Films">Films</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Year</label>
                    <input
                      type="text"
                      value={newProjectData.year}
                      onChange={(e) => setNewProjectData({ ...newProjectData, year: e.target.value })}
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Vimeo Video ID</label>
                  <input
                    type="text"
                    value={newProjectData.vimeoId}
                    onChange={(e) => setNewProjectData({ ...newProjectData, vimeoId: e.target.value })}
                    placeholder="e.g. 1220862850"
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                  <button type="button" onClick={() => setIsAddingNew(false)} className="px-4 py-2 bg-line/40 hover:bg-line text-ink rounded cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-accent text-canvas font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Create Project</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <LanguageProvider>
        <ThemeProvider>
          <MainContent />
        </ThemeProvider>
      </LanguageProvider>
    </CMSProvider>
  );
}

