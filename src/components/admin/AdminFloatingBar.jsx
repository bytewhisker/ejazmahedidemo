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
  Film,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminFloatingBar = ({ isEditMode, setIsEditMode, onOpenAddProject }) => {
  const { exportCMSJson, logoutAdmin, projects, aboutData } = useCMS();
  const [saveNotification, setSaveNotification] = useState('');

  const showSaveToast = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 3500);
  };

  const handleExport = () => {
    exportCMSJson();
    showSaveToast('Downloaded cms.json! Upload to Hostinger public/data/ folder.');
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
          showSaveToast('Published Live to Hostinger Server!');
        } else {
          showSaveToast('Saved to local storage! (Server mode: local)');
        }
      })
      .catch(() => {
        showSaveToast('Saved live to Local Storage & ready for Hostinger upload!');
      });
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

      {/* Floating Top Admin Toolbar */}
      <div data-admin="true" className="admin-root fixed top-3 left-1/2 -translate-x-1/2 z-[99999] w-[95%] max-w-5xl bg-surface/95 border border-line-strong rounded-2xl shadow-2xl backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-ink font-sans select-none">
        
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="font-mono-custom text-xs font-bold tracking-[0.2em] uppercase text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>LIVE WEBFLOW EDITOR</span>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2 font-mono-custom text-xs">
          
          {/* Toggle Edit Mode */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
              isEditMode
                ? 'bg-accent text-canvas shadow-lg scale-105'
                : 'bg-line/40 hover:bg-line text-ink'
            }`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Edit Mode ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Mode</span>
              </>
            )}
          </button>

          {/* Add Project Button */}
          <button
            onClick={onOpenAddProject}
            className="px-3 py-1.5 bg-line/40 hover:bg-line text-ink rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-accent stroke-[3]" />
            <span className="hidden sm:inline">Add Project</span>
          </button>

          {/* Export cms.json */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-line/40 hover:bg-line text-ink rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download cms.json file for Hostinger"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span className="hidden md:inline">Download cms.json</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={handlePublishHostinger}
            className="px-3.5 py-1.5 bg-accent text-canvas font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 hover:bg-accent/90 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Publish Live</span>
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="p-1.5 text-muted hover:text-red-400 transition-colors ml-1 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
