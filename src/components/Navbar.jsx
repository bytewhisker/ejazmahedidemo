import React, { useState, useEffect } from 'react';
import { SmoothHeaderName } from './SmoothHeaderName';
import { GlitchNavItem } from './GlitchNavItem';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCMS } from '../context/CMSContext';

const MobileNavButton = ({ label, isActive, onClick, isLime }) => {
  const [hoverId, setHoverId] = useState(0);

  const handleInteraction = (e) => {
    setHoverId((prev) => prev + 1);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleInteraction}
      onTouchStart={() => setHoverId((prev) => prev + 1)}
      onMouseEnter={() => setHoverId((prev) => prev + 1)}
      className={`group relative shrink-0 py-0.5 transition-colors ${
        isLime ? 'text-[var(--about-ink)]' : 'text-accent'
      }`}
    >
      <span>{label}</span>
      {isActive && (
        <motion.span
          key={hoverId}
          initial={hoverId > 0 ? { scaleX: 1, originX: 1 } : { scaleX: 1, originX: 0 }}
          animate={
            hoverId > 0
              ? { scaleX: [1, 0, 0, 1], originX: [1, 1, 0, 0] }
              : { scaleX: 1, originX: 0 }
          }
          transition={
            hoverId > 0
              ? { duration: 0.42, times: [0, 0.45, 0.5, 1], ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.2 }
          }
          className={`absolute left-0 -bottom-0.5 h-[2px] w-full pointer-events-none ${
            isLime ? 'bg-[var(--about-ink)]' : 'bg-accent'
          }`}
        />
      )}
    </button>
  );
};

export const Navbar = ({ activeTab, setActiveTab, activeFilter, setActiveFilter }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const cms = useCMS();
  const navConfig = cms?.navConfig || {
    hideAllNav: false,
    showOverview: true,
    showFilms: true,
    showCommercial: true,
    showStills: true,
    showReel: true,
    showInformation: true
  };

  // Hysteresis scroll trigger — prevents collapse/expand oscillation loop
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const sy = window.scrollY;
      if (sy > 80 && sy > lastScrollY) {
        setScrolled(true);
      } else if (sy < 15) {
        setScrolled(false);
      }
      lastScrollY = sy;
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
    navConfig.showStills !== false && {
      enText: "STILLS",
      bnText: "স্থিরচিত্র",
      arText: "صور",
      onClick: () => handleNavClick('stills', 'all'),
      isActive: activeTab === 'stills'
    },
    navConfig.showInformation !== false && {
      enText: "INFORMATION",
      bnText: "তথ্য",
      arText: "معلومات",
      onClick: () => handleNavClick('about', 'all'),
      isActive: activeTab === 'about'
    }
  ].filter(Boolean);

  const mobileOverlayItems = [
    navConfig.showOverview !== false && {
      enText: 'overview',
      bnText: 'ওভারভিউ',
      arText: 'نظرة عامة',
      onClick: () => handleNavClick('projects', 'all'),
      isActive: activeTab === 'projects' && activeFilter === 'all'
    },
    navConfig.showFilms !== false && {
      enText: 'films',
      bnText: 'চলচ্চিত্র',
      arText: 'أفلام',
      onClick: () => handleNavClick('projects', 'films'),
      isActive: activeTab === 'projects' && activeFilter === 'films'
    },
    navConfig.showCommercial !== false && {
      enText: 'commercials',
      bnText: 'বিজ্ঞাপন',
      arText: 'إعلانات',
      onClick: () => handleNavClick('projects', 'commercial'),
      isActive: activeTab === 'projects' && activeFilter === 'commercial'
    },
    navConfig.showReel !== false && {
      enText: 'reel',
      bnText: 'রিল',
      arText: 'ريل',
      onClick: () => handleNavClick('reel', 'all'),
      isActive: activeTab === 'reel'
    },
    navConfig.showStills !== false && {
      enText: 'stills',
      bnText: 'স্থিরচিত্র',
      arText: 'صور',
      onClick: () => handleNavClick('stills', 'all'),
      isActive: activeTab === 'stills'
    },
    navConfig.showInformation !== false && {
      enText: 'information',
      bnText: 'তথ্য',
      arText: 'معلومات',
      onClick: () => handleNavClick('about', 'all'),
      isActive: activeTab === 'about'
    },
  ].filter(Boolean);

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
      {/* HERO TITLE BANNER — Scrolls up naturally with page scroll */}
      <div className={`w-full px-4 sm:px-8 md:px-12 pt-4 md:pt-6 pb-2 md:pb-3 select-none ${
        isLime
          ? 'bg-[var(--about-bg)] text-[var(--about-ink)]'
          : 'bg-canvas text-ink'
      }`}>
        <div className="w-full flex items-center justify-between md:justify-start relative pr-16 md:pr-0">
          <SmoothHeaderName
            isLime={isLime}
            onClick={() => handleNavClick('projects', 'all')}
          />

          {/* MOBILE CONTROLS — theme toggle + "MENU" text */}
          <div className="md:hidden flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 transition-colors ${isLime ? 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)]' : 'text-muted hover:text-ink'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`font-haas font-bold text-[10px] sm:text-xs tracking-[0.18em] uppercase transition-opacity ${
                isLime ? 'text-[var(--about-ink)] hover:opacity-70' : 'text-ink hover:opacity-70'
              }`}
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* ROOT STICKY NAVBAR ROW — PINS SMOOTHLY AT TOP-0 ON SCROLL */}
      {!navConfig.hideAllNav && (
        <header className={`sticky top-0 z-50 w-full px-4 sm:px-8 md:px-12 py-2 md:py-3 transition-colors select-none ${
          isLime
            ? 'bg-[var(--about-bg)] text-[var(--about-ink)]'
            : 'glass-header'
        }`}>
          <div className="w-full flex flex-col items-center">

            {/* MOBILE NAV ROW — ALWAYS FLOATING AT TOP-0 WHEN SCROLLING */}
            <div className="md:hidden w-full flex items-center gap-4 py-1 text-[10px] font-haas tracking-[0.18em] uppercase font-bold overflow-x-auto no-scrollbar">
              {[
                navConfig.showOverview !== false && { label: 'OVERVIEW',    isActive: activeTab === 'projects' && activeFilter === 'all',        onClick: () => handleNavClick('projects', 'all') },
                navConfig.showFilms !== false && { label: 'FILMS',       isActive: activeTab === 'projects' && activeFilter === 'films',      onClick: () => handleNavClick('projects', 'films') },
                navConfig.showCommercial !== false && { label: 'COMMERCIALS', isActive: activeTab === 'projects' && activeFilter === 'commercial', onClick: () => handleNavClick('projects', 'commercial') },
                navConfig.showReel !== false && { label: 'REEL',        isActive: activeTab === 'reel',                                     onClick: () => handleNavClick('reel', 'all') },
                navConfig.showStills !== false && { label: 'STILLS',      isActive: activeTab === 'stills',                                   onClick: () => handleNavClick('stills', 'all') },
              ].filter(Boolean).map(({ label, isActive, onClick }) => (
                <MobileNavButton
                  key={label}
                  label={label}
                  isActive={isActive}
                  onClick={onClick}
                  isLime={isLime}
                />
              ))}
            </div>

            {/* DESKTOP HORIZONTAL NAVBAR ROW — ELEGANT STICKY NAV */}
            <div className="hidden md:flex w-full items-center justify-between py-1 md:py-2 text-xs font-haas tracking-[0.22em] uppercase font-bold">
              <nav className="flex items-center gap-8 lg:gap-12">
                {navConfig.showOverview !== false && (
                  <GlitchNavItem
                    enText="OVERVIEW" bnText="ওভারভিউ" arText="نظرة عامة"
                    onClick={() => handleNavClick('projects', 'all')}
                    isActive={activeTab === 'projects' && activeFilter === 'all'}
                    isLime={isLime}
                    className={`transition-colors ${
                      isLime ? 'text-[var(--about-ink)]' : 'text-accent'
                    }`}
                  />
                )}
                {navConfig.showFilms !== false && (
                  <GlitchNavItem
                    enText="FILMS" bnText="চলচ্চিত্র" arText="أفلام"
                    onClick={() => handleNavClick('projects', 'films')}
                    isActive={activeTab === 'projects' && activeFilter === 'films'}
                    isLime={isLime}
                    className={`transition-colors ${
                      isLime ? 'text-[var(--about-ink)]' : 'text-accent'
                    }`}
                  />
                )}
                {navConfig.showCommercial !== false && (
                  <GlitchNavItem
                    enText="COMMERCIALS" bnText="বিজ্ঞাপন" arText="إعلانات"
                    onClick={() => handleNavClick('projects', 'commercial')}
                    isActive={activeTab === 'projects' && activeFilter === 'commercial'}
                    isLime={isLime}
                    className={`transition-colors ${
                      isLime ? 'text-[var(--about-ink)]' : 'text-accent'
                    }`}
                  />
                )}
                {navConfig.showReel !== false && (
                  <GlitchNavItem
                    enText="REEL" bnText="রিল" arText="ريل"
                    onClick={() => handleNavClick('reel', 'all')}
                    isActive={activeTab === 'reel'}
                    isLime={isLime}
                    className={`transition-colors ${
                      isLime ? 'text-[var(--about-ink)]' : 'text-accent'
                    }`}
                  />
                )}
              </nav>

            <div className="flex items-center gap-8">
              {dropdownItems.map((item) => (
                <GlitchNavItem
                  key={item.enText}
                  enText={item.enText} bnText={item.bnText} arText={item.arText}
                  onClick={item.onClick}
                  isActive={item.isActive}
                  isLime={isLime}
                  className={`transition-colors ${
                    isLime ? 'text-[var(--about-ink)]' : 'text-accent'
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
    )}

      {/* ─── MOBILE FULL-SCREEN LIME OVERLAY ─── */}
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
            <div className="flex items-center justify-between">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="font-mega font-extrabold text-black text-[clamp(2.5rem,10vw,5rem)] uppercase leading-none tracking-[0.08em] cursor-pointer"
                onClick={() => { setIsMobileMenuOpen(false); handleNavClick('projects', 'all'); }}
              >
                EJAZ MEHEDI
              </motion.span>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black hover:opacity-60 transition-opacity shrink-0 flex items-center justify-center p-1"
                aria-label="Close menu"
              >
                <span style={{ fontSize: '2rem', lineHeight: 1, fontWeight: 300 }}>✕</span>
              </motion.button>
            </div>

            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-end justify-start pt-16 sm:pt-24 gap-4 sm:gap-6 flex-1 pr-2 overflow-y-auto"
            >
              {mobileOverlayItems.map((item) => (
                <div key={item.enText} className="overflow-hidden pb-1">
                  <motion.div variants={itemVariants}>
                    <GlitchNavItem
                      enText={item.enText}
                      bnText={item.bnText}
                      arText={item.arText}
                      onClick={item.onClick}
                      isActive={item.isActive}
                      className={`font-sans font-normal text-right block text-[clamp(1.8rem,7.5vw,3rem)] leading-[1.15] transition-opacity ${
                        item.isActive
                          ? 'text-black opacity-100 underline underline-offset-[10px] decoration-[2px]'
                          : 'text-black opacity-90 hover:opacity-100'
                      }`}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};