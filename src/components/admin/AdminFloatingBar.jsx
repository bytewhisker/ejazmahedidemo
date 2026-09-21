import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Edit3,
  Eye,
  Plus,
  Download,
  UploadCloud,
  LogOut,
  Check,
  Sparkles,
  Undo2,
  Redo2,
  Save,
  RotateCcw,
  History,
  Clock,
  Trash2,
  X,
  LayoutDashboard,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminFloatingBar = ({ isEditMode, setIsEditMode, onOpenAddProject, onOpenDashboard, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const {
    exportCMSJson,
    logoutAdmin,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDraft,
    publishLive,
    discardDraft,
    isDraftModified,
    backups,
    createBackup,
    restoreBackup,
    deleteBackup,
    openDraftPreview,
    history,
    historyIndex,
    restoreHistoryIndex
  } = useCMS();
  const [saveNotification, setSaveNotification] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyTab, setHistoryTab] = useState('timeline'); // 'timeline' | 'snapshots'
  const [backupNoteInput, setBackupNoteInput] = useState('');

  const showSaveToast = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 3500);
  };

  const handleExport = () => {
    exportCMSJson();
    showSaveToast('Downloaded cms.json! Upload to Hostinger public/data/ folder.');
  };

  const handleSaveDraftClick = () => {
    saveDraft();
    showSaveToast('Draft saved successfully! (Not published yet)');
  };

  const handlePublishClick = async () => {
    showSaveToast('Publishing changes live to Hostinger server & site...');
    await publishLive();
    createBackup('Auto Backup before Publish');
    showSaveToast('Published Live Successfully!');
  };

  const handleDiscardClick = () => {
    if (confirm('Discard draft and revert to published live version?')) {
      discardDraft();
      showSaveToast('Draft discarded! Reverted to published version.');
    }
  };

  const handleCreateBackup = (e) => {
    e.preventDefault();
    const note = backupNoteInput.trim() || 'Version Snapshot';
    createBackup(note);
    setBackupNoteInput('');
    showSaveToast(`Version Snapshot Created: "${note}"`);
  };

  const handleRestoreBackup = (bId, note) => {
    if (confirm(`Restore to backup version "${note}"? Current changes will be overwritten.`)) {
      const res = restoreBackup(bId);
      if (res.success) {
        showSaveToast(`Restored version: "${note}" (${res.timestamp})`);
        setShowHistoryModal(false);
      }
    }
  };

  return (
    <>
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100000] bg-accent text-canvas px-6 py-3 rounded-full font-mono-custom text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{saveNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Tab when Sidebar is Collapsed */}
      {isSidebarCollapsed && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed top-5 left-5 z-[99999] bg-black/95 border border-accent/60 text-accent px-4 py-2.5 rounded-full font-mono-custom text-xs font-bold shadow-2xl flex items-center gap-2.5 hover:bg-accent hover:text-canvas transition-all cursor-pointer backdrop-blur-md active:scale-95 group"
          title="Open Webflow Studio Sidebar"
        >
          <Sliders className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span>WEBFLOW STUDIO</span>
          <ChevronRight className="w-4 h-4 text-accent group-hover:text-canvas" />
        </motion.button>
      )}

      {/* Left Sidebar Studio Control Panel */}
      {!isSidebarCollapsed && (
        <div data-admin="true" className="admin-root fixed top-0 left-0 bottom-0 z-[99999] w-72 bg-black/95 border-r border-accent/40 backdrop-blur-2xl p-4 flex flex-col justify-between text-ink font-mono-custom select-none shadow-2xl overflow-y-auto">
          
          {/* Top Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-line/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shrink-0" />
                <span className="text-xs font-bold tracking-widest uppercase text-ink flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>WEBFLOW STUDIO</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isDraftModified && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold uppercase tracking-wider">
                    Unsaved
                  </span>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="p-1 text-muted hover:text-accent transition-colors cursor-pointer rounded-md hover:bg-line/40"
                  title="Collapse Sidebar (View Full Width Website)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

          {/* Quick Undo / Redo / History */}
          <div className="flex items-center justify-between gap-2 p-2 bg-surface/60 border border-line/40 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (canUndo) {
                    undo();
                    showSaveToast('Undid last edit (Ctrl+Z)');
                  }
                }}
                disabled={!canUndo}
                className={`p-1.5 rounded-lg flex items-center transition-colors ${
                  canUndo ? 'bg-line/40 hover:bg-line text-ink cursor-pointer' : 'opacity-30 cursor-not-allowed text-muted'
                }`}
                title="Undo Edit (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (canRedo) {
                    redo();
                    showSaveToast('Redid last edit (Ctrl+Y)');
                  }
                }}
                disabled={!canRedo}
                className={`p-1.5 rounded-lg flex items-center transition-colors ${
                  canRedo ? 'bg-line/40 hover:bg-line text-ink cursor-pointer' : 'opacity-30 cursor-not-allowed text-muted'
                }`}
                title="Redo Edit (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-md text-[10px] font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer border border-accent/20"
              title="View Change History Timeline & Saved Version Snapshots"
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({history ? history.length : 0})</span>
            </button>
          </div>

          {/* EDIT MODE TOGGLE */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Studio Mode</label>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isEditMode
                  ? 'bg-accent text-canvas shadow-accent/20 ring-2 ring-accent/60 scale-[1.01]'
                  : 'bg-surface hover:bg-line border border-line text-muted hover:text-ink'
              }`}
            >
              {isEditMode ? (
                <>
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                  <span>EDIT MODE ON</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>VIEW MODE (PREVIEW)</span>
                </>
              )}
            </button>
          </div>

          {/* STUDIO ACTIONS LIST */}
          <div className="space-y-2 pt-2 border-t border-line/40">
            <label className="text-[10px] uppercase tracking-widest text-muted font-bold">Quick Actions</label>
            
            {/* Open Full SaaS CMS Dashboard */}
            <button
              onClick={onOpenDashboard}
              className="w-full px-3 py-2 bg-surface hover:bg-line/80 border border-line/60 text-ink text-xs font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-accent" />
                <span>Media & CMS Manager</span>
              </div>
              <span className="text-[10px] text-accent">➔</span>
            </button>

            {/* Add Project Button */}
            <button
              onClick={onOpenAddProject}
              className="w-full px-3 py-2 bg-surface hover:bg-line/80 border border-line/60 text-ink text-xs font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent stroke-[3]" />
                <span>Add New Project</span>
              </div>
              <span className="text-[10px] text-accent">+</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={handleSaveDraftClick}
              className="w-full px-3 py-2 bg-surface hover:bg-line/80 border border-line/60 text-ink text-xs font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Draft</span>
              </div>
              <span className="text-[10px] text-amber-400 font-normal">Local</span>
            </button>

            {/* Preview Draft in new tab */}
            <button
              onClick={openDraftPreview}
              className="w-full px-3 py-2 bg-surface hover:bg-line/80 border border-line/60 text-ink text-xs font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-accent" />
                <span>Preview Draft Page</span>
              </div>
              <span className="text-[10px] text-muted font-normal">New Tab</span>
            </button>

            {/* Discard Draft if modified */}
            {isDraftModified && (
              <button
                onClick={handleDiscardClick}
                className="w-full px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard Draft Changes</span>
              </button>
            )}

            {/* Export cms.json */}
            <button
              onClick={handleExport}
              className="w-full px-3 py-2 bg-surface hover:bg-line/80 border border-line/60 text-ink text-xs font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-accent" />
                <span>Export cms.json</span>
              </div>
              <span className="text-[10px] text-muted">Backup</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: PUBLISH LIVE & LOGOUT */}
        <div className="space-y-3 pt-4 border-t border-line/40">
          <button
            onClick={handlePublishClick}
            className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-canvas font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            <span>PUBLISH LIVE NOW</span>
          </button>

          <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
            <span className="truncate">Client Admin Active</span>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1 text-muted hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </div>
      )}

      {/* Edit History Timeline & Backup Snapshots Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100005] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-line-strong rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-ink font-sans space-y-5 relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-accent" />
                  <h3 className="font-mono-custom text-sm uppercase tracking-widest font-bold text-ink">
                    CMS Edit History & Restore Timeline
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 text-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Switcher: Change Log Timeline vs Version Snapshots */}
              <div className="flex items-center gap-2 bg-canvas p-1 rounded-xl border border-line">
                <button
                  onClick={() => setHistoryTab('timeline')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-custom font-bold uppercase transition-colors cursor-pointer ${
                    historyTab === 'timeline'
                      ? 'bg-accent text-canvas shadow'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Edit Timeline ({history ? history.length : 0})
                </button>
                <button
                  onClick={() => setHistoryTab('snapshots')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-custom font-bold uppercase transition-colors cursor-pointer ${
                    historyTab === 'snapshots'
                      ? 'bg-accent text-canvas shadow'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Saved Snapshots ({backups.length})
                </button>
              </div>

              {/* TAB 1: EDIT HISTORY TIMELINE */}
              {historyTab === 'timeline' && (
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[280px]">
                  {(!history || history.length === 0) ? (
                    <div className="text-center py-12 text-muted font-mono-custom text-xs">
                      No edit steps recorded in this session yet.
                    </div>
                  ) : (
                    history.map((step, idx) => {
                      const isActive = idx === historyIndex;
                      return (
                        <div
                          key={step.id || idx}
                          className={`p-3.5 rounded-xl border font-mono-custom text-xs flex items-center justify-between gap-4 transition-all ${
                            isActive
                              ? 'bg-accent/15 border-accent shadow-md'
                              : 'bg-canvas/60 border-line/60 hover:border-accent/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-ink uppercase">
                                #{idx + 1} {step.label || 'Saved Edit'}
                              </span>
                              {isActive && (
                                <span className="px-2 py-0.5 bg-accent text-canvas font-bold text-[9px] uppercase tracking-wider rounded-full flex items-center gap-1 animate-pulse">
                                  <span>● Current Active State</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-muted flex items-center gap-3">
                              <span>Time: {step.timestamp || 'Just now'}</span>
                              <span>{step.projects ? step.projects.length : 0} projects in stack</span>
                            </div>
                          </div>

                          {!isActive && (
                            <button
                              onClick={() => {
                                restoreHistoryIndex(idx);
                                showSaveToast(`Reverted site back to Step #${idx + 1}`);
                              }}
                              className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-canvas font-mono-custom text-xs font-bold uppercase rounded-lg transition-all cursor-pointer shrink-0"
                            >
                              Go Back To Here
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: VERSION SNAPSHOTS */}
              {historyTab === 'snapshots' && (
                <div className="space-y-4 flex-1 flex flex-col min-h-[280px]">
                  {/* Save New Version Snapshot Form */}
                  <form onSubmit={handleCreateBackup} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter backup note (e.g., 'Before updating awards')..."
                      value={backupNoteInput}
                      onChange={(e) => setBackupNoteInput(e.target.value)}
                      className="flex-1 bg-canvas border border-line rounded-lg px-3 py-2 text-xs font-mono-custom text-ink outline-none focus:border-accent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-accent text-canvas font-mono-custom text-xs font-bold uppercase rounded-lg hover:opacity-90 cursor-pointer shadow-md shrink-0"
                    >
                      Save Snapshot
                    </button>
                  </form>

                  {/* Version History Snapshots List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {backups.length === 0 ? (
                      <div className="text-center py-12 text-muted font-mono-custom text-xs">
                        No saved version snapshots yet. Click "Save Snapshot" above to create one.
                      </div>
                    ) : (
                      backups.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 bg-canvas/60 border border-line/60 rounded-xl flex items-center justify-between gap-4 hover:border-accent/40 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-custom font-bold text-xs text-accent">
                                {item.note || 'Version Snapshot'}
                              </span>
                              <span className="text-[10px] font-mono-custom text-muted bg-line/40 px-2 py-0.5 rounded">
                                {item.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted font-mono-custom">
                              {item.data?.projects?.length || 0} projects · {item.data?.awards?.length || 0} awards · {item.data?.press?.length || 0} press items
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleRestoreBackup(item.id, item.note)}
                              className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-canvas font-mono-custom text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
                            >
                              Restore Version
                            </button>
                            <button
                              onClick={() => deleteBackup(item.id)}
                              className="p-1.5 text-muted hover:text-red-400 cursor-pointer transition-colors"
                              title="Delete Version Snapshot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

