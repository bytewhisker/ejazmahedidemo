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
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit:    { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  const listVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <>
      <header className={`sticky top-0 z-50 px-4 sm:px-8 md:px-12 pt-1 md:pt-2 pb-2 transition-colors duration-700 ease-in-out select-none ${
        isLime
          ? 'bg-[var(--about-bg)] text-[var(--about-ink)]'
          : 'glass-header'
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
              onClick={() => handleNavClick('reel', 'all')}
            />

            {/* MOBILE CONTROLS — theme toggle + "menu" text */}
            <div className="md:hidden flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
              <button
                onClick={toggleTheme}
                className={`p-1.5 transition-colors ${isLime ? 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)]' : 'text-muted hover:text-ink'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* "menu" button — Mika style: just italic text, no box */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`font-haas italic font-bold text-[1.1rem] leading-none transition-opacity ${
                  isLime
                    ? 'text-[var(--about-ink)] hover:opacity-70'
                    : 'text-ink hover:opacity-70'
                }`}
                aria-label="Open menu"
              >
                menu
              </button>
            </div>
          </motion.div>

          {/* MOBILE NAV ROW — always visible: REEL · OVERVIEW · FILMS · COMMERCIALS */}
          <div className="md:hidden w-full flex items-center gap-4 pb-1 pt-0.5 text-[10px] font-haas tracking-[0.18em] uppercase font-bold overflow-x-auto no-scrollbar">
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
                      ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-[var(--about-ink)] decoration-2'
                      : 'text-accent underline underline-offset-4'
                    : isLime
                      ? 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)]'
                      : 'text-accent hover:text-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* DESKTOP HORIZONTAL NAVBAR ROW */}
          <div className="hidden md:flex w-full items-center justify-between pt-2.5 pb-1 text-xs font-haas tracking-[0.22em] uppercase font-bold">
            <nav className="flex items-center gap-8 lg:gap-12">
              <GlitchNavItem
                enText="REEL" bnText="রিল" arText="ريل"
                onClick={() => handleNavClick('reel', 'all')}
                isActive={activeTab === 'reel'}
                className={`transition-colors ${
                  activeTab === 'reel'
                    ? isLime ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-2 decoration-[var(--about-ink)]' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-[var(--about-ink-80)] hover:text-[var(--about-ink)]' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="OVERVIEW" bnText="ওভারভিউ" arText="نظرة عامة"
                onClick={() => handleNavClick('projects', 'all')}
                isActive={activeTab === 'projects' && activeFilter === 'all'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'all'
                    ? isLime ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-2 decoration-[var(--about-ink)]' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-[var(--about-ink-80)] hover:text-[var(--about-ink)]' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="FILMS" bnText="চলচ্চিত্র" arText="أفلام"
                onClick={() => handleNavClick('projects', 'films')}
                isActive={activeTab === 'projects' && activeFilter === 'films'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'films'
                    ? isLime ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-2 decoration-[var(--about-ink)]' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-[var(--about-ink-80)] hover:text-[var(--about-ink)]' : 'text-accent hover:text-accent'
                }`}
              />
              <GlitchNavItem
                enText="COMMERCIALS" bnText="বিজ্ঞাপন" arText="إعلانات"
                onClick={() => handleNavClick('projects', 'commercial')}
                isActive={activeTab === 'projects' && activeFilter === 'commercial'}
                className={`transition-colors ${
                  activeTab === 'projects' && activeFilter === 'commercial'
                    ? isLime ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-2 decoration-[var(--about-ink)]' : 'text-accent underline underline-offset-4'
                    : isLime ? 'text-[var(--about-ink-80)] hover:text-[var(--about-ink)]' : 'text-accent hover:text-accent'
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
                      ? isLime ? 'text-[var(--about-ink)] underline underline-offset-4 decoration-2 decoration-[var(--about-ink)]' : 'text-accent underline underline-offset-4'
                      : isLime ? 'text-[var(--about-ink-80)] hover:text-[var(--about-ink)]' : 'text-accent hover:text-accent'
                  }`}
                />
              ))}
              <button
                onClick={toggleTheme}
                className={`transition-colors font-bold ${isLime ? 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)]' : 'text-muted hover:text-ink'}`}
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
            className="md:hidden fixed inset-0 z-[200] bg-[#b5ff32] flex flex-col px-6 pt-6 pb-10 select-none"
          >
            {/* Top bar: wordmark left + × close button right */}
            <div className="flex items-center justify-between">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="font-haas font-black text-black text-[clamp(2.4rem,10.5vw,5rem)] uppercase leading-none tracking-tight cursor-pointer"
                onClick={() => { setIsMobileMenuOpen(false); handleNavClick('projects', 'all'); }}
              >
                EJAZ MEHEDI
              </motion.span>

              {/* × close button — just the cross icon */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:opacity-60 transition-opacity shrink-0 flex items-center justify-center p-1"
                aria-label="Close menu"
              >
                <span style={{ fontSize: '2rem', lineHeight: 1, fontWeight: 300 }}>✕</span>
              </motion.button>
            </div>

            {/* Nav items — middle-right aligned, lowercase — Mika style */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-end justify-center gap-6 flex-1 pr-2"
            >
              {mobileOverlayItems.map((item) => (
                <div key={item.label} className="overflow-hidden pb-2">
                  <motion.button
                    variants={itemVariants}
                    onClick={item.onClick}
                    className={`font-haas font-bold text-right leading-[1.15] block transition-opacity ${
                      item.isActive
                        ? 'text-black opacity-100 underline underline-offset-[10px] decoration-[3px]'
                        : 'text-black opacity-90 hover:opacity-100'
                    }`}
                    style={{ fontSize: 'clamp(1.7rem, 7.5vw, 3rem)' }}
                  >
                    {item.label}
                  </motion.button>
                </div>
              ))}
            </motion.nav>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};