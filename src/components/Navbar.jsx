import React, { useState, useEffect } from 'react';
import { SmoothHeaderName } from './SmoothHeaderName';
import { GlitchNavItem } from './GlitchNavItem';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ activeTab, setActiveTab, activeFilter, setActiveFilter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab, filter = 'all') => {
    setActiveTab(tab);
    setActiveFilter(filter);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLime = activeTab === 'about';

  return (
    <header className={`sticky top-0 z-50 px-4 sm:px-8 md:px-12 pt-1 md:pt-2 pb-2 transition-all duration-500 select-none ${
      isLime
        ? 'bg-[#b5ff32]/95 backdrop-blur-md border-b border-black/20 text-black'
        : 'glass-header border-b border-line'
    }`}>
      <div className="w-full mx-auto flex flex-col items-center gap-1.5">

        {/* TOP HERO HEADER TITLE BANNER — GIANT OVERSIZED WORDMARK */}
        <motion.div
          animate={{
            opacity: scrolled ? 0 : 1,
            height: scrolled ? 0 : 'auto',
            scale: scrolled ? 0.96 : 1,
            pointerEvents: scrolled ? 'none' : 'auto'
          }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="w-full flex items-center justify-between md:justify-center relative overflow-visible py-1"
        >
          <SmoothHeaderName
            isLime={isLime}
            onClick={() => handleNavClick('projects', 'all')}
          />

          {/* MOBILE TOGGLES */}
          <div className="md:hidden flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 transition-colors ${isLime ? 'text-black/70 hover:text-black' : 'text-muted hover:text-ink'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 focus:outline-none ${isLime ? 'text-black' : 'text-ink'}`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.div>

        {/* HORIZONTAL NAVBAR ROW — DIRECTLY UNDERNEATH GIANT WORDMARK */}
        <div className="hidden md:flex w-full items-center justify-between pt-2.5 pb-1 text-xs font-mono-custom tracking-[0.22em] uppercase font-bold">

          <nav className="flex items-center gap-8 lg:gap-12">
            <GlitchNavItem
              enText="ALL PROJECTS"
              bnText="সব প্রকল্প"
              arText="جميع المشاريع"
              onClick={() => handleNavClick('projects', 'all')}
              isActive={activeTab === 'projects' && activeFilter === 'all'}
              className={`transition-colors ${
                activeTab === 'projects' && activeFilter === 'all'
                  ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                  : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
              }`}
            />

            <GlitchNavItem
              enText="FILMS"
              bnText="চলচ্চিত্র"
              arText="أفلام"
              onClick={() => handleNavClick('projects', 'films')}
              isActive={activeTab === 'projects' && activeFilter === 'films'}
              className={`transition-colors ${
                activeTab === 'projects' && activeFilter === 'films'
                  ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                  : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
              }`}
            />

            <GlitchNavItem
              enText="COMMERCIALS"
              bnText="বিজ্ঞাপন"
              arText="إعلانات"
              onClick={() => handleNavClick('projects', 'commercial')}
              isActive={activeTab === 'projects' && activeFilter === 'commercial'}
              className={`transition-colors ${
                activeTab === 'projects' && activeFilter === 'commercial'
                  ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                  : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
              }`}
            />

            <GlitchNavItem
              enText="STILLS"
              bnText="স্থিরচিত্র"
              arText="صور ثابتة"
              onClick={() => handleNavClick('stills', 'all')}
              isActive={activeTab === 'stills'}
              className={`transition-colors ${
                activeTab === 'stills'
                  ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                  : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
              }`}
            />
          </nav>

          <div className="flex items-center gap-8">
            <GlitchNavItem
              enText="INFORMATION"
              bnText="তথ্য"
              arText="معلومات"
              onClick={() => handleNavClick('about', 'all')}
              isActive={activeTab === 'about'}
              className={`transition-colors ${
                activeTab === 'about'
                  ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                  : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
              }`}
            />

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 transition-colors font-bold ${
                isLime ? 'text-black/70 hover:text-black' : 'text-muted hover:text-ink'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
          </div>
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
            className={`md:hidden overflow-hidden border-t mt-2 px-4 py-4 space-y-4 select-none ${
              isLime ? 'bg-[#b5ff32] border-black/20 text-black' : 'bg-canvas/95 border-line'
            }`}
          >
            <nav className="flex flex-col items-start space-y-3 text-xs font-mono-custom tracking-[0.2em] uppercase font-bold">
              <GlitchNavItem
                enText="ALL PROJECTS"
                bnText="সব প্রকল্প"
                arText="جميع المشاريع"
                onClick={() => handleNavClick('projects', 'all')}
                isActive={activeTab === 'projects' && activeFilter === 'all'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'all'
                    ? 'text-accent underline underline-offset-4'
                    : 'text-accent hover:text-accent'
                  }`}
              />

              <GlitchNavItem
                enText="FILMS"
                bnText="চলচ্চিত্র"
                arText="أفلام"
                onClick={() => handleNavClick('projects', 'films')}
                isActive={activeTab === 'projects' && activeFilter === 'films'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'films'
                    ? 'text-accent underline underline-offset-4'
                    : 'text-accent hover:text-accent'
                  }`}
              />

              <GlitchNavItem
                enText="COMMERCIALS"
                bnText="বিজ্ঞাপন"
                arText="إعلانات"
                onClick={() => handleNavClick('projects', 'commercial')}
                isActive={activeTab === 'projects' && activeFilter === 'commercial'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'commercial'
                    ? 'text-accent underline underline-offset-4'
                    : 'text-accent hover:text-accent'
                  }`}
              />

              <GlitchNavItem
                enText="STILLS"
                bnText="স্থিরচিত্র"
                arText="صور ثابتة"
                onClick={() => handleNavClick('stills', 'all')}
                isActive={activeTab === 'stills'}
                className={`w-full py-1 ${activeTab === 'stills'
                    ? 'text-accent underline underline-offset-4'
                    : 'text-accent hover:text-accent'
                  }`}
              />

              <div className="pt-2 w-full border-t border-line">
                <GlitchNavItem
                  enText="INFORMATION"
                  bnText="তথ্য"
                  arText="معلومات"
                  onClick={() => handleNavClick('about', 'all')}
                  isActive={activeTab === 'about'}
                  className={`w-full py-1 ${activeTab === 'about'
                      ? 'text-accent underline underline-offset-4'
                      : 'text-accent hover:text-accent'
                    }`}
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};