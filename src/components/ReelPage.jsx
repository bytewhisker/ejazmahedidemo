import React from 'react';
import { motion } from 'framer-motion';
import { CustomPlayer } from './CustomPlayer';
import { useCMS } from '../context/CMSContext';
import { Plus, Trash2, ArrowUp, ArrowDown, Film, Video } from 'lucide-react';

export const ReelPage = () => {
  const { reels, updateReel, addReel, deleteReel, reorderReels, isAdminLoggedIn, isPreviewMode } = useCMS();
  const isEditMode = isAdminLoggedIn && !isPreviewMode;

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...reels];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    reorderReels(updated);
  };

  const handleMoveDown = (index) => {
    if (index === reels.length - 1) return;
    const updated = [...reels];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    reorderReels(updated);
  };

  const activeReels = reels && reels.length > 0 ? reels : [
    {
      id: 'default-reel',
      title: 'EJAZ MEHEDI — SHOWREEL',
      vimeoId: '782070615',
      category: 'CINEMATOGRAPHY SHOWREEL'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="w-full pt-0 pb-1 font-sans space-y-4"
    >
      {/* Admin Toolbar for Reel Management */}
      {isEditMode && (
        <div className="p-4 bg-accent/10 border border-accent/40 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-mono-custom text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <div>
              <span className="font-bold text-accent uppercase tracking-wider block">REEL VIDEO CMS EDITOR</span>
              <span className="text-[10px] text-muted font-normal">Swap Vimeo IDs, edit titles, or add multiple video reel sections below.</span>
            </div>
          </div>
          <button
            onClick={addReel}
            className="px-4 py-2 bg-accent text-canvas font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-accent/90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Another Reel Video</span>
          </button>
        </div>
      )}

      {/* Reel Videos Stack */}
      <div className="space-y-8">
        {activeReels.map((reel, index) => (
          <motion.div
            key={reel.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`space-y-4 ${isEditMode ? 'p-4 sm:p-6 bg-surface/40 border border-line-strong rounded-2xl relative group' : ''}`}
          >
            {/* Edit Controls Toolbar Header per Reel */}
            {isEditMode && (
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line/40 text-xs font-mono-custom">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-accent/20 text-accent font-bold rounded-lg uppercase tracking-wider text-[10px]">
                    Reel #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-accent" />
                    <span className="text-muted text-[11px]">VIMEO ID:</span>
                    <input
                      type="text"
                      value={reel.vimeoId || ''}
                      onChange={(e) => updateReel(reel.id, { vimeoId: e.target.value.trim() })}
                      placeholder="e.g. 782070615"
                      className="px-3 py-1 bg-canvas border border-accent/60 text-accent font-mono-custom text-xs rounded-lg w-36 sm:w-48 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1.5 bg-surface hover:bg-line text-ink rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === activeReels.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1.5 bg-surface hover:bg-line text-ink rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {activeReels.length > 1 && (
                    <button
                      onClick={() => deleteReel(reel.id)}
                      className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-colors ml-2"
                      title="Delete Reel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="w-full">
              <CustomPlayer
                vimeoId={reel.vimeoId || '782070615'}
                title={reel.title || 'Ejaz Mehedi — Showreel'}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};