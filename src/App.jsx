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

function getRouteFromPath(pathname) {
  if (pathname.startsWith('/project/')) {
    const slug = pathname.replace('/project/', '');
    const project = projects.find((p) => p.slug === slug);
    if (project) return { route: 'project', project };
  } else if (pathname === '/about') {
    return { route: 'about', project: null };
  } else if (pathname === '/contact') {
    return { route: 'contact', project: null };
  }
  return { route: 'home', project: null };
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('home');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const { route, project } = getRouteFromPath(window.location.pathname);
      setCurrentRoute(route);
      setSelectedProject(project);
    };

    handleRouteChange();

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const selectProjectBySlug = (slug) => navigate(`/project/${slug}`);
  const goHome = () => navigate('/');
  const goAbout = () => navigate('/about');
  const goContact = () => navigate('/contact');

  const filteredProjects = currentFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === currentFilter);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="loader-wrapper"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          >
            <div className="loader-content">
              <img 
                src="https://ligthelm.work/static/img/loading.gif" 
                alt="Loading..." 
                className="loader-gif" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div 
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Header 
            currentFilter={currentFilter}
            setFilter={setFilter}
            onGoHome={goHome}
            onGoAbout={goAbout}
            onGoContact={goContact}
            isHeroPage={currentRoute === 'home' && currentFilter === 'all'}
          />

          {currentRoute === 'home' && currentFilter === 'all' && <HeroSection />}

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

          <Footer />
        </motion.div>
      )}
    </>
  );
}
