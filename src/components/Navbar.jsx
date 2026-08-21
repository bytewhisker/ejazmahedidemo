import React, { useState, useEffect } from 'react';
import { SmoothHeaderName } from './SmoothHeaderName';
import { GlitchNavItem } from './GlitchNavItem';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ activeTab, setActiveTab, activeFilter, setActiveFilter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (tab, filter = 'all') => {
    setActiveTab(tab);
    setActiveFilter(filter);
    setIsMobileMenuOpen(false);
    if (tab !== activeTab) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLime = activeTab === 'about';

  const dropdownItems = [
    {
      enText: "STILLS",
      bnText: "স্থিরচিত্র",
      arText: "صور ثابتة",
      onClick: () => handleNavClick('stills', 'all'),
      isActive: activeTab === 'stills'
    },
    {
      enText: "INFORMATION",
      bnText: "তথ্য",
      arText: "معلومات",
      onClick: () => handleNavClick('about', 'all'),
      isActive: activeTab === 'about'
    }
  ];

  // Only stills and information live in the mobile overlay
  const mobileOverlayItems = [
    { label: 'stills',      onClick: () => handleNavClick('stills', 'all'), isActive: activeTab === 'stills' },
    { label: 'information', onClick: () => handleNavClick('about', 'all'),  isActive: activeTab === 'about' },
  ];

  const overlayVariants = {
    hidden:  { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
    exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: [0.5, 0, 0.75, 0] } },
  };

  const listVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  };

  return (
    <>
      <header className={`sticky top-0 z-50 px-4 sm:px-8 md:px-12 pt-1 md:pt-2 pb-2 transition-all duration-500 select-none ${
        isLime
          ? 'bg-[#b5ff32]/95 backdrop-blur-md border-b border-black/20 text-black'
          : 'glass-header border-b border-line'
      }`}>
        <div className="w-full mx-auto flex flex-col items-center gap-1.5">

          {/* TOP HERO HEADER TITLE BANNER */}
          <motion.div
            animate={{
              opacity: scrolled ? 0 : 1,
              height: scrolled ? 0 : 'auto',
              scale: scrolled ? 0.96 : 1,
              pointerEvents: scrolled ? 'none' : 'auto'
            }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="w-full flex items-center justify-between md:justify-center relative overflow-visible py-1 pr-16 md:pr-0"
          >
            <SmoothHeaderName
              isLime={isLime}
              onClick={() => handleNavClick('projects', 'all')}
            />

            {/* MOBILE CONTROLS — theme toggle + "menu" text */}
            <div className="md:hidden flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
              <button
                onClick={toggleTheme}
                className={`p-1.5 transition-colors ${isLime ? 'text-black/70 hover:text-black' : 'text-muted hover:text-ink'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* "menu" text button — only opens STILLS + INFO overlay */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`font-mono-custom text-xs font-bold uppercase tracking-[0.22em] transition-colors ${
                  isLime ? 'text-black' : 'text-ink'
                }`}
                aria-label="Open menu"
              >
                menu
              </button>
            </div>
          </motion.div>

          {/* MOBILE NAV ROW — always visible: REEL · OVERVIEW · FILMS · COMMERCIALS */}
          <div className="md:hidden w-full flex items-center gap-4 pb-1 pt-0.5 text-[10px] font-mono-custom tracking-[0.18em] uppercase font-bold overflow-x-auto no-scrollbar">
            {[
              { label: 'REEL',        isActive: activeTab === 'reel',                                     onClick: () => handleNavClick('reel', 'all') },
              { label: 'OVERVIEW',    isActive: activeTab === 'projects' && activeFilter === 'all',        onClick: () => handleNavClick('projects', 'all') },
              { label: 'FILMS',       isActive: activeTab === 'projects' && activeFilter === 'films',      onClick: () => handleNavClick('projects', 'films') },
              { label: 'COMMERCIALS', isActive: activeTab === 'projects' && activeFilter === 'commercial', onClick: () => handleNavClick('projects', 'commercial') },
            ].map(({ label, isActive, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? isLime
                      ? 'text-black underline underline-offset-4 decoration-black decoration-2'
                      : 'text-accent underline underline-offset-4'
                    : isLime
                      ? 'text-black/70 hover:text-black'
                      : 'text-accent hover:text-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* DESKTOP HORIZONTAL NAVBAR ROW */}
          <div className="hidden md:flex w-full items-center justify-between pt-2.5 pb-1 text-xs font-mono-custom tracking-[0.22em] uppercase font-bold">
            <nav className="flex items-center gap-8 lg:gap-12">
              <GlitchNavItem
                enText="REEL" bnText="রিল" arText="ريل"
                onClick={() => handleNavClick('reel', 'all')}
                isActive={activeTab === 'reel'}
                className={`transition-colors ${
                  activeTab === 'reel'
                    ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="OVERVIEW" bnText="ওভারভিউ" arText="نظرة عامة"
                onClick={() => handleNavClick('projects', 'all')}
                isActive={activeTab === 'projects' && activeFilter === 'all'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'all'
                    ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="FILMS" bnText="চলচ্চিত্র" arText="أفلام"
                onClick={() => handleNavClick('projects', 'films')}
                isActive={activeTab === 'projects' && activeFilter === 'films'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'films'
                    ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="COMMERCIALS" bnText="বিজ্ঞাপন" arText="إعلانات"
                onClick={() => handleNavClick('projects', 'commercial')}
                isActive={activeTab === 'projects' && activeFilter === 'commercial'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'commercial'
                    ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-black/80 hover:text-black' : 'text-accent hover:text-accent'
                }`}
              />
            </nav>

            <div className="flex items-center gap-8">
              {dropdownItems.map((item) => (
                <GlitchNavItem
                  key={item.enText}
                  enText={item.enText} bnText={item.bnText} arText={item.arText}
                  onClick={item.onClick}
                  isActive={item.isActive}
                  className={`transition-colors ${
                    item.isActive
                      ? isLime ? 'text-black underline underline-offset-4 decoration-2 decoration-black' : 'text-accent underline underline-offset-4'
                      : isLime ? 'text-black/80 hover:text-black' : 'text-muted hover:text-ink'
                  }`}
                />
              ))}
              <button
                onClick={toggleTheme}
                className={`transition-colors font-bold ${isLime ? 'text-black/70 hover:text-black' : 'text-muted hover:text-ink'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ─── MOBILE FULL-SCREEN LIME OVERLAY (mika style) ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 z-[200] bg-[#b5ff32] flex flex-col px-6 pt-5 pb-10 select-none"
          >
            {/* Top bar: wordmark left + circular CLOSE button right */}
            <div className="flex items-center justify-between mb-auto">
              <span
                className="font-sans font-black text-black text-xl tracking-tight cursor-pointer"
                onClick={() => { setIsMobileMenuOpen(false); handleNavClick('projects', 'all'); }}
              >
                EJAZ MEHEDI
              </span>

              {/* Circular close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-14 h-14 rounded-full bg-black text-[#b5ff32] flex items-center justify-center font-mono-custom text-[10px] font-bold uppercase tracking-[0.15em] leading-tight hover:bg-black/80 transition-colors shrink-0"
                aria-label="Close menu"
              >
                close
              </button>
            </div>

            {/* Nav items — stills + information only, centered, lowercase */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-end justify-center gap-3 flex-1 pr-2"
            >
              {mobileOverlayItems.map((item) => (
                <motion.button
                  key={item.label}
                  variants={itemVariants}
                  onClick={item.onClick}
                  className={`font-sans font-normal text-center leading-none transition-all text-4xl tracking-tight ${
                    item.isActive
                      ? 'text-black underline underline-offset-4 decoration-black decoration-2'
                      : 'text-black/70 hover:text-black'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};