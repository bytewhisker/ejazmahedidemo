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

  return (
    <header className="sticky top-0 z-50 glass-header px-4 sm:px-8 md:px-12 pt-1 md:pt-2 pb-2 border-b border-line transition-all duration-300 select-none">
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
            onClick={() => handleNavClick('projects', 'all')}
          />

          {/* MOBILE TOGGLES */}
          <div className="md:hidden flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-muted hover:text-ink transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-ink focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.div>

        {/* HORIZONTAL NAVBAR ROW — DIRECTLY UNDERNEATH GIANT WORDMARK */}
        <div className="hidden md:flex w-full items-center justify-between border-t border-line/60 pt-2.5 pb-1 text-xs font-mono-custom tracking-[0.22em] uppercase font-bold">

          <nav className="flex items-center gap-8 lg:gap-12">
            <GlitchNavItem
              enText="ALL PROJECTS"
              bnText="সব প্রকল্প"
              arText="جميع المشاريع"
              onClick={() => handleNavClick('projects', 'all')}
              isActive={activeTab === 'projects' && activeFilter === 'all'}
              className={`transition-colors ${activeTab === 'projects' && activeFilter === 'all'
                  ? 'text-ink underline underline-offset-4'
                  : 'text-muted hover:text-ink'
                }`}
            />

            <GlitchNavItem
              enText="FILMS"
              bnText="চলচ্চিত্র"
              arText="أفلام"
              onClick={() => handleNavClick('projects', 'films')}
              isActive={activeTab === 'projects' && activeFilter === 'films'}
              className={`transition-colors ${activeTab === 'projects' && activeFilter === 'films'
                  ? 'text-ink underline underline-offset-4'
                  : 'text-muted hover:text-ink'
                }`}
            />

            <GlitchNavItem
              enText="COMMERCIALS"
              bnText="বিজ্ঞাপন"
              arText="إعلانات"
              onClick={() => handleNavClick('projects', 'commercial')}
              isActive={activeTab === 'projects' && activeFilter === 'commercial'}
              className={`transition-colors ${activeTab === 'projects' && activeFilter === 'commercial'
                  ? 'text-ink underline underline-offset-4'
                  : 'text-muted hover:text-ink'
                }`}
            />

            <GlitchNavItem
              enText="STILLS"
              bnText="স্থিরচিত্র"
              arText="صور ثابتة"
              onClick={() => handleNavClick('stills', 'all')}
              isActive={activeTab === 'stills'}
              className={`transition-colors ${activeTab === 'stills'
                  ? 'text-ink underline underline-offset-4'
                  : 'text-muted hover:text-ink'
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
              className={`transition-colors ${activeTab === 'about'
                  ? 'text-ink underline underline-offset-4'
                  : 'text-muted hover:text-ink'
                }`}
            />

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-muted hover:text-ink transition-colors font-bold"
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
            className="md:hidden overflow-hidden bg-canvas/95 border-t border-line mt-2 px-4 py-4 space-y-4 select-none"
          >
            <nav className="flex flex-col items-start space-y-3 text-xs font-mono-custom tracking-[0.2em] uppercase font-bold">
              <GlitchNavItem
                enText="ALL PROJECTS"
                bnText="সব প্রকল্প"
                arText="جميع المشاريع"
                onClick={() => handleNavClick('projects', 'all')}
                isActive={activeTab === 'projects' && activeFilter === 'all'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'all'
                    ? 'text-ink underline underline-offset-4'
                    : 'text-muted hover:text-ink'
                  }`}
              />

              <GlitchNavItem
                enText="FILMS"
                bnText="চলচ্চিত্র"
                arText="أفلام"
                onClick={() => handleNavClick('projects', 'films')}
                isActive={activeTab === 'projects' && activeFilter === 'films'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'films'
                    ? 'text-ink underline underline-offset-4'
                    : 'text-muted hover:text-ink'
                  }`}
              />

              <GlitchNavItem
                enText="COMMERCIALS"
                bnText="বিজ্ঞাপন"
                arText="إعلانات"
                onClick={() => handleNavClick('projects', 'commercial')}
                isActive={activeTab === 'projects' && activeFilter === 'commercial'}
                className={`w-full py-1 ${activeTab === 'projects' && activeFilter === 'commercial'
                    ? 'text-ink underline underline-offset-4'
                    : 'text-muted hover:text-ink'
                  }`}
              />

              <GlitchNavItem
                enText="STILLS"
                bnText="স্থিরচিত্র"
                arText="صور ثابتة"
                onClick={() => handleNavClick('stills', 'all')}
                isActive={activeTab === 'stills'}
                className={`w-full py-1 ${activeTab === 'stills'
                    ? 'text-ink underline underline-offset-4'
                    : 'text-muted hover:text-ink'
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
                      ? 'text-ink underline underline-offset-4'
                      : 'text-muted hover:text-ink'
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