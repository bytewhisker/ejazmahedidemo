import React, { useState } from 'react';
import { stillsData } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext';
import { Maximize2, X, ChevronLeft, ChevronRight, MapPin, Camera } from 'lucide-react';

export const StillsGallery = () => {
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-[#070708] text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono tracking-widest uppercase">
          <Camera className="w-3.5 h-3.5" />
          Anamorphic & 35mm Photography
        </div>
        <h1 className="text-4xl md:text-5xl font-light font-serif tracking-wide text-white">
          {t.stills.title}
        </h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wider">
          {t.stills.subtitle}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stillsData.map((still, idx) => (
          <div
            key={still.id}
            onClick={() => openLightbox(idx)}
            className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 cursor-pointer hover:border-amber-500/50 shadow-xl transition-all duration-500"
          >
            <div className="w-full aspect-[4/3] overflow-hidden bg-neutral-950">
              <img
                src={still.url}
                alt={still.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-between">
              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3 h-3" />
                  {still.location}
                </span>
                <h3 className="text-xl font-serif text-white font-light">
                  {still.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedStill && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 md:p-8"
        >
          {/* Top Bar */}
          <div className="w-full flex justify-between items-center text-white z-10">
            <div className="text-xs font-mono tracking-widest text-neutral-400">
              {selectedIndex + 1} / {stillsData.length}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-amber-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image Container */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4">
            <button
              onClick={showPrev}
              className="absolute left-2 md:left-6 z-20 p-3 rounded-full bg-black/60 text-white hover:text-amber-400 border border-neutral-700/60 backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>

            <img
              src={selectedStill.url}
              alt={selectedStill.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-neutral-800 shadow-2xl"
            />

            <button
              onClick={showNext}
              className="absolute right-2 md:right-6 z-20 p-3 rounded-full bg-black/60 text-white hover:text-amber-400 border border-neutral-700/60 backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>
          </div>

          {/* Bottom Title Info */}
          <div className="text-center space-y-1 z-10">
            <h3 className="text-2xl font-serif text-white font-light">
              {selectedStill.title}
            </h3>
            <p className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              {selectedStill.location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
