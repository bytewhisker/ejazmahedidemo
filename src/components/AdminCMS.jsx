import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Key, Save, Plus, Trash2, ArrowUp, ArrowDown, Edit3, 
  Film, Info as InfoIcon, Check, X, LogOut, Video, Globe, RefreshCw, Upload
} from 'lucide-react';

export const AdminCMS = ({ cmsData, onSaveCmsData, onClose, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'info', 'clients'
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Local state copy for editing
  const [formData, setFormData] = useState(cmsData);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if ((cleanEmail === 'admin' || cleanEmail === 'admin@ejazmehedi.com') && cleanPass === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Use email: admin / pass: admin');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    if (onLogout) onLogout();
  };

  // Save all changes to App and Supabase
  const handleSaveAll = async () => {
    setIsSaving(true);
    await onSaveCmsData(formData);
    setIsSaving(false);
    setSaveSuccessMsg('All site changes published & synced to Supabase cloud!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Project reordering (Move Up / Down)
  const moveProject = (index, direction) => {
    const updated = [...formData.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setFormData({ ...formData, projects: updated });
  };

  // Delete project
  const deleteProject = (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updated = formData.projects.filter((p) => p.id !== id);
    setFormData({ ...formData, projects: updated });
  };

  // Add new project template
  const addNewProject = () => {
    const newId = `project-${Date.now()}`;
    const newProj = {
      id: newId,
      title: "New Film Title",
      category: "Films",
      year: new Date().getFullYear().toString(),
      client: "Client Name",
      aspectRatio: "2.39:1 Anamorphic",
      thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
      hoverStills: [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop"
      ],
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
      videos: [
        {
          id: "main",
          labelKey: "mainFilm",
          title: "Main Film (Vimeo Master)",
          vimeoId: "160754109",
          embedUrl: "https://player.vimeo.com/video/160754109?title=0&byline=0&portrait=0&badge=0&autopause=0",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        }
      ],
      screengrabs: [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
      ],
      crew: {
        director: "Ejaz Mehedi",
        producer: "Producer Name",
        dop: "Ejaz Mehedi",
        productionCompany: "Production House",
        editor: "Editor Name",
        colorist: "Colorist Name",
        client: "Client Name"
      },
      story: {
        background: "Description of the film concept...",
        creativeProcess: "Details on camera, lenses, and lighting...",
        challenges: "Production hurdles...",
        productionStory: "On-set anecdotes..."
      }
    };

    setFormData({ ...formData, projects: [newProj, ...formData.projects] });
    setEditingProject(newProj);
  };

  // Save edited project back to formData
  const saveProjectModal = (updatedProj) => {
    const updatedProjects = formData.projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setFormData({ ...formData, projects: updatedProjects });
    setEditingProject(null);
  };

  // ----------------------------------------------------
  // LOGIN SCREEN VIEW
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black/95 text-white flex items-center justify-center p-4 select-none backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-sm shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#b5ff32]" />
              <span className="font-mono-custom font-bold text-xs uppercase tracking-[0.2em] text-[#b5ff32]">
                EJAZ MEHEDI // ADMIN CMS
              </span>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono-custom tracking-widest text-neutral-400 uppercase">USERNAME / EMAIL</label>
              <input
                type="text"
                placeholder="admin"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono-custom tracking-widest text-neutral-400 uppercase">PASSWORD</label>
              <input
                type="password"
                placeholder="admin"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
              />
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-mono-custom font-bold pt-1">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#b5ff32] text-black font-mono-custom font-bold text-xs uppercase tracking-widest hover:bg-[#a2eb26] transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>ACCESS CMS PANEL</span>
            </button>
          </form>

          <p className="text-[10px] font-mono-custom text-neutral-500 text-center uppercase tracking-widest">
            SUPABASE CLOUD SYNCED // PROJECT: yetnqjzaukffckpdgmos
          </p>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN CMS DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-[10000] bg-black text-white flex flex-col overflow-hidden select-none font-sans">
      
      {/* CMS TOP HEADER BAR */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#b5ff32] animate-pulse" />
          <div>
            <h1 className="font-mono-custom text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#b5ff32]">
              EJAZ MEHEDI // FULL CUSTOM CMS DASHBOARD
            </h1>
            <p className="text-[10px] font-mono-custom text-neutral-400">
              SUPABASE CONNECTED (id: yetnqjzaukffckpdgmos)
            </p>
          </div>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-[#b5ff32] text-black font-mono-custom font-bold text-xs uppercase tracking-widest hover:bg-[#a2eb26] transition-colors flex items-center gap-2 rounded-sm"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>PUBLISH ALL CHANGES</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 rounded-sm"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded-sm"
            title="Close Admin CMS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SAVE SUCCESS NOTIFICATION */}
      {saveSuccessMsg && (
        <div className="bg-[#b5ff32] text-black font-mono-custom text-xs uppercase font-bold py-2 px-4 text-center tracking-widest shrink-0">
          ✓ {saveSuccessMsg}
        </div>
      )}

      {/* CMS NAVIGATION TABS BAR */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-8 py-2 flex items-center gap-4 text-xs font-mono-custom tracking-[0.2em] uppercase shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${
            activeTab === 'projects' ? 'bg-[#b5ff32] text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>PROJECTS & VIDEOS ({formData.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${
            activeTab === 'info' ? 'bg-[#b5ff32] text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <InfoIcon className="w-4 h-4" />
          <span>INFO PAGE & CONTACT</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors ${
            activeTab === 'clients' ? 'bg-[#b5ff32] text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>PRESS, AWARDS & CLIENTS</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        
        {/* ================================================== */}
        {/* TAB 1: PROJECTS & VIDEOS MANAGER                   */}
        {/* ================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-mono-custom font-bold uppercase text-white">PROJECTS REORDER & VIDEO CMS</h2>
                <p className="text-xs text-neutral-400">Change project order (top video stays on top), edit Vimeo IDs, titles, and categories.</p>
              </div>
              <button
                onClick={addNewProject}
                className="px-4 py-2 bg-[#b5ff32] text-black font-mono-custom font-bold text-xs uppercase tracking-widest hover:bg-[#a2eb26] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PROJECT</span>
              </button>
            </div>

            {/* PROJECTS LIST TABLE */}
            <div className="space-y-3">
              {formData.projects.map((proj, idx) => {
                const vimeo = proj.videos?.[0]?.vimeoId || '';
                return (
                  <div
                    key={proj.id}
                    className="bg-neutral-900 border border-neutral-800 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Position Reordering Buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveProject(idx, 'up')}
                          className="p-1 bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30"
                          title="Move Up (Appear Higher on Site)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === formData.projects.length - 1}
                          onClick={() => moveProject(idx, 'down')}
                          className="p-1 bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Poster Thumbnail */}
                      <img
                        src={proj.poster || proj.thumbnail}
                        alt={proj.title}
                        className="w-20 h-12 object-cover border border-neutral-800 shrink-0 bg-neutral-950"
                      />

                      {/* Project Meta */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-custom text-[#b5ff32] font-bold">#{idx + 1}</span>
                          <h3 className="text-sm font-bold text-white uppercase">{proj.title}</h3>
                          <span className="text-[10px] font-mono-custom text-neutral-400 bg-neutral-950 px-2 py-0.5 border border-neutral-800 uppercase">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs font-mono-custom text-neutral-400">
                          Client: {proj.client} | Year: {proj.year} | {vimeo ? `Vimeo ID: ${vimeo}` : 'No Vimeo ID'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="px-3 py-1.5 bg-neutral-800 text-white font-mono-custom text-xs uppercase tracking-wider hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#b5ff32]" />
                        <span>EDIT PROJECT</span>
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 border border-red-900/60 text-red-400 hover:bg-red-950 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 2: INFO PAGE & CONTACT MANAGER                 */}
        {/* ================================================== */}
        {activeTab === 'info' && (
          <div className="space-y-6 max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 p-6 rounded-sm">
            <h2 className="text-lg font-mono-custom font-bold uppercase text-[#b5ff32]">INFORMATION PAGE & DIRECT CONTACT</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono-custom text-neutral-400 uppercase">PERSONAL EMAIL</label>
                <input
                  type="email"
                  value={formData.info?.personalEmail || ''}
                  onChange={(e) => setFormData({ ...formData, info: { ...formData.info, personalEmail: e.target.value } })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-custom text-neutral-400 uppercase">INSTAGRAM URL</label>
                  <input
                    type="text"
                    value={formData.info?.instagramUrl || ''}
                    onChange={(e) => setFormData({ ...formData, info: { ...formData.info, instagramUrl: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono-custom text-neutral-400 uppercase">LINKEDIN URL</label>
                  <input
                    type="text"
                    value={formData.info?.linkedinUrl || ''}
                    onChange={(e) => setFormData({ ...formData, info: { ...formData.info, linkedinUrl: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                  />
                </div>
              </div>

              {/* BIO PARAGRAPHS */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <label className="text-xs font-mono-custom text-[#b5ff32] font-bold uppercase block">ENGLISH BIOGRAPHY PARAGRAPHS</label>
                
                <textarea
                  rows={3}
                  value={formData.info?.bioEn?.p1 || ''}
                  onChange={(e) => setFormData({ ...formData, info: { ...formData.info, bioEn: { ...formData.info?.bioEn, p1: e.target.value } } })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                  placeholder="Paragraph 1..."
                />
                <textarea
                  rows={4}
                  value={formData.info?.bioEn?.p2 || ''}
                  onChange={(e) => setFormData({ ...formData, info: { ...formData.info, bioEn: { ...formData.info?.bioEn, p2: e.target.value } } })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                  placeholder="Paragraph 2..."
                />
                <textarea
                  rows={3}
                  value={formData.info?.bioEn?.p3 || ''}
                  onChange={(e) => setFormData({ ...formData, info: { ...formData.info, bioEn: { ...formData.info?.bioEn, p3: e.target.value } } })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
                  placeholder="Paragraph 3..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 3: PRESS, AWARDS & CLIENTS LIST                */}
        {/* ================================================== */}
        {activeTab === 'clients' && (
          <div className="space-y-6 max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 p-6 rounded-sm">
            <h2 className="text-lg font-mono-custom font-bold uppercase text-[#b5ff32]">CLIENTS & PRESS ARCHIVE</h2>
            
            <div className="space-y-3">
              <label className="text-xs font-mono-custom text-neutral-400 uppercase block">SELECTED CLIENTS LIST (COMMA SEPARATED)</label>
              <textarea
                rows={4}
                value={formData.clients?.join(', ') || ''}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  setFormData({ ...formData, clients: arr });
                }}
                className="w-full bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#b5ff32]"
              />
            </div>
          </div>
        )}

      </div>

      {/* ================================================== */}
      {/* EDIT PROJECT MODAL POPUP                           */}
      {/* ================================================== */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 rounded-sm text-white"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="font-mono-custom font-bold text-sm uppercase text-[#b5ff32]">
                  EDIT PROJECT: {editingProject.title}
                </h3>
                <button onClick={() => setEditingProject(null)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono-custom">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">PROJECT TITLE</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">CATEGORY</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    >
                      <option value="Films">Films</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Stills">Stills</option>
                    </select>
                  </div>
                </div>

                {/* Client & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">CLIENT NAME</label>
                    <input
                      type="text"
                      value={editingProject.client}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">YEAR</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>
                </div>

                {/* VIMEO VIDEO ID & EMBED SETTINGS */}
                <div className="p-4 bg-neutral-950 border border-neutral-800 space-y-3">
                  <span className="text-[#b5ff32] font-bold uppercase block flex items-center gap-2">
                    <Video className="w-4 h-4" /> VIMEO & FEATURED VIDEO SETTINGS
                  </span>

                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">VIMEO VIDEO ID (e.g. 160754109)</label>
                    <input
                      type="text"
                      placeholder="160754109"
                      value={editingProject.videos?.[0]?.vimeoId || ''}
                      onChange={(e) => {
                        const newVimeoId = e.target.value.trim();
                        const updatedVideos = [{
                          ...editingProject.videos?.[0],
                          vimeoId: newVimeoId,
                          embedUrl: newVimeoId ? `https://player.vimeo.com/video/${newVimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0` : editingProject.videos?.[0]?.embedUrl
                        }];
                        setEditingProject({ ...editingProject, videos: updatedVideos });
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">CUSTOM EMBED URL (OVERRIDE)</label>
                    <input
                      type="text"
                      value={editingProject.videos?.[0]?.embedUrl || ''}
                      onChange={(e) => {
                        const updatedVideos = [{ ...editingProject.videos?.[0], embedUrl: e.target.value }];
                        setEditingProject({ ...editingProject, videos: updatedVideos });
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>
                </div>

                {/* Poster & Thumbnail URLs */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">POSTER IMAGE URL</label>
                    <input
                      type="text"
                      value={editingProject.poster || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, poster: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 uppercase">THUMBNAIL IMAGE URL</label>
                    <input
                      type="text"
                      value={editingProject.thumbnail || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white focus:border-[#b5ff32]"
                    />
                  </div>
                </div>

              </div>

              {/* SAVE PROJECT BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 font-mono-custom text-xs uppercase"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => saveProjectModal(editingProject)}
                  className="px-5 py-2 bg-[#b5ff32] text-black font-mono-custom font-bold text-xs uppercase hover:bg-[#a2eb26]"
                >
                  SAVE PROJECT CHANGES
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
