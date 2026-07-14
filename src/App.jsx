import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { projects } from './data/projects';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('home');

  // Timed Loading Screen (2.8 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Hash-based routing to support browser history, back/forward buttons, and deep linking
  useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const hash = window.location.hash;
      if (hash.startsWith('#/project/')) {
        const slug = hash.replace('#/project/', '');
        const project = projects.find((p) => p.slug === slug);
        if (project) {
          setSelectedProject(project);
          setCurrentRoute('project');
          return;
        }
      } else if (hash === '#/about') {
        setCurrentRoute('about');
        setSelectedProject(null);
        return;
      } else if (hash === '#/contact') {
        setCurrentRoute('contact');
        setSelectedProject(null);
        return;
      }
      setCurrentRoute('home');
      setSelectedProject(null);
    };

    // Run once on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectProjectBySlug = (slug) => {
    window.location.hash = `#/project/${slug}`;
  };

  const goHome = () => {
    window.location.hash = '#/';
  };

  // Filter projects list
  const filteredProjects = currentFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === currentFilter);

  return (
    <>
      <CustomCursor />

      {/* 1. Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="loader-wrapper"
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: 'easeInOut' }
            }}
          >
            <div className="loader-content">
              {/* Target loading gif */}
              <img 
                src="https://ligthelm.work/static/img/loading.gif" 
                alt="Loading..." 
                className="loader-gif" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content */}
      {!isLoading && (
        <motion.div 
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header (Sticky navigation, filters, info trigger) */}
          <Header 
            currentFilter={currentFilter}
            setFilter={setFilter}
            onGoHome={goHome}
            isHeroPage={currentRoute === 'home' && currentFilter === 'all'}
          />

          {/* Full-width Cinematic Hero Video Reel */}
          {currentRoute === 'home' && currentFilter === 'all' && <HeroSection />}

          {/* Main Portfolio section */}
          <main id="archive" style={{ flexGrow: 1 }}>
            <div className="container">
              <AnimatePresence mode="wait">
                {currentRoute === 'project' && selectedProject && (
                  <ProjectDetail 
                    key="details"
                    project={selectedProject} 
                    onBack={goHome} 
                  />
                )}
                {currentRoute === 'about' && (
                  <AboutPage key="about" />
                )}
                {currentRoute === 'contact' && (
                  <ContactPage key="contact" />
                )}
                {currentRoute === 'home' && (
                  <motion.div
                    key="home-view"
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectGrid 
                      projects={filteredProjects} 
                      onSelectProject={selectProjectBySlug}
                    />

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Footer details */}
          <Footer />
        </motion.div>
      )}
    </>
  );
}
