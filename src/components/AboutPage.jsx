import React, { useState } from 'react';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ExternalLink, Mail, Globe, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const bioImages = {
  default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  johannesburg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
  kodak: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
  cannes: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1000&auto=format&fit=crop",
  nyc: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop"
};

const paragraphVariant = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
  }
};

export const AboutPage = () => {
  const [activeImageKey, setActiveImageKey] = useState('default');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen bg-black text-white pt-4 md:pt-6 pb-24 px-4 sm:px-8 max-w-[1700px] mx-auto space-y-16 md:space-y-24 font-sans select-none"
    >
      
      {/* TOP SECTION: BIOGRAPHY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start border-b border-neutral-900 pb-16 md:pb-20">
        
        {/* Photo Frame Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-5 space-y-3"
        >
          {/* Unclipped Horizontal Monospace Header */}
          <div className="flex items-center gap-2 text-xs font-mono-custom tracking-[0.25em] uppercase text-neutral-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>BIOGRAPHY // DIRECTOR & DOP</span>
          </div>

          <div className="w-full aspect-square overflow-hidden bg-neutral-950 border border-neutral-900 relative">
            <img
              src={bioImages[activeImageKey] || bioImages.default}
              alt="Ezaz Mahedi Portrait"
              className="w-full h-full object-cover transition-all duration-700 filter brightness-95 contrast-105"
            />
          </div>
        </motion.div>

        {/* Biography Paragraphs Animated In (Like Title) */}
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.18 }}
          className="lg:col-span-7 space-y-6 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300 font-light pt-6 lg:pt-8"
        >
          
          <motion.p variants={paragraphVariant}>
            Ezaz Mahedi is a self-taught cinematographer and commercial director whose international work—a childhood spent in Dhaka, London, and Tokyo—figures strongly in his distinctive, visceral yet meditative imagery. His textural and poetic visual language explores new ways of visual storytelling with a human story at its core.
          </motion.p>

          <motion.p variants={paragraphVariant}>
            His work has garnered recognition across the world, notably receiving the 2026 KODAK Award for Commercial & Music Video Director of the Year{' '}
            <span
              onMouseEnter={() => setActiveImageKey('kodak')}
              onMouseLeave={() => setActiveImageKey('default')}
              onTouchStart={() => setActiveImageKey('kodak')}
              className="px-2 py-0.5 mx-1 bg-white text-black font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-neutral-300 transition-colors inline-block"
            >
              [ KODAK 35MM ]
            </span>
            , inclusions at Academy Qualifying Film Festivals for short film MOEDER, inclusions in the Saatchi & Saatchi New Directors Showcase, two Golds at the YDAs, a Gold Cannes Lion{' '}
            <span
              onMouseEnter={() => setActiveImageKey('cannes')}
              onMouseLeave={() => setActiveImageKey('default')}
              onTouchStart={() => setActiveImageKey('cannes')}
              className="px-2 py-0.5 mx-1 bg-white text-black font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-neutral-300 transition-colors inline-block"
            >
              [ GOLD CANNES LION ]
            </span>
            , and a growing list of industry recognitions including British Arrows and D&AD.
          </motion.p>

          <motion.p variants={paragraphVariant}>
            His commercial body of work includes films for Apple, Porsche, Nike, Red Bull, Mercedes-Benz, Ford, and HP, alongside music videos for global artists{' '}
            <span
              onMouseEnter={() => setActiveImageKey('nyc')}
              onMouseLeave={() => setActiveImageKey('default')}
              onTouchStart={() => setActiveImageKey('nyc')}
              className="px-2 py-0.5 mx-1 bg-white text-black font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-neutral-300 transition-colors inline-block"
            >
              [ GLOBAL CAMPAIGNS ]
            </span>
            . Ezaz currently works worldwide while developing his debut narrative feature film.
          </motion.p>

        </motion.div>

      </div>

      {/* SECTION: PRESS & INTERVIEWS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-neutral-900 pb-16 md:pb-20"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-neutral-400">
          PRESS & INTERVIEWS
        </h2>

        <div className="space-y-6">
          {pressData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-900/60 pb-6 group"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono-custom text-neutral-500 uppercase tracking-widest block">
                  {item.publisher} — {item.date}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-serif text-white font-light group-hover:text-neutral-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light max-w-2xl">
                  {item.description}
                </p>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono-custom text-neutral-400 hover:text-white uppercase tracking-widest shrink-0 flex items-center gap-1"
                >
                  <span>READ ARTICLE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION: AWARDS & RECOGNITION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-neutral-900 pb-16 md:pb-20"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-neutral-400">
          AWARDS & HONORS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {awardsData.map((award) => (
            <div key={award.id} className="space-y-2">
              <span className="text-xs font-mono-custom text-neutral-500 uppercase tracking-widest block">
                {award.date} — {award.organization}
              </span>
              <h3 className="text-sm sm:text-base font-serif text-white font-light">
                {award.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION: SELECTED CLIENTS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-neutral-900 pb-16 md:pb-20"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-neutral-400">
          SELECTED CLIENTS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-xs font-mono-custom text-neutral-300">
          {clientsData.map((client, idx) => (
            <div key={idx} className="border-l border-neutral-800 pl-3 py-1">
              {client}
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION: CONTACT INFORMATION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 pt-4"
      >
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-neutral-400">
            CONTACT INFORMATION
          </h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            For commercial directing, narrative features, or worldwide cinematography inquiries:
          </p>

          <div className="space-y-3 text-xs font-mono-custom">
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="truncate">contact@ezazmahedi.com</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <Globe className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>Global Representation: Iconoclast / Blur Films</span>
            </div>
          </div>
        </div>

        {/* Minimal Contact Form */}
        <div className="lg:col-span-7 bg-neutral-950 p-6 sm:p-8 border border-neutral-900">
          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-white" />
              <h3 className="text-xs font-mono-custom text-white uppercase">INQUIRY SENT</h3>
              <p className="text-xs font-mono-custom text-neutral-400">
                Thank you. Representation will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase mb-1">NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-white text-xs font-mono-custom focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase mb-1">EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-black border border-neutral-800 text-white text-xs font-mono-custom focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase mb-1">MESSAGE</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Production details & timeline..."
                  className="w-full px-4 py-3 bg-black border border-neutral-800 text-white text-xs font-mono-custom focus:outline-none focus:border-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-mono-custom font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>SEND INQUIRY</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};
