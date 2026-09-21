import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsData, awardsData, pressData, clientsData } from '../data/projectsData';
import { DEFAULT_NAV_CONFIG } from '../data/navConfig';

const CMSContext = createContext(null);

const STORAGE_KEY_DRAFT = 'ezaz_cms_draft_v4';
const STORAGE_KEY_PUBLISHED = 'ezaz_cms_published_v4';
const STORAGE_KEY_NAV = 'ezaz_cms_nav_config_v1';
const AUTH_KEY = 'ezaz_admin_authenticated';

const defaultFooterData = {
  email: "ejazmeh.work@gmail.com",
  phone: "+968 78058101",
  instagram: "https://www.instagram.com/ejazmehedi",
  vimeo: "https://vimeo.com/ejazmehedi",
  imdb: "https://www.imdb.com/name/nm13341457/",
  copyright: "© 2026 Ejaz Mehedi. All rights reserved."
};

const STORAGE_KEY_BACKUPS = 'ezaz_cms_backups_v4';

export const CMSProvider = ({ children }) => {
  const [navConfig, setNavConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NAV);
      return saved ? { ...DEFAULT_NAV_CONFIG, ...JSON.parse(saved) } : DEFAULT_NAV_CONFIG;
    } catch {
      return DEFAULT_NAV_CONFIG;
    }
  });

  const updateNavConfig = (updates) => {
    setNavConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY_NAV, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save navConfig', e);
      }
      return next;
    });
  };

  const toggleNavItem = (key) => {
    setNavConfig((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY_NAV, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save navConfig', e);
      }
      return next;
    });
  };

  const [projects, setProjects] = useState(projectsData);
  const [awards, setAwards] = useState(awardsData || []);
  const [press, setPress] = useState(pressData || []);
  const [clients, setClients] = useState(clientsData || []);
  const [aboutData, setAboutData] = useState({
    bioTitle: "EJAZ MEHEDI / CINEMATOGRAPHER",
    bioText1: "Ejaz Mehedi is an international cinematographer, colorist, and visual director based between Dhaka, Bangladesh and Muscat, Sultanate of Oman. Specializing in high-end commercial brand films, music videos, and narrative cinema.",
    bioText2: "Best known for photographing 'MOSHARI' (Executive Produced by Jordan Peele & Riz Ahmed), winner of the SXSW 2022 Grand Jury Award, and 'FOREIGNERS ONLY' for HULU & 20th Digital Studio.",
    location: "DHAKA / MUSCAT",
    email: "ejazmeh.work@gmail.com",
    instagram: "https://www.instagram.com/ejazmehedi",
    vimeo: "https://vimeo.com/ejazmehedi",
    imdb: "https://www.imdb.com/name/nm13341457/"
  });
  const [footerData, setFooterData] = useState(defaultFooterData);

  // Backups state for Snapshot Version Control
  const [backups, setBackups] = useState([]);

  // Published snapshot state for Draft comparison
  const [publishedState, setPublishedState] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(window.location.search.includes('preview=draft'));

  // History stack for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Default reels data
  const defaultReelsData = [
    {
      id: 'reel-1',
      title: 'EJAZ MEHEDI — SHOWREEL',
      vimeoId: '782070615',
      category: 'CINEMATOGRAPHY SHOWREEL',
      description: 'Selected cinematography & visual direction highlights across feature films, narrative shorts, and commercial brand films.'
    }
  ];

  const [reels, setReels] = useState(defaultReelsData);

  // Helper to push state to history stack with change label & timestamp
  const pushToHistory = (newProjects, newAwards, newPress, newClients, newAbout, newFooter, newReels = reels, actionLabel = 'Saved Edit') => {
    const snapshot = {
      id: 'step_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      label: actionLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      projects: JSON.parse(JSON.stringify(newProjects)),
      awards: JSON.parse(JSON.stringify(newAwards)),
      press: JSON.parse(JSON.stringify(newPress)),
      clients: JSON.parse(JSON.stringify(newClients)),
      aboutData: JSON.parse(JSON.stringify(newAbout)),
      footerData: JSON.parse(JSON.stringify(newFooter)),
      reels: JSON.parse(JSON.stringify(newReels))
    };

    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const updated = [...trimmed, snapshot].slice(-50);
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  // Restore state to specific history step index
  const restoreHistoryIndex = (idx) => {
    if (idx >= 0 && idx < history.length) {
      const target = history[idx];
      if (target) {
        setProjects(target.projects);
        setAwards(target.awards);
        setPress(target.press || []);
        setClients(target.clients || []);
        setAboutData(target.aboutData);
        setFooterData(target.footerData);
        if (target.reels) setReels(target.reels);
        setHistoryIndex(idx);
        saveDraftInternal(
          target.projects,
          target.awards,
          target.press,
          target.clients,
          target.aboutData,
          target.footerData,
          target.reels || reels
        );
      }
    }
  };

  // Save draft internal helper
  const saveDraftInternal = (pList, aList, prList, cList, abData, ftData, rList = reels) => {
    const payload = {
      version: 3,
      lastUpdated: new Date().toISOString(),
      projects: pList,
      awards: aList,
      press: prList,
      clients: cList,
      aboutData: abData,
      footerData: ftData,
      reels: rList
    };
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(payload));
    } catch (e) {}
  };

  // Save Draft explicitly
  const saveDraft = () => {
    saveDraftInternal(projects, awards, press, clients, aboutData, footerData, reels);
  };

  // Publish Live
  const publishLive = async () => {
    const payload = {
      version: 3,
      lastUpdated: new Date().toISOString(),
      projects,
      awards,
      press,
      clients,
      aboutData,
      footerData,
      reels
    };

    setPublishedState(payload);

    try {
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(payload));
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(payload));
    } catch (e) {}

    // Post to Hostinger PHP endpoint if hosted
    try {
      await fetch('/api/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  };

  // CRUD for Reels
  const updateReel = (reelId, updatedFields) => {
    const updated = reels.map((r) => (r.id === reelId ? { ...r, ...updatedFields } : r));
    setReels(updated);
    saveDraftInternal(projects, awards, press, clients, aboutData, footerData, updated);
    pushToHistory(projects, awards, press, clients, aboutData, footerData, updated);
  };

  const addReel = () => {
    const newReel = {
      id: `reel-${Date.now()}`,
      title: 'NEW REEL SHOWCASE',
      vimeoId: '782070615',
      category: 'COMMERCIAL / FILM REEL',
      description: 'Add description for this video reel...'
    };
    const updated = [...reels, newReel];
    setReels(updated);
    saveDraftInternal(projects, awards, press, clients, aboutData, footerData, updated);
    pushToHistory(projects, awards, press, clients, aboutData, footerData, updated);
    return newReel;
  };

  const deleteReel = (reelId) => {
    if (reels.length <= 1) return;
    const updated = reels.filter((r) => r.id !== reelId);
    setReels(updated);
    saveDraftInternal(projects, awards, press, clients, aboutData, footerData, updated);
    pushToHistory(projects, awards, press, clients, aboutData, footerData, updated);
  };

  const reorderReels = (newReelsList) => {
    setReels(newReelsList);
    saveDraftInternal(projects, awards, press, clients, aboutData, footerData, newReelsList);
    pushToHistory(projects, awards, press, clients, aboutData, footerData, newReelsList);
  };

  // Check auth session & load CMS data on mount
  useEffect(() => {
    const authSaved = localStorage.getItem(AUTH_KEY);
    if (authSaved === 'true') {
      setIsAdminLoggedIn(true);
    }

    const isPreviewDraftUrl = window.location.search.includes('preview=draft');
    const savedPreviewDraft = localStorage.getItem('ezaz_cms_preview_draft');
    if (isPreviewDraftUrl) {
      setIsPreviewMode(true);
    }

    // CMS Data load (Draft or Published or defaults)
    const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
    const savedPublished = localStorage.getItem(STORAGE_KEY_PUBLISHED);

    let initialProjects = projectsData;
    let initialAwards = awardsData || [];
    let initialPress = pressData || [];
    let initialClients = clientsData || [];
    let initialAbout = aboutData;
    let initialFooter = defaultFooterData;

    if (isPreviewDraftUrl && savedPreviewDraft) {
      try {
        const parsedPrev = JSON.parse(savedPreviewDraft);
        if (parsedPrev.projects) initialProjects = parsedPrev.projects;
        if (parsedPrev.awards && Array.isArray(parsedPrev.awards)) {
          const parsedMap = new Map(parsedPrev.awards.map((a) => [a.id, a]));
          const codeAwards = awardsData || [];
          const merged = codeAwards.map((codeAward) => {
            const saved = parsedMap.get(codeAward.id);
            return saved ? { ...codeAward, ...saved } : codeAward;
          });
          const codeIds = new Set(codeAwards.map(a => a.id));
          const customAwards = parsedPrev.awards.filter(a => !codeIds.has(a.id));
          initialAwards = [...merged, ...customAwards];
        }
        if (parsedPrev.press) initialPress = parsedPrev.press;
        if (parsedPrev.clients) initialClients = parsedPrev.clients;
        if (parsedPrev.aboutData) initialAbout = parsedPrev.aboutData;
        if (parsedPrev.footerData) initialFooter = parsedPrev.footerData;
      } catch (e) {}
    } else if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          initialProjects = parsed.projects.map((p) => {
            const base = projectsData.find((b) => b.id === p.id);
            if (!base) return p;
            return {
              ...p,
              description: base.id === 'mai-natures-new-address' ? base.description : (p.description || base.description),
              synopsis: base.id === 'mai-natures-new-address' ? base.description : (p.synopsis || base.synopsis),
              story: {
                ...(p.story || {}),
                background: base.id === 'mai-natures-new-address' ? base.story.background : (p.story?.background || base.story?.background)
              },
              fullWidthCardStill: base.id === 'moving-bangladesh' ? base.fullWidthCardStill : (p.fullWidthCardStill || base.fullWidthCardStill),
              thumbnail: base.id === 'moving-bangladesh' ? base.thumbnail : (p.thumbnail || base.thumbnail),
              poster: base.id === 'moving-bangladesh' ? base.poster : (p.poster || base.poster),
              heroStill: base.id === 'moving-bangladesh' ? base.heroStill : (p.heroStill || base.heroStill),
              heroSlideshow: base.id === 'moving-bangladesh' ? base.heroSlideshow : (p.heroSlideshow || base.heroSlideshow),
              setStills: (p.setStills && p.setStills.length > 0) ? p.setStills : base.setStills,
              crew: {
                ...(p.crew || {}),
                director: base.id === 'moving-bangladesh' ? base.crew.director : (p.crew?.director || base.crew?.director)
              }
            };
          });
        }
        if (parsed.awards && Array.isArray(parsed.awards) && parsed.awards.length > 0) {
          const parsedMap = new Map(parsed.awards.map((a) => [a.id, a]));
          const codeAwards = awardsData || [];
          const merged = codeAwards.map((codeAward) => {
            const saved = parsedMap.get(codeAward.id);
            return saved ? { ...codeAward, ...saved } : codeAward;
          });
          const codeIds = new Set(codeAwards.map(a => a.id));
          const customAwards = parsed.awards.filter(a => !codeIds.has(a.id));
          initialAwards = [...merged, ...customAwards];
        }
        if (parsed.press && Array.isArray(parsed.press) && parsed.press.length > 0) initialPress = parsed.press;
        if (parsed.clients && Array.isArray(parsed.clients) && parsed.clients.length > 0) initialClients = parsed.clients;
        if (parsed.aboutData) initialAbout = parsed.aboutData;
        if (parsed.footerData) initialFooter = parsed.footerData;
      } catch (err) {
        console.warn('Failed to parse draft CMS data:', err);
      }
    }

    if (savedPublished) {
      try {
        const parsedPub = JSON.parse(savedPublished);
        setPublishedState(parsedPub);
      } catch (e) {}
    } else {
      setPublishedState({
        projects: initialProjects,
        awards: initialAwards,
        press: initialPress,
        clients: initialClients,
        aboutData: initialAbout,
        footerData: initialFooter
      });
    }

    const projectOrderMap = projectsData.reduce((acc, p, idx) => {
      acc[p.id] = idx;
      acc[p.slug] = idx;
      return acc;
    }, {});

    initialProjects.sort((a, b) => {
      const orderA = projectOrderMap[a.id] ?? projectOrderMap[a.slug] ?? 999;
      const orderB = projectOrderMap[b.id] ?? projectOrderMap[b.slug] ?? 999;
      return orderA - orderB;
    });

    const syncedProjects = initialProjects.map((p) => {
      const base = projectsData.find((b) => b.id === p.id || b.slug === p.slug);
      let updated = base ? { ...p, category: base.category, title: base.title, client: base.client, year: base.year, crew: base.crew } : { ...p };

      if (updated.id === 'mai-natures-new-address' || updated.slug === 'mai-natures-new-address') {
        updated = {
          ...updated,
          status: "In Post-Production",
          comingSoon: true,
          description: "A brand campaign for Madinat Al Irfan - An integrated urban ecosystem.",
          synopsis: "A brand campaign for Madinat Al Irfan - An integrated urban ecosystem.",
          story: {
            ...(updated.story || {}),
            background: "A brand campaign for Madinat Al Irfan - An integrated urban ecosystem."
          }
        };
      }
      if (updated.id === 'azura-luxury-villas' || updated.slug === 'azura-the-azura-within') {
        updated = {
          ...updated,
          category: "Commercial",
          year: "",
          crew: base ? base.crew : updated.crew
        };
      }
      if (updated.id === 'last-night-in-korea' || updated.slug === 'last-night-in-korea') {
        updated = {
          ...updated,
          client: "CHANEL X BIFF Asian Film Academy"
        };
      }
      if (updated.id === 'a-thing-about-kashem' || updated.slug === 'a-thing-about-kashem') {
        updated = {
          ...updated,
          crew: {
            ...(updated.crew || {}),
            director: "Bijon",
            writer: "Bijon, Nuhash Humayun"
          }
        };
      }
      if (updated.id === 'maktoob' || updated.slug === 'maktoob') {
        updated = {
          ...updated,
          status: "On Festivals Circuit",
          thumbnail: "/projects/maktoob/poster.png",
          hoverStills: ["/projects/maktoob/poster.png"],
          heroStill: "/projects/maktoob/poster.png",
          heroSlideshow: [
            "/projects/maktoob/poster.png",
            "/projects/maktoob/for slide/set-01.jpg",
            "/projects/maktoob/for slide/set-02.jpg",
            "/projects/maktoob/for slide/set-03.jpg",
            "/projects/maktoob/for slide/set-05.jpg",
            "/projects/maktoob/for slide/set-06.jpg",
            "/projects/maktoob/for slide/set-08.jpg",
            "/projects/maktoob/for slide/set-10.jpg",
            "/projects/maktoob/for slide/set-11.jpg",
            "/projects/maktoob/for slide/set-12.jpg",
            "/projects/maktoob/for slide/still-01.png",
            "/projects/maktoob/for slide/still-03.jpg",
            "/projects/maktoob/for slide/still-04.jpg",
            "/projects/maktoob/for slide/still-05.jpg"
          ],
          screengrabs: [
            "/projects/maktoob/for slide/still-03.jpg",
            "/projects/maktoob/for slide/still-04.jpg",
            "/projects/maktoob/for slide/still-05.jpg"
          ],
          setStills: [
            "/projects/maktoob/for slide/set-01.jpg",
            "/projects/maktoob/for slide/set-02.jpg",
            "/projects/maktoob/for slide/set-03.jpg",
            "/projects/maktoob/for slide/set-05.jpg",
            "/projects/maktoob/for slide/set-06.jpg",
            "/projects/maktoob/for slide/set-08.jpg",
            "/projects/maktoob/for slide/set-10.jpg",
            "/projects/maktoob/for slide/set-11.jpg",
            "/projects/maktoob/for slide/set-12.jpg"
          ],
          crew: {
            ...(updated.crew || {}),
            director: "Sultan Al Qamshouai",
            writer: "Sultan Al Qamshouai"
          }
        };
      }
      if (updated.id === 'moving-bangladesh' || updated.slug === 'moving-bangladesh') {
        updated = {
          ...updated,
          status: "In Post-Production",
          thumbnail: "/projects/moving-bangladesh/wide-stills.png",
          fullWidthCardStill: "/projects/moving-bangladesh/wide-stills.png",
          hoverStills: ["/projects/moving-bangladesh/wide-stills.png"],
          heroStill: "/projects/moving-bangladesh/poster.png",
          heroSlideshow: ["/projects/moving-bangladesh/poster.png"],
          poster: "/projects/moving-bangladesh/poster.png"
        };
      }
      if (updated.id === 'foreigners-only' || updated.slug === 'foreigners-only') {
        updated = {
          ...updated,
          aspectRatio: "Digital 16:9"
        };
      }
      if (updated.id === 'golf-links-luxury' || updated.slug === 'golf-links-nature-of-luxury') {
        updated = {
          ...updated,
          thumbnail: base ? base.thumbnail : updated.thumbnail,
          hoverStills: base ? base.hoverStills : updated.hoverStills,
          screengrabs: base ? base.screengrabs : updated.screengrabs
        };
      }
      return updated;
    });

    setProjects(syncedProjects);
    setAwards(initialAwards);
    setPress(initialPress);
    setClients(initialClients);
    setAboutData(initialAbout);
    setFooterData(initialFooter);

    saveDraftInternal(syncedProjects, initialAwards, initialPress, initialClients, initialAbout, initialFooter);

    // Initial history snapshot
    const initSnapshot = {
      projects: JSON.parse(JSON.stringify(syncedProjects)),
      awards: JSON.parse(JSON.stringify(initialAwards)),
      press: JSON.parse(JSON.stringify(initialPress)),
      clients: JSON.parse(JSON.stringify(initialClients)),
      aboutData: JSON.parse(JSON.stringify(initialAbout)),
      footerData: JSON.parse(JSON.stringify(initialFooter))
    };
    setHistory([initSnapshot]);
    setIsLoaded(true);

    // Asynchronously fetch latest cms.json from Hostinger server if available
    fetch('/data/cms.json?v=' + Date.now())
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('No server cms.json');
      })
      .then((serverData) => {
        if (serverData && serverData.projects && Array.isArray(serverData.projects) && serverData.projects.length > 0) {
          setPublishedState(serverData);
          if (!savedDraft) {
            setProjects(serverData.projects);
            if (serverData.awards && Array.isArray(serverData.awards)) setAwards(serverData.awards);
            if (serverData.press && Array.isArray(serverData.press)) setPress(serverData.press);
            if (serverData.clients && Array.isArray(serverData.clients)) setClients(serverData.clients);
            if (serverData.aboutData) setAboutData(serverData.aboutData);
            if (serverData.footerData) setFooterData(serverData.footerData);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const handleKeyDown = (e) => {
      const target = e.target;
      const isEditingText = target && (
        target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      );

      // Do not hijack Ctrl+Z while user is actively typing in a text field or contentEditable element
      if (isEditingText) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, historyIndex, history]);

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const target = history[prevIdx];
      if (target) {
        setProjects(target.projects);
        setAwards(target.awards);
        setPress(target.press || []);
        setClients(target.clients || []);
        setAboutData(target.aboutData);
        setFooterData(target.footerData);
        setHistoryIndex(prevIdx);
        saveDraftInternal(target.projects, target.awards, target.press, target.clients, target.aboutData, target.footerData);
      }
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = history[nextIdx];
      if (target) {
        setProjects(target.projects);
        setAwards(target.awards);
        setPress(target.press || []);
        setClients(target.clients || []);
        setAboutData(target.aboutData);
        setFooterData(target.footerData);
        setHistoryIndex(nextIdx);
        saveDraftInternal(target.projects, target.awards, target.press, target.clients, target.aboutData, target.footerData);
      }
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Helper to resolve image paths
  const resolveImagePath = (slug, inputPath) => {
    if (!inputPath) return '';
    const trimmed = inputPath.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
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



  // Discard Draft & Revert to Published
  const discardDraft = () => {
    if (publishedState) {
      setProjects(publishedState.projects || projectsData);
      setAwards(publishedState.awards || awardsData);
      setPress(publishedState.press || pressData);
      setClients(publishedState.clients || clientsData);
      setAboutData(publishedState.aboutData || aboutData);
      setFooterData(publishedState.footerData || defaultFooterData);
      saveDraftInternal(
        publishedState.projects || projectsData,
        publishedState.awards || awardsData,
        publishedState.press || pressData,
        publishedState.clients || clientsData,
        publishedState.aboutData || aboutData,
        publishedState.footerData || defaultFooterData
      );
      pushToHistory(
        publishedState.projects || projectsData,
        publishedState.awards || awardsData,
        publishedState.press || pressData,
        publishedState.clients || clientsData,
        publishedState.aboutData || aboutData,
        publishedState.footerData || defaultFooterData
      );
    }
  };

  // Check if draft is modified from published
  const isDraftModified = (() => {
    if (!publishedState) return false;
    return JSON.stringify({ projects, awards, press, clients, aboutData, footerData }) !==
      JSON.stringify({
        projects: publishedState.projects,
        awards: publishedState.awards,
        press: publishedState.press,
        clients: publishedState.clients,
        aboutData: publishedState.aboutData,
        footerData: publishedState.footerData
      });
  })();

  // Reorder projects
  const reorderProjects = (newProjectsList) => {
    setProjects(newProjectsList);
    saveDraftInternal(newProjectsList, awards, press, clients, aboutData, footerData);
    pushToHistory(newProjectsList, awards, press, clients, aboutData, footerData);
  };

  // Update project fields
  const updateProject = (projectId, updatedFields) => {
    const updated = projects.map((p) => {
      if (p.id === projectId || p.slug === projectId) {
        const merged = { ...p, ...updatedFields };
        if (updatedFields.thumbnail) {
          merged.thumbnail = resolveImagePath(merged.slug, updatedFields.thumbnail);
        }
        if (updatedFields.poster) {
          merged.poster = resolveImagePath(merged.slug, updatedFields.poster);
        }
        if (merged.client && typeof merged.client === 'string') {
          merged.client = merged.client.replace(/(\s*[—\-]\s*\d{4})+$/g, '').trim();
        }
        return merged;
      }
      return p;
    });
    setProjects(updated);
    saveDraftInternal(updated, awards, press, clients, aboutData, footerData);
    pushToHistory(updated, awards, press, clients, aboutData, footerData);
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
      screengrabs: (newProjectObj.screengrabs && newProjectObj.screengrabs.length > 0)
        ? newProjectObj.screengrabs
        : [
            `/projects/${slug}/still-01.png`,
            `/projects/${slug}/still-02.png`,
            `/projects/${slug}/still-03.png`,
            `/projects/${slug}/still-04.png`,
            `/projects/${slug}/still-05.png`,
            `/projects/${slug}/still-06.png`
          ],
      setStills: newProjectObj.setStills || [],
      crew: newProjectObj.crew || { dop: "Ejaz Mehedi" },
      story: newProjectObj.story || { background: "", creativeProcess: "", challenges: "", productionStory: "" }
    };

    const updated = [fullObj, ...projects];
    setProjects(updated);
    saveDraftInternal(updated, awards, press, clients, aboutData, footerData);
    pushToHistory(updated, awards, press, clients, aboutData, footerData);
    return fullObj;
  };

  // Delete project
  const deleteProject = (projectId) => {
    const updated = projects.filter((p) => p.id !== projectId && p.slug !== projectId);
    setProjects(updated);
    saveDraftInternal(updated, awards, press, clients, aboutData, footerData);
    pushToHistory(updated, awards, press, clients, aboutData, footerData);
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
    saveDraftInternal(updated, awards, press, clients, aboutData, footerData);
    pushToHistory(updated, awards, press, clients, aboutData, footerData);
  };

  // CRUD for Awards
  const updateAward = (awardId, updatedFields) => {
    const updated = awards.map((a) => (a.id === awardId ? { ...a, ...updatedFields } : a));
    setAwards(updated);
    saveDraftInternal(projects, updated, press, clients, aboutData, footerData);
    pushToHistory(projects, updated, press, clients, aboutData, footerData);
  };

  const addAward = (newAward) => {
    const fullAward = { id: `award-${Date.now()}`, ...newAward };
    const updated = [fullAward, ...awards];
    setAwards(updated);
    saveDraftInternal(projects, updated, press, clients, aboutData, footerData);
    pushToHistory(projects, updated, press, clients, aboutData, footerData);
    return fullAward;
  };

  const deleteAward = (awardId) => {
    const updated = awards.filter((a) => a.id !== awardId);
    setAwards(updated);
    saveDraftInternal(projects, updated, press, clients, aboutData, footerData);
    pushToHistory(projects, updated, press, clients, aboutData, footerData);
  };

  // CRUD for Press
  const updatePress = (pressId, updatedFields) => {
    const updated = press.map((p) => (p.id === pressId ? { ...p, ...updatedFields } : p));
    setPress(updated);
    saveDraftInternal(projects, awards, updated, clients, aboutData, footerData);
    pushToHistory(projects, awards, updated, clients, aboutData, footerData);
  };

  const addPress = (newPress) => {
    const fullPress = { id: `press-${Date.now()}`, ...newPress };
    const updated = [fullPress, ...press];
    setPress(updated);
    saveDraftInternal(projects, awards, updated, clients, aboutData, footerData);
    pushToHistory(projects, awards, updated, clients, aboutData, footerData);
    return fullPress;
  };

  const deletePress = (pressId) => {
    const updated = press.filter((p) => p.id !== pressId);
    setPress(updated);
    saveDraftInternal(projects, awards, updated, clients, aboutData, footerData);
    pushToHistory(projects, awards, updated, clients, aboutData, footerData);
  };

  // Update Clients List
  const updateClients = (newClientsArray) => {
    setClients(newClientsArray);
    saveDraftInternal(projects, awards, press, newClientsArray, aboutData, footerData);
    pushToHistory(projects, awards, press, newClientsArray, aboutData, footerData);
  };

  // Update About Page content
  const updateAbout = (newAboutObj) => {
    const updated = { ...aboutData, ...newAboutObj };
    setAboutData(updated);
    saveDraftInternal(projects, awards, press, clients, updated, footerData);
    pushToHistory(projects, awards, press, clients, updated, footerData);
  };

  // Update Footer content
  const updateFooter = (newFooterObj) => {
    const updated = { ...footerData, ...newFooterObj };
    setFooterData(updated);
    saveDraftInternal(projects, awards, press, clients, aboutData, updated);
    pushToHistory(projects, awards, press, clients, aboutData, updated);
  };

  // Export JSON file
  const exportCMSJson = () => {
    const payload = {
      version: 3,
      lastUpdated: new Date().toISOString(),
      projects,
      awards,
      press,
      clients,
      aboutData,
      footerData,
      navConfig
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
      if (data.press && Array.isArray(data.press)) setPress(data.press);
      if (data.clients && Array.isArray(data.clients)) setClients(data.clients);
      if (data.aboutData) setAboutData(data.aboutData);
      if (data.footerData) setFooterData(data.footerData);
      if (data.navConfig) updateNavConfig(data.navConfig);
      saveDraftInternal(
        data.projects || projects,
        data.awards || awards,
        data.press || press,
        data.clients || clients,
        data.aboutData || aboutData,
        data.footerData || footerData
      );
      pushToHistory(
        data.projects || projects,
        data.awards || awards,
        data.press || press,
        data.clients || clients,
        data.aboutData || aboutData,
        data.footerData || footerData
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Invalid JSON format' };
    }
  };

  // ─── BACKUP VERSION SNAPSHOT MANAGEMENT ───
  useEffect(() => {
    const savedBackups = localStorage.getItem(STORAGE_KEY_BACKUPS);
    if (savedBackups) {
      try {
        setBackups(JSON.parse(savedBackups));
      } catch (e) {}
    }
  }, []);

  const createBackup = (note = 'Manual Snapshot') => {
    const snapshotObj = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      note,
      data: {
        projects: JSON.parse(JSON.stringify(projects)),
        awards: JSON.parse(JSON.stringify(awards)),
        press: JSON.parse(JSON.stringify(press)),
        clients: JSON.parse(JSON.stringify(clients)),
        aboutData: JSON.parse(JSON.stringify(aboutData)),
        footerData: JSON.parse(JSON.stringify(footerData))
      }
    };

    const updated = [snapshotObj, ...backups].slice(0, 20);
    setBackups(updated);
    localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(updated));
    return snapshotObj;
  };

  const restoreBackup = (backupId) => {
    const target = backups.find((b) => b.id === backupId);
    if (!target || !target.data) return { success: false, message: 'Backup snapshot not found' };

    const { projects: p, awards: a, press: pr, clients: c, aboutData: ab, footerData: f } = target.data;
    if (p) setProjects(p);
    if (a) setAwards(a);
    if (pr) setPress(pr);
    if (c) setClients(c);
    if (ab) setAboutData(ab);
    if (f) setFooterData(f);

    saveDraftInternal(p || projects, a || awards, pr || press, c || clients, ab || aboutData, f || footerData);
    pushToHistory(p || projects, a || awards, pr || press, c || clients, ab || aboutData, f || footerData);

    return { success: true, timestamp: target.timestamp, note: target.note };
  };

  const deleteBackup = (backupId) => {
    const updated = backups.filter((b) => b.id !== backupId);
    setBackups(updated);
    localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(updated));
  };

  const openDraftPreview = () => {
    const previewPayload = {
      projects: JSON.parse(JSON.stringify(projects)),
      awards: JSON.parse(JSON.stringify(awards)),
      press: JSON.parse(JSON.stringify(press)),
      clients: JSON.parse(JSON.stringify(clients)),
      aboutData: JSON.parse(JSON.stringify(aboutData)),
      footerData: JSON.parse(JSON.stringify(footerData))
    };
    localStorage.setItem('ezaz_cms_preview_draft', JSON.stringify(previewPayload));
    window.open('/?preview=draft', '_blank');
  };

  // Reset to default code data
  const resetToDefaultData = () => {
    setProjects(projectsData);
    setAwards(awardsData);
    setPress(pressData);
    setClients(clientsData);
    setAboutData({
      bioTitle: "EJAZ MEHEDI / CINEMATOGRAPHER",
      bioText1: "Ejaz Mehedi is an international cinematographer...",
      location: "DHAKA / MUSCAT"
    });
    setFooterData(defaultFooterData);
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    localStorage.removeItem(STORAGE_KEY_PUBLISHED);
  };

  return (
    <CMSContext.Provider
      value={{
        history,
        historyIndex,
        restoreHistoryIndex,
        reels,
        updateReel,
        addReel,
        deleteReel,
        reorderReels,
        projects,
        awards,
        press,
        clients,
        aboutData,
        footerData,
        backups,
        isAdminLoggedIn,
        isLoaded,
        isPreviewMode,
        openDraftPreview,
        undo,
        redo,
        canUndo,
        canRedo,
        saveDraft,
        publishLive,
        discardDraft,
        isDraftModified,
        createBackup,
        restoreBackup,
        deleteBackup,
        loginAdmin,
        logoutAdmin,
        reorderProjects,
        updateProject,
        addProject,
        deleteProject,
        reorderStills,
        updateAward,
        addAward,
        deleteAward,
        updatePress,
        addPress,
        deletePress,
        updateClients,
        updateAbout,
        updateFooter,
        resolveImagePath,
        exportCMSJson,
        importCMSJson,
        resetToDefaultData,
        navConfig,
        updateNavConfig,
        toggleNavItem
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
