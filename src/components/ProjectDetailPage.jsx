import React, { useState, useEffect } from 'react';
import { CustomPlayer } from './CustomPlayer';
import { Image as ImageIcon, Users, BookOpen, ChevronRight, ChevronLeft, Maximize2, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProjectDetailPage = ({ project, allProjects, onBack, onSelectProject }) => {
  const [underVideoTab, setUnderVideoTab] = useState('screengrabs'); // 'screengrabs', 'crew', 'story'
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    setUnderVideoTab('screengrabs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project]);

  const activeVideo = project.videos[0];

  // Find Prev / Next project
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen bg-black text-white pt-2 pb-24 px-4 sm:px-6 lg:px-8 font-sans select-none"
    >
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Simple Title Header */}
        <div className="space-y-1 pt-2">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-light font-serif tracking-wide text-white">
            {project.title}
          </h1>
          <p className="text-[11px] sm:text-xs font-mono-custom text-neutral-400 uppercase tracking-widest">
            {project.client}
          </p>
        </div>

        {/* Video Player */}
        <div className="w-full bg-neutral-950 overflow-hidden border border-neutral-900">
          <CustomPlayer
            poster={project.poster}
            videoUrl={activeVideo.videoUrl}
            embedUrl={activeVideo.embedUrl}
            title={project.title}
          />
        </div>

        {/* UNDERNEATH VIDEO: TAB SYSTEM (Mobile Responsive Scroll) */}
        <div className="pt-4 md:pt-6 space-y-6 md:space-y-8">
          
          {/* Scrollable Tab Navigation Bar on Mobile */}
          <div className="flex items-center justify-start gap-6 md:gap-8 border-b border-neutral-900 pb-4 text-xs font-mono-custom tracking-[0.2em] uppercase font-bold overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setUnderVideoTab('screengrabs')}
              className={`flex items-center gap-2 transition-colors py-1 shrink-0 ${
                underVideoTab === 'screengrabs' ? 'text-white underline underline-offset-8 font-bold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>SCREENGRABS ({project.screengrabs.length})</span>
            </button>

            <button
              onClick={() => setUnderVideoTab('crew')}
              className={`flex items-center gap-2 transition-colors py-1 shrink-0 ${
                underVideoTab === 'crew' ? 'text-white underline underline-offset-8 font-bold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>PROJECT CREW</span>
            </button>

            <button
              onClick={() => setUnderVideoTab('story')}
              className={`flex items-center gap-2 transition-colors py-1 shrink-0 ${
                underVideoTab === 'story' ? 'text-white underline underline-offset-8 font-bold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>STORY BEHIND THE PROJECT</span>
            </button>
          </div>

          {/* TAB CONTENT 1: Screengrabs */}
          {underVideoTab === 'screengrabs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2"
            >
              {project.screengrabs.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImage(imgUrl)}
                  className="group relative aspect-video overflow-hidden bg-neutral-950 cursor-pointer border border-neutral-900 hover:border-neutral-700 transition-all duration-300"
                >
                  <img
                    src={imgUrl}
                    alt={`Screengrab ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB CONTENT 2: Project Crew */}
          {underVideoTab === 'crew' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2"
            >
              {Object.entries(project.crew).map(([key, val]) => (
                <div key={key} className="border-l border-neutral-800 pl-4 space-y-1">
                  <span className="block text-[10px] font-mono-custom tracking-widest text-neutral-500 uppercase">
                    {key}
                  </span>
                  <span className="block text-xs font-mono-custom text-neutral-200">
                    {val}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB CONTENT 3: Story Behind the Project */}
          {underVideoTab === 'story' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2"
            >
              <div className="space-y-2 border-l border-neutral-800 pl-4">
                <h3 className="text-xs font-mono-custom tracking-widest uppercase text-neutral-400 font-bold">
                  01 / Background & Narrative Concept
                </h3>
                <p className="text-xs leading-relaxed text-neutral-300 font-light">
                  {project.story.background}
                </p>
              </div>

              <div className="space-y-2 border-l border-neutral-800 pl-4">
                <h3 className="text-xs font-mono-custom tracking-widest uppercase text-neutral-400 font-bold">
                  02 / Creative & Technical Process
                </h3>
                <p className="text-xs leading-relaxed text-neutral-300 font-light">
                  {project.story.creativeProcess}
                </p>
              </div>

              <div className="space-y-2 border-l border-neutral-800 pl-4">
                <h3 className="text-xs font-mono-custom tracking-widest uppercase text-neutral-400 font-bold">
                  03 / Production Challenges
                </h3>
                <p className="text-xs leading-relaxed text-neutral-300 font-light">
                  {project.story.challenges}
                </p>
              </div>

              <div className="space-y-2 border-l border-neutral-800 pl-4">
                <h3 className="text-xs font-mono-custom tracking-widest uppercase text-neutral-400 font-bold">
                  04 / On-Set Insights
                </h3>
                <p className="text-xs leading-relaxed text-neutral-300 font-light">
                  {project.story.productionStory}
                </p>
              </div>
            </motion.div>
          )}

        </div>

        {/* Prev / Next Project Navigation Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 md:pt-12 border-t border-neutral-900 text-xs font-mono-custom uppercase tracking-widest">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors truncate max-w-full"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">PREV: {prevProject.title}</span>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors truncate max-w-full"
          >
            <span className="truncate">NEXT: {nextProject.title}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

      </div>

      {/* Lightbox Popup */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 text-white hover:text-neutral-400"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen Screengrab"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </motion.div>
  );
};
