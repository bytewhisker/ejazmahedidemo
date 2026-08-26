import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsData, awardsData } from '../data/projectsData';

const CMSContext = createContext(null);

const STORAGE_KEY = 'ezaz_cms_data_v2';
const AUTH_KEY = 'ezaz_admin_authenticated';

export const CMSProvider = ({ children }) => {
  const [projects, setProjects] = useState(projectsData);
  const [awards, setAwards] = useState(awardsData || []);
  const [aboutData, setAboutData] = useState({
    bioTitle: "EJAZ MEHEDI / CINEMATOGRAPHER",
    bioText1: "Ejaz Mehedi is an international cinematographer, colorist, and visual director based between Dhaka, Bangladesh and Muscat, Sultanate of Oman. Specializing in high-end commercial brand films, music videos, and narrative cinema.",
    bioText2: "Best known for photographing 'MOSHARI' (Executive Produced by Jordan Peele & Riz Ahmed), the first Oscar®-qualifying film in Bangladesh history (SXSW 2022 Grand Jury Winner), and 'FOREIGNERS ONLY' for HULU & 20th Digital Studio.",
    location: "DHAKA / MUSCAT",
    email: "mehediejaz@gmail.com",
    instagram: "https://www.instagram.com/ejaz_mehedi",
    vimeo: "https://vimeo.com/ejazmehedi",
    imdb: "https://www.imdb.com/name/nm10850234/"
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check auth session & load CMS data on mount
  useEffect(() => {
    // Auth check
    const authSaved = localStorage.getItem(AUTH_KEY);
    if (authSaved === 'true') {
      setIsAdminLoggedIn(true);
    }

    // CMS Data load (localStorage or public/data/cms.json fallback)
    const savedCMS = localStorage.getItem(STORAGE_KEY);
    if (savedCMS) {
      try {
        const parsed = JSON.parse(savedCMS);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          // Merge code defaults for projects like maktoob to update title, thumbnail, synopsis, and crew
          const mergedProjects = parsed.projects.map((p) => {
            const defaultMatch = projectsData.find((d) => d.id === p.id || d.slug === p.slug);
            if (defaultMatch && (p.id === 'maktoob' || p.slug === 'maktoob' || p.title === 'Maktoob' || !p.synopsis)) {
              return {
                ...p,
                ...defaultMatch,
                title: defaultMatch.title,
                client: defaultMatch.client,
                comingSoon: defaultMatch.comingSoon,
                thumbnail: defaultMatch.thumbnail,
                poster: defaultMatch.poster,
                hoverStills: defaultMatch.hoverStills,
                screengrabs: defaultMatch.screengrabs,
                synopsis: defaultMatch.synopsis,
                description: defaultMatch.description,
                crew: { ...defaultMatch.crew, ...(p.crew || {}) },
                story: { ...defaultMatch.story, ...(p.story || {}) }
              };
            }
            return p;
          });
          setProjects(mergedProjects);
          // Persist updated merged projects to localStorage so cache stays fresh
          persistCMSData(mergedProjects, parsed.awards || awardsData, parsed.aboutData);
        }
        if (parsed.awards && Array.isArray(parsed.awards)) setAwards(parsed.awards);
        if (parsed.aboutData) setAboutData(parsed.aboutData);
      } catch (err) {
        console.warn('Failed to parse saved CMS data from localStorage:', err);
      }
    } else {
      // Try fetching public/data/cms.json if available
      fetch('/data/cms.json')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.projects) setProjects(data.projects);
            if (data.awards) setAwards(data.awards);
            if (data.aboutData) setAboutData(data.aboutData);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoaded(true));
      return;
    }
    setIsLoaded(true);
  }, []);

  // Helper to auto-resolve image paths
  const resolveImagePath = (slug, inputPath) => {
    if (!inputPath) return '';
    const trimmed = inputPath.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    // Plain filename e.g. "still-01.png" or "my-pic.jpg"
    return `/projects/${slug}/${trimmed}`;
  };

  // Auth functions
  const loginAdmin = (username, password) => {
    if ((username === 'admin' || username === 'ejaz') && password === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Reorder projects
  const reorderProjects = (newProjectsList) => {
    setProjects(newProjectsList);
    persistCMSData(newProjectsList, awards, aboutData);
  };

  // Update project fields
  const updateProject = (projectId, updatedFields) => {
    const updated = projects.map((p) => {
      if (p.id === projectId || p.slug === projectId) {
        const merged = { ...p, ...updatedFields };
        // Resolve thumbnail/poster if provided as plain filenames
        if (updatedFields.thumbnail) {
          merged.thumbnail = resolveImagePath(merged.slug, updatedFields.thumbnail);
        }
        if (updatedFields.poster) {
          merged.poster = resolveImagePath(merged.slug, updatedFields.poster);
        }
        return merged;
      }
      return p;
    });
    setProjects(updated);
    persistCMSData(updated, awards, aboutData);
  };

  // Add new project
  const addProject = (newProjectObj) => {
    const slug = newProjectObj.slug || newProjectObj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullObj = {
      id: slug,
      slug: slug,
      title: newProjectObj.title || "UNTITLED PROJECT",
      category: newProjectObj.category || "Commercial",
      year: newProjectObj.year || new Date().getFullYear().toString(),
      client: newProjectObj.client || "",
      aspectRatio: newProjectObj.aspectRatio || "2.39:1 Anamorphic",
      thumbnail: resolveImagePath(slug, newProjectObj.thumbnail || "still-01.png"),
      poster: resolveImagePath(slug, newProjectObj.poster || "still-01.png"),
      hoverStills: [
        resolveImagePath(slug, newProjectObj.thumbnail || "still-01.png")
      ],
      videos: newProjectObj.vimeoId ? [
        {
          id: "main",
          labelKey: "mainFilm",
          title: newProjectObj.title,
          vimeoId: newProjectObj.vimeoId,
          embedUrl: `https://player.vimeo.com/video/${newProjectObj.vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0`
        }
      ] : [],
      synopsis: newProjectObj.synopsis || "",
      description: newProjectObj.description || "",
      screengrabs: newProjectObj.screengrabs || [],
      setStills: newProjectObj.setStills || [],
      crew: newProjectObj.crew || { dop: "Ejaz Mehedi" },
      story: newProjectObj.story || { background: "", creativeProcess: "", challenges: "", productionStory: "" }
    };

    const updated = [fullObj, ...projects];
    setProjects(updated);
    persistCMSData(updated, awards, aboutData);
    return fullObj;
  };

  // Delete project
  const deleteProject = (projectId) => {
    const updated = projects.filter((p) => p.id !== projectId && p.slug !== projectId);
    setProjects(updated);
    persistCMSData(updated, awards, aboutData);
  };

  // Reorder stills within a project
  const reorderStills = (projectId, stillsKey, newStillsArray) => {
    const updated = projects.map((p) => {
      if (p.id === projectId || p.slug === projectId) {
        return { ...p, [stillsKey]: newStillsArray };
      }
      return p;
    });
    setProjects(updated);
    persistCMSData(updated, awards, aboutData);
  };

  // Update About Page content
  const updateAbout = (newAboutObj) => {
    const updated = { ...aboutData, ...newAboutObj };
    setAboutData(updated);
    persistCMSData(projects, awards, updated);
  };

  // Internal persistence trigger
  const persistCMSData = (pList, aList, abData) => {
    const payload = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      projects: pList,
      awards: aList,
      aboutData: abData
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    // Try posting to Hostinger PHP backend endpoint if hosted
    fetch('/api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  // Export JSON file for Hostinger
  const exportCMSJson = () => {
    const payload = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      projects,
      awards,
      aboutData
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "cms.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON configuration
  const importCMSJson = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
      if (data.awards && Array.isArray(data.awards)) setAwards(data.awards);
      if (data.aboutData) setAboutData(data.aboutData);
      persistCMSData(data.projects || projects, data.awards || awards, data.aboutData || aboutData);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Invalid JSON format' };
    }
  };

  // Reset to default code data
  const resetToDefaultData = () => {
    setProjects(projectsData);
    setAwards(awardsData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CMSContext.Provider
      value={{
        projects,
        awards,
        aboutData,
        isAdminLoggedIn,
        isLoaded,
        loginAdmin,
        logoutAdmin,
        reorderProjects,
        updateProject,
        addProject,
        deleteProject,
        reorderStills,
        updateAbout,
        resolveImagePath,
        exportCMSJson,
        importCMSJson,
        resetToDefaultData
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
