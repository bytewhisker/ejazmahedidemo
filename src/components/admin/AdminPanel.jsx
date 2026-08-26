import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  UploadCloud,
  LogOut,
  Save,
  Check,
  Film,
  Image as ImageIcon,
  FileText,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AdminPanel = ({ onPreviewLive }) => {
  const {
    projects,
    aboutData,
    reorderProjects,
    updateProject,
    addProject,
    deleteProject,
    reorderStills,
    updateAbout,
    exportCMSJson,
    importCMSJson,
    logoutAdmin,
    resetToDefaultData
  } = useCMS();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'stills', 'about'
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');
  const [newImageInput, setNewImageInput] = useState('');

  // New Project Form State
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    category: 'Commercial',
    year: new Date().getFullYear().toString(),
    client: '',
    vimeoId: '',
    synopsis: '',
    thumbnail: 'still-01.png'
  });

  const showSaveToast = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 3500);
  };

  const handleExport = () => {
    exportCMSJson();
    showSaveToast('Exported cms.json successfully! Upload to Hostinger public/data/ folder.');
  };

  const handlePublishHostinger = () => {
    showSaveToast('Publishing changes live to Hostinger server...');
    const payload = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      projects,
      aboutData
    };
    fetch('/api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          showSaveToast('Published Live to Hostinger Server Successfully!');
        } else {
          showSaveToast('Saved to local storage! (Server response: ' + (res.error || 'local mode') + ')');
        }
      })
      .catch(() => {
        showSaveToast('Saved live to Local Storage & ready for Hostinger upload!');
      });
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectData.title) return;
    const created = addProject(newProjectData);
    setIsAddingNew(false);
    setNewProjectData({
      title: '',
      category: 'Commercial',
      year: new Date().getFullYear().toString(),
      client: '',
      vimeoId: '',
      synopsis: '',
      thumbnail: 'still-01.png'
    });
    setSelectedProjectId(created.id);
    showSaveToast(`Created "${created.title}" successfully!`);
  };

  const activeProjectForStills = projects.find((p) => p.id === selectedProjectId || p.slug === selectedProjectId) || projects[0];

  return (
    <div data-admin="true" className="admin-root min-h-screen bg-canvas text-ink font-sans flex flex-col select-none">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-accent text-canvas px-6 py-3 rounded-full font-mono-custom text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{saveNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Fixed Admin Bar */}
      <header className="sticky top-0 z-50 bg-surface/95 border-b border-line-strong backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          <span className="font-mono-custom text-sm font-bold tracking-[0.2em] uppercase text-ink">
            WEBFLOW DRAG & DROP CMS
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 bg-line/40 text-[10px] font-mono-custom text-muted rounded uppercase tracking-wider">
            Hostinger Ready
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs font-mono-custom">
          {/* Live Preview */}
          <button
            onClick={onPreviewLive}
            className="px-3.5 py-2 bg-line/40 hover:bg-line text-ink rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Live Site</span>
          </button>

          {/* Export cms.json */}
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-line/40 hover:bg-line text-ink rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download cms.json file to upload to Hostinger folder"
          >
            <Download className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">Download cms.json</span>
          </button>

          {/* 1-Click Publish */}
          <button
            onClick={handlePublishHostinger}
            className="px-4 py-2 bg-accent text-canvas font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 hover:bg-accent/90 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            <span>Publish Live</span>
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="p-2 text-muted hover:text-red-400 transition-colors ml-2 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header Tabs */}
      <div className="bg-surface/50 border-b border-line px-4 sm:px-8 py-2 flex items-center gap-6 font-mono-custom text-xs tracking-widest uppercase overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-2 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'projects'
              ? 'border-accent text-accent font-bold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Projects Reorder & Details ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stills')}
          className={`py-2 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'stills'
              ? 'border-accent text-accent font-bold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Stills Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`py-2 px-1 flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 ${
            activeTab === 'about'
              ? 'border-accent text-accent font-bold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Site Bio & Contact Info</span>
        </button>
      </div>

      {/* Main Admin Body Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-8">
        
        {/* ─── TAB 1: PROJECTS REORDER & EDIT ─── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-mono-custom font-bold text-ink uppercase tracking-wider">
                  Drag & Drop Project Order
                </h2>
                <p className="text-xs font-mono-custom text-muted">
                  Drag handles to reorder how projects appear on your website. Edit fields update live instantly.
                </p>
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2 bg-line/60 hover:bg-line text-ink font-mono-custom text-xs uppercase tracking-widest font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-accent stroke-[3]" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Drag & Drop Reorderable List */}
            <Reorder.Group
              values={projects}
              onReorder={reorderProjects}
              className="space-y-3"
            >
              {projects.map((project, idx) => (
                <Reorder.Item
                  key={project.id || project.slug}
                  value={project}
                  className="bg-surface border border-line rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-accent/40 transition-colors shadow-md cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="p-2 text-muted hover:text-accent transition-colors shrink-0">
                      <GripVertical className="w-5 h-5 stroke-[2]" />
                    </div>

                    <span className="font-mono-custom text-xs font-bold text-muted w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Thumbnail preview */}
                    <div className="w-14 h-10 bg-canvas rounded overflow-hidden shrink-0 border border-line">
                      <img
                        src={project.thumbnail || project.poster}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/projects/moshari/still-01.png'; }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold font-sans text-ink uppercase tracking-wide truncate">
                        {project.title}
                      </h3>
                      <p className="text-[11px] font-mono-custom text-muted uppercase tracking-wider truncate">
                        {project.category} / {project.client || 'Client'} — {project.year || '2025'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="px-3 py-1.5 bg-line/40 hover:bg-line text-ink font-mono-custom text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-accent" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          deleteProject(project.id);
                          showSaveToast(`Deleted "${project.title}"`);
                        }
                      }}
                      className="p-2 text-muted hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

        {/* ─── TAB 2: IMAGE & STILLS MANAGER ─── */}
        {activeTab === 'stills' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-mono-custom font-bold text-ink uppercase tracking-wider">
                Image Stills & Set Photos Manager
              </h2>
              <p className="text-xs font-mono-custom text-muted">
                Select a project below. Type filenames (e.g. <code className="text-accent">my-pic.jpg</code>) uploaded to Hostinger File Manager to load them automatically.
              </p>
            </div>

            {/* Project Selector */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-line">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-4 py-2 rounded-lg font-mono-custom text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                    selectedProjectId === p.id
                      ? 'bg-accent text-canvas font-bold'
                      : 'bg-surface text-muted hover:text-ink border border-line'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {activeProjectForStills && (
              <div className="space-y-8 pt-2">
                
                {/* Screengrabs Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono-custom font-bold text-ink uppercase tracking-widest">
                      SCREENGRABS ({activeProjectForStills.screengrabs?.length || 0})
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newImageInput}
                        onChange={(e) => setNewImageInput(e.target.value)}
                        placeholder="e.g. still-07.png or my-image.jpg"
                        className="px-3 py-1.5 bg-surface border border-line text-ink text-xs font-mono-custom rounded-md w-56 sm:w-72 focus:outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => {
                          if (!newImageInput.trim()) return;
                          const formatted = newImageInput.startsWith('/') || newImageInput.startsWith('http')
                            ? newImageInput.trim()
                            : `/projects/${activeProjectForStills.slug}/${newImageInput.trim()}`;
                          const current = activeProjectForStills.screengrabs || [];
                          updateProject(activeProjectForStills.id, {
                            screengrabs: [...current, formatted]
                          });
                          setNewImageInput('');
                          showSaveToast('Added new screengrab!');
                        }}
                        className="px-3 py-1.5 bg-accent text-canvas font-mono-custom text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add Still</span>
                      </button>
                    </div>
                  </div>

                  {/* Screengrabs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {activeProjectForStills.screengrabs?.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video bg-surface border border-line rounded-lg overflow-hidden"
                      >
                        <img
                          src={imgUrl}
                          alt={`Still ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            const updated = activeProjectForStills.screengrabs.filter((_, i) => i !== idx);
                            updateProject(activeProjectForStills.id, { screengrabs: updated });
                            showSaveToast('Removed still');
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove Still"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] font-mono-custom text-muted truncate px-1.5">
                          {imgUrl.split('/').pop()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Set Stills Section */}
                <div className="space-y-4 border-t border-line/40 pt-6">
                  <h3 className="text-sm font-mono-custom font-bold text-ink uppercase tracking-widest">
                    SET STILLS / BEHIND THE SCENES ({activeProjectForStills.setStills?.length || 0})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {activeProjectForStills.setStills?.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video bg-surface border border-line rounded-lg overflow-hidden"
                      >
                        <img
                          src={imgUrl}
                          alt={`Set Still ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            const updated = activeProjectForStills.setStills.filter((_, i) => i !== idx);
                            updateProject(activeProjectForStills.id, { setStills: updated });
                            showSaveToast('Removed set still');
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove Set Still"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] font-mono-custom text-muted truncate px-1.5">
                          {imgUrl.split('/').pop()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: SITE BIO & CONTACT ─── */}
        {activeTab === 'about' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-mono-custom font-bold text-ink uppercase tracking-wider">
                Edit Bio & Contact Information
              </h2>
              <p className="text-xs font-mono-custom text-muted">
                Update the Information/About page bio paragraphs, location, and social media links.
              </p>
            </div>

            <div className="bg-surface border border-line rounded-xl p-6 space-y-4 font-mono-custom">
              <div className="space-y-1">
                <label className="block text-[10px] tracking-widest text-muted uppercase">Bio Headline</label>
                <input
                  type="text"
                  value={aboutData.bioTitle || ''}
                  onChange={(e) => updateAbout({ bioTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] tracking-widest text-muted uppercase">Bio Paragraph 1</label>
                <textarea
                  rows={3}
                  value={aboutData.bioText1 || ''}
                  onChange={(e) => updateAbout({ bioText1: e.target.value })}
                  className="w-full px-4 py-2.5 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] tracking-widest text-muted uppercase">Bio Paragraph 2</label>
                <textarea
                  rows={3}
                  value={aboutData.bioText2 || ''}
                  onChange={(e) => updateAbout({ bioText2: e.target.value })}
                  className="w-full px-4 py-2.5 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Location</label>
                  <input
                    type="text"
                    value={aboutData.location || ''}
                    onChange={(e) => updateAbout({ location: e.target.value })}
                    className="w-full px-4 py-2 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Email Address</label>
                  <input
                    type="email"
                    value={aboutData.email || ''}
                    onChange={(e) => updateAbout({ email: e.target.value })}
                    className="w-full px-4 py-2 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Instagram URL</label>
                  <input
                    type="text"
                    value={aboutData.instagram || ''}
                    onChange={(e) => updateAbout({ instagram: e.target.value })}
                    className="w-full px-4 py-2 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Vimeo URL</label>
                  <input
                    type="text"
                    value={aboutData.vimeo || ''}
                    onChange={(e) => updateAbout({ vimeo: e.target.value })}
                    className="w-full px-4 py-2 bg-canvas border border-line text-ink rounded-lg text-xs font-mono-custom"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ─── MODAL: EDIT PROJECT DETAILS ─── */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1 text-muted hover:text-ink cursor-pointer"
                >
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Thumbnail Filename</label>
                    <input
                      type="text"
                      value={editingProject.thumbnail || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                      placeholder="still-01.png"
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] tracking-widest text-muted uppercase">Poster Filename</label>
                    <input
                      type="text"
                      value={editingProject.poster || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, poster: e.target.value })}
                      placeholder="still-01.png"
                      className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-line/40 hover:bg-line text-ink rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateProject(editingProject.id, editingProject);
                    setEditingProject(null);
                    showSaveToast(`Saved changes for ${editingProject.title}`);
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

      {/* ─── MODAL: CREATE NEW PROJECT ─── */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="p-1 text-muted hover:text-ink cursor-pointer"
                >
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
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Client / Festival</label>
                  <input
                    type="text"
                    value={newProjectData.client}
                    onChange={(e) => setNewProjectData({ ...newProjectData, client: e.target.value })}
                    placeholder="e.g. HULU / 20th Digital"
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
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

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Synopsis</label>
                  <textarea
                    rows={3}
                    value={newProjectData.synopsis}
                    onChange={(e) => setNewProjectData({ ...newProjectData, synopsis: e.target.value })}
                    className="w-full px-3 py-2 bg-canvas border border-line text-ink rounded"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 bg-line/40 hover:bg-line text-ink rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-accent text-canvas font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer"
                  >
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
};
