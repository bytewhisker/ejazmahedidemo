import React, { useState } from 'react';
import { stillsData } from '../data/projectsData';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const StillsGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showNext = (e) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % stillsData.length);
    }
  };

  const showPrev = (e) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + stillsData.length) % stillsData.length);
    }
  };

  const selectedStill = selectedIndex !== null ? stillsData[selectedIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-canvas text-ink pt-4 pb-24 px-4 sm:px-8 max-w-[1800px] mx-auto space-y-12 select-none"
    >
      {/* Minimal Header */}
      <div className="flex items-center justify-between border-b border-line pb-4 text-xs font-mono-custom tracking-[0.25em] uppercase text-muted">
        <span>PHOTOGRAPHY / STILLS ARCHIVE</span>
        <span>{stillsData.length} FRAMES</span>
      </div>

      {/* Pure Photography Grid — Staggered Entrance Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stillsData.map((still, idx) => {
          const formattedIndex = String(idx + 1).padStart(2, '0');
          return (
            <motion.div
              key={still.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.25, 1, 0.5, 1]
              }}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer space-y-2"
            >
              {/* Photo Frame Container — Pure Rectangular Minimalist */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface border border-line group-hover:border-line-strong transition-colors">
                <img
                  src={still.url}
                  alt={still.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                />

                {/* Subtle Hover Zoom Icon */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Minimal Monospace Title & Location */}
              <div className="flex items-center justify-between text-xs font-mono-custom tracking-widest uppercase">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-muted">{formattedIndex}</span>
                  <span className="text-ink group-hover:text-ink-soft transition-colors truncate">{still.title}</span>
                </div>
                <span className="text-[10px] text-muted shrink-0">{still.location}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedStill && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8"
        >
          {/* Top Bar */}
          <div className="w-full max-w-[1800px] flex justify-between items-center text-white z-10 text-xs font-mono-custom tracking-widest uppercase">
            <div>
              {selectedIndex + 1} / {stillsData.length} — {selectedStill.title}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image Container */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-4">
            <button
              onClick={showPrev}
              className="absolute left-2 sm:left-4 z-20 p-3 bg-black/80 border border-neutral-800 text-white hover:border-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={selectedStill.url}
              alt={selectedStill.title}
              className="max-w-full max-h-[80vh] object-contain border border-neutral-900 shadow-2xl"
            />

            <button
              onClick={showNext}
              className="absolute right-2 sm:right-4 z-20 p-3 bg-black/80 border border-neutral-800 text-white hover:border-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Location Info */}
          <div className="text-center text-xs font-mono-custom text-neutral-400 uppercase tracking-widest z-10">
            LOCATION: {selectedStill.location}
          </div>
        </div>
      )}
    </motion.div>
  );
};
