import React, { useState } from 'react';
import { SmoothHeaderName } from './SmoothHeaderName';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ activeTab, setActiveTab, activeFilter, setActiveFilter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab, filter = 'all') => {
    setActiveTab(tab);
    setActiveFilter(filter);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-header px-4 sm:px-8 py-4 md:py-6 transition-all duration-300">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between md:grid md:grid-cols-12 md:items-start gap-4">
        
        {/* DESKTOP LEFT: Stacked Categories */}
        <div className="hidden md:block md:col-span-3">
          <nav className="flex flex-col space-y-1 text-xs font-mono-custom tracking-[0.18em] uppercase">
            <button
              onClick={() => handleNavClick('projects', 'all')}
              className={`text-left transition-colors py-0.5 ${
                activeTab === 'projects' && activeFilter === 'all'
                  ? 'text-white font-bold tracking-[0.22em]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              ALL PROJECTS
            </button>
            
            <button
              onClick={() => handleNavClick('projects', 'films')}
              className={`text-left transition-colors py-0.5 ${
                activeTab === 'projects' && activeFilter === 'films'
                  ? 'text-white font-bold tracking-[0.22em]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              FILMS
            </button>

            <button
              onClick={() => handleNavClick('projects', 'commercial')}
              className={`text-left transition-colors py-0.5 ${
                activeTab === 'projects' && activeFilter === 'commercial'
                  ? 'text-white font-bold tracking-[0.22em]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              COMMERCIALS
            </button>

            <button
              onClick={() => handleNavClick('stills', 'all')}
              className={`text-left transition-colors py-0.5 ${
                activeTab === 'stills'
                  ? 'text-white font-bold tracking-[0.22em]'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              STILLS
            </button>
          </nav>
        </div>

        {/* CENTER: Multilingual Title */}
        <div className="flex-1 md:col-span-6 flex justify-center text-center">
          <SmoothHeaderName
            onClick={() => handleNavClick('projects', 'all')}
          />
        </div>

        {/* DESKTOP RIGHT: INFORMATION */}
        <div className="hidden md:flex md:col-span-3 justify-end">
          <button
            onClick={() => handleNavClick('about', 'all')}
            className={`text-xs font-mono-custom tracking-[0.25em] uppercase font-bold transition-colors py-1 ${
              activeTab === 'about'
                ? 'text-white underline underline-offset-8'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            INFORMATION
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:text-neutral-400 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE FULL-SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-black/95 border-b border-neutral-900 px-4 py-6 space-y-6 select-none"
          >
            <div className="space-y-3">
              <nav className="flex flex-col space-y-3 text-sm font-mono-custom tracking-widest uppercase">
                <button
                  onClick={() => handleNavClick('projects', 'all')}
                  className={`text-left py-1 ${
                    activeTab === 'projects' && activeFilter === 'all'
                      ? 'text-white font-bold pl-2 border-l-2 border-white'
                      : 'text-neutral-400'
                  }`}
                >
                  ALL PROJECTS
                </button>

                <button
                  onClick={() => handleNavClick('projects', 'films')}
                  className={`text-left py-1 ${
                    activeTab === 'projects' && activeFilter === 'films'
                      ? 'text-white font-bold pl-2 border-l-2 border-white'
                      : 'text-neutral-400'
                  }`}
                >
                  FILMS
                </button>

                <button
                  onClick={() => handleNavClick('projects', 'commercial')}
                  className={`text-left py-1 ${
                    activeTab === 'projects' && activeFilter === 'commercial'
                      ? 'text-white font-bold pl-2 border-l-2 border-white'
                      : 'text-neutral-400'
                  }`}
                >
                  COMMERCIALS
                </button>

                <button
                  onClick={() => handleNavClick('stills', 'all')}
                  className={`text-left py-1 ${
                    activeTab === 'stills'
                      ? 'text-white font-bold pl-2 border-l-2 border-white'
                      : 'text-neutral-400'
                  }`}
                >
                  STILLS
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <button
                onClick={() => handleNavClick('about', 'all')}
                className={`text-sm font-mono-custom tracking-widest uppercase font-bold w-full text-left py-2 ${
                  activeTab === 'about' ? 'text-white pl-2 border-l-2 border-white' : 'text-neutral-400'
                }`}
              >
                INFORMATION & BIOGRAPHY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
