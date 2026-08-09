import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

const collections = [
  {
    id: 'hyperborea',
    title: 'HYPERBOREA',
    series: [
      { id: 'h1', title: 'Weather Man', location: 'Kanin Nos Peninsula', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[4/3]' },
      { id: 'h2', title: 'Kanin Lighthouse', location: 'White Sea Coast', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/10]' },
      { id: 'h3', title: 'Dikson Island Outpost', location: 'Taymyr Peninsula', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[3/4]' },
      { id: 'h4', title: 'Chukotka Tundra', location: 'Bering Strait', url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/9]' },
      { id: 'h5', title: 'Arctic Radiance', location: 'Svalbard Archipelago', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[4/3]' }
    ]
  },
  {
    id: 'tiksi',
    title: 'TIKSI & ARCTIC PORTRAITS',
    series: [
      { id: 't1', title: 'Northern Solitude', location: 'Lapland Tundra', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[3/4]' },
      { id: 't2', title: 'Glacial Dawn', location: 'Reykjavik Coast', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/9]' },
      { id: 't3', title: 'Icebreaker Horizon', location: 'Barents Sea', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[4/3]' },
      { id: 't4', title: 'Aurora Borealis Silentium', location: 'Abisko National Park', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/10]' }
    ]
  },
  {
    id: 'bengal',
    title: 'BENGAL MONSOON TIDES',
    series: [
      { id: 'b1', title: 'Sundarbans Mist', location: 'Kutubdia Island', url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/9]' },
      { id: 'b2', title: 'Fisherman at Twilight', location: 'Cox’s Bazar Coast', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[3/4]' },
      { id: 'b3', title: 'Chittagong Shipyard', location: 'Karnafully Estuary', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[4/3]' },
      { id: 'b4', title: 'River Basin Rain', location: 'Padma Delta', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/10]' }
    ]
  },
  {
    id: 'tokyo',
    title: 'URBAN ECHOES & NIGHTS',
    series: [
      { id: 'u1', title: 'Shinjuku Neon Rain', location: 'Tokyo, Japan', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[3/4]' },
      { id: 'u2', title: 'Monochrome Velocity', location: 'London Studio', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/9]' },
      { id: 'u3', title: 'Subway Solitude', location: 'Berlin Hauptbahnhof', url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[4/3]' },
      { id: 'u4', title: 'Paris Haute Couture Archive', location: 'Rue Saint-Honoré', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop', aspect: 'aspect-[16/10]' }
    ]
  }
];

export const StillsGallery = () => {
  const [activeCollectionId, setActiveCollectionId] = useState('hyperborea');
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const targetScrollLeft = useRef(0);
  const animFrameRef = useRef(null);

  const activeCollection = collections.find(c => c.id === activeCollectionId) || collections[0];

  // Lerp Animation Loop for Smooth Mouse Motion Panning
  useEffect(() => {
    const updateScroll = () => {
      if (scrollRef.current && !isDraggingRef.current) {
        const current = scrollRef.current.scrollLeft;
        const diff = targetScrollLeft.current - current;
        if (Math.abs(diff) > 0.5) {
          scrollRef.current.scrollLeft += diff * 0.08;
        }
      }
      animFrameRef.current = requestAnimationFrame(updateScroll);
    };
    animFrameRef.current = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Mouse Movement Carousel Panning
  const handleMouseMove = (e) => {
    if (!scrollRef.current || isDraggingRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    if (maxScroll > 0) {
      targetScrollLeft.current = Math.max(0, Math.min(maxScroll, xRatio * maxScroll));
    }
  };

  // Mouse Drag / Touch Mechanics
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleDragMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    targetScrollLeft.current = scrollRef.current.scrollLeft;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-between select-none py-2 md:py-4"
    >
      {/* EVGENIA ARBUGAEVA CLEAN CAROUSEL LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 w-full">

        {/* LEFT SIDEBAR: CLEAN COLLECTION LIST (NO NUMBERS) */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-line/60 pb-6 lg:pb-0 lg:pr-8">
          <div className="space-y-6">
            <div className="text-xs font-mono-custom tracking-[0.25em] uppercase font-bold text-muted border-b border-line/40 pb-2">
              PHOTOGRAPHY
            </div>

            <nav className="space-y-4">
              {collections.map((col) => {
                const isActive = col.id === activeCollectionId;
                return (
                  <div key={col.id} className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveCollectionId(col.id);
                        setActiveSubItem(null);
                        if (scrollRef.current) {
                          scrollRef.current.scrollLeft = 0;
                          targetScrollLeft.current = 0;
                        }
                      }}
                      className={`text-left text-xs font-mono-custom tracking-[0.18em] uppercase transition-colors block w-full font-bold cursor-pointer ${
                        isActive ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {col.title}
                    </button>

                    {/* Sub-series list (No numbers) */}
                    {isActive && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 space-y-1.5 border-l border-line/40 my-2"
                      >
                        {col.series.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setActiveSubItem(item.id);
                                const el = document.getElementById(`still-${item.id}`);
                                if (el && scrollRef.current) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                                }
                              }}
                              className={`text-[11px] font-mono-custom tracking-wider block text-left transition-colors cursor-pointer ${
                                activeSubItem === item.id ? 'text-ink font-bold underline' : 'text-muted/80 hover:text-ink'
                              }`}
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block pt-8 text-[10px] font-mono-custom text-muted uppercase tracking-widest leading-relaxed border-t border-line/40">
            <div>35mm & Medium Format</div>
            <div>Archival Prints</div>
          </div>
        </aside>

        {/* RIGHT CAROUSEL AREA: MOUSE-MOVING & HAND-DRAGGING CAROUSEL */}
        <main className="flex-1 flex flex-col relative min-w-0">
          
          <div
            ref={scrollRef}
            onMouseMove={(e) => {
              handleMouseMove(e);
              handleDragMove(e);
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="flex-1 flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-none py-2 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeCollection.series.map((item, idx) => (
              <motion.div
                key={item.id}
                id={`still-${item.id}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setLightboxIndex(idx)}
                className="shrink-0 group relative flex flex-col space-y-3"
              >
                {/* PHOTOGRAPHY FRAME */}
                <div className={`relative h-[60vh] md:h-[68vh] max-h-[760px] ${item.aspect} bg-surface overflow-hidden border border-line/40 transition-colors group-hover:border-ink-soft`}>
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover filter brightness-95 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  />

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-black/80 backdrop-blur-md text-white border border-white/20 rounded-full">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* STILL CAPTION (CLEAN TITLE, NO NUMBERING) */}
                <div className="flex items-center justify-between text-xs font-mono-custom tracking-widest uppercase">
                  <span className="text-ink font-bold group-hover:text-ink-soft transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-muted">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </main>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col justify-between p-4 sm:p-8"
          >
            <div className="w-full flex items-center justify-between text-xs font-mono-custom tracking-widest uppercase text-muted z-10">
              <span className="text-ink font-bold">
                {activeCollection.series[lightboxIndex].title}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4">
              <img
                src={activeCollection.series[lightboxIndex].url}
                alt={activeCollection.series[lightboxIndex].title}
                className="max-w-full max-h-[82vh] object-contain border border-line shadow-2xl"
              />
            </div>

            <div className="text-center text-xs font-mono-custom text-muted uppercase tracking-widest">
              LOCATION: {activeCollection.series[lightboxIndex].location}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
