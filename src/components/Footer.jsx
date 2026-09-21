import React, { useState } from 'react';
import { MegaName } from './MegaName';
import { useCMS } from '../context/CMSContext';
import { X, ExternalLink, Plus, Edit2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer = ({ isLime, showMegaName = isLime, isEditMode, isReel }) => {
  const { footerData, updateFooter } = useCMS();

  const textColor = isLime ? 'text-[var(--about-ink)]' : 'text-accent';
  const copyrightColor = isLime ? 'text-[var(--about-ink-70)]' : 'text-muted';

  const email = footerData?.email || 'ejazmeh.work@gmail.com';
  const phone = footerData?.phone || '+968 78058101';
  const copyright = footerData?.copyright || '© 2026 Ejaz Mehedi. All rights reserved.';

  // Default social links list
  const defaultLinks = [
    { id: 'instagram', label: 'Instagram', url: footerData?.instagram || 'https://instagram.com/ejazmehedi' },
    { id: 'vimeo', label: 'Vimeo', url: footerData?.vimeo || 'https://vimeo.com/ejazmehedi' },
    { id: 'imdb', label: 'IMDb', url: footerData?.imdb || 'https://www.imdb.com/name/nm13341457/' }
  ];

  const socialLinks = footerData?.socialLinks || defaultLinks;

  // Popup modal state for editing a social link
  const [editingLink, setEditingLink] = useState(null);

  const handleBlur = (field, e) => {
    const text = e.target.innerText.trim();
    if (text) {
      updateFooter({ [field]: text });
    }
  };

  const handleSaveSocialLink = (e) => {
    e.preventDefault();
    if (!editingLink) return;

    // Update socialLinks array
    const updatedLinks = socialLinks.map((item) =>
      item.id === editingLink.id ? { ...item, label: editingLink.label, url: editingLink.url } : item
    );

    // If new item
    if (!socialLinks.some((item) => item.id === editingLink.id)) {
      updatedLinks.push(editingLink);
    }

    const footerUpdates = {
      socialLinks: updatedLinks
    };

    // Also update legacy keys if matched
    if (editingLink.id === 'instagram') footerUpdates.instagram = editingLink.url;
    if (editingLink.id === 'vimeo') footerUpdates.vimeo = editingLink.url;
    if (editingLink.id === 'imdb') footerUpdates.imdb = editingLink.url;

    updateFooter(footerUpdates);
    setEditingLink(null);
  };

  const handleDeleteSocialLink = (id) => {
    const updatedLinks = socialLinks.filter((item) => item.id !== id);
    updateFooter({ socialLinks: updatedLinks });
    setEditingLink(null);
  };

  const handleAddSocialLink = () => {
    const newId = `social_${Date.now()}`;
    setEditingLink({ id: newId, label: 'NEW LINK', url: 'https://' });
  };

  return (
    <footer className="overflow-hidden w-full relative mt-auto pt-[2vw] pb-[1vw]">
      <div className="px-4 sm:px-8 md:px-12 w-full">
        {/* Horizontal Divider Line */}
        <div className={`w-full border-t ${isLime ? 'border-[var(--about-ink)]/20' : 'border-white/20'} pt-6`} />

        <div className={`pb-8 sm:pb-12 ${isLime ? 'pb-16 mb-4 justify-end' : 'justify-between'} flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-6 text-xs sm:text-sm md:text-base`}>
          {/* Left Side — Hidden on Info page (isLime) */}
          {!isLime && (
            <div className={`flex flex-col gap-1.5 sm:gap-2 font-sans ${textColor}`}>
              <div>
                <a
                  href={`mailto:${email}`}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur('email', e)}
                  className={`font-bold hover:underline ${
                    isEditMode ? 'outline-dashed outline-2 outline-accent/80 bg-accent/15 px-2 py-0.5 rounded cursor-text focus:bg-white focus:text-black' : ''
                  }`}
                >
                  {email}
                </a>
                <span className="mx-2 font-normal">/</span>
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur('phone', e)}
                  className={`font-normal ${
                    isEditMode ? 'outline-dashed outline-2 outline-accent/80 bg-accent/15 px-2 py-0.5 rounded cursor-text focus:bg-white focus:text-black' : ''
                  }`}
                >
                  {phone}
                </span>
              </div>

              {/* Social Links List */}
              <div className="flex items-center flex-wrap gap-1 font-bold">
                {socialLinks.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    {idx > 0 && <span className="mx-1 font-normal opacity-60">-</span>}
                    
                    {isEditMode ? (
                      <button
                        type="button"
                        onClick={() => setEditingLink({ ...item })}
                        className="outline-dashed outline-2 outline-accent/80 bg-accent/15 hover:bg-accent hover:text-canvas px-2 py-0.5 rounded transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Click to edit link name & URL"
                      >
                        <span>{item.label}</span>
                        <Edit2 className="w-3 h-3 opacity-70" />
                      </button>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </React.Fragment>
                ))}

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="ml-2 px-2 py-0.5 bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-canvas rounded text-xs font-mono-custom font-bold uppercase transition-all cursor-pointer"
                  >
                    + Add Link
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Side Copyright */}
          <div
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('copyright', e)}
            className={`font-sans font-light text-[10px] sm:text-xs md:text-sm ${isLime ? 'text-right' : 'sm:mt-auto'} ${copyrightColor} ${
              isEditMode ? 'outline-dashed outline-2 outline-accent/80 bg-accent/15 px-2 py-0.5 rounded cursor-text focus:bg-white focus:text-black' : ''
            }`}
          >
            {copyright}
          </div>
        </div>
      </div>

      {showMegaName && <MegaName text="EJAZ MEHEDI" isLime={isLime} />}

      {/* Edit Link Modal Popup */}
      <AnimatePresence>
        {editingLink && (
          <div className="fixed inset-0 z-[100002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSaveSocialLink}
              className="bg-surface border border-line-strong rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 font-mono-custom text-xs text-ink"
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-accent" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Edit Social Link</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="p-1 text-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Link Title / Name</label>
                  <input
                    type="text"
                    required
                    value={editingLink.label}
                    onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                    placeholder="e.g. Instagram, Vimeo, IMDb, LinkedIn"
                    className="w-full px-3 py-2 bg-canvas border border-line rounded text-ink outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] tracking-widest text-muted uppercase">Target URL</label>
                  <input
                    type="url"
                    required
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-canvas border border-line rounded text-ink outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => handleDeleteSocialLink(editingLink.id)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded font-bold uppercase cursor-pointer transition-colors"
                >
                  Delete Link
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLink(null)}
                    className="px-3 py-1.5 bg-line/40 hover:bg-line text-ink rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-accent text-canvas font-bold uppercase rounded flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Link</span>
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};