import React, { useState } from 'react';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PERSONAL_EMAIL = 'contact@ejazmehedi.com';
const INSTAGRAM_URL = 'https://instagram.com/ezaz.mehedi';
const LINKEDIN_URL = 'https://linkedin.com/in/ezaz-mehedi';

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const bioImages = {
  default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  johannesburg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
  kodak: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
  cannes: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1000&auto=format&fit=crop",
  nyc: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop"
};

const bioTextData = {
  en: {
    p1: "Ejaz Mehedi is a self-taught cinematographer and commercial director whose international work—a childhood spent in Dhaka, London, and Tokyo—figures strongly in his distinctive, visceral yet meditative imagery. His textural and poetic visual language explores new ways of visual storytelling with a human story at its core.",
    p2: "His work has garnered recognition across the world, notably receiving the 2026 KODAK Award for Commercial & Music Video Director of the Year [ KODAK 35MM ], inclusions at Academy Qualifying Film Festivals for short film MOEDER, inclusions in the Saatchi & Saatchi New Directors Showcase, two Golds at the YDAs, a Gold Cannes Lion [ GOLD CANNES LION ], and a growing list of industry recognitions including British Arrows and D&AD.",
    p3: "His commercial body of work includes films for Apple, Porsche, Nike, Red Bull, Mercedes-Benz, Ford, and HP, alongside music videos for global artists [ GLOBAL CAMPAIGNS ]. Ejaz currently works worldwide while developing his debut narrative feature film."
  },
  bn: {
    p1: "এজাজ মেহেদী একজন স্বশিক্ষিত চিত্রগ্রাহক এবং বাণিজ্যিক চলচ্চিত্র পরিচালক। ঢাকা, লন্ডন ও টোকিওতে কেটেছে তাঁর শৈশব—যা প্রতিফলিত হয় তাঁর সিগনেচার, তীব্র অথচ নান্দনিক ভিজ্যুয়াল শৈলীতে। তাঁর চিত্রায়ণে স্থান পায় মানুষের জীবনের মূল গল্পের গভীর আবেদন।",
    p2: "তাঁর বিশ্বমানের কাজগুলো আন্তর্জাতিক প্ল্যাটফর্মে ব্যাপকভাবে প্রশংসিত হয়েছে। তিনি অর্জন করেছেন ২০২৬ কোডাক বর্ষসেরা কমার্শিয়াল ও মিউজিক ভিডিও ডিরেক্টর সম্মাননা [ KODAK 35MM ], একাডেমি কোয়ালিফাইং শর্ট ফিল্মের অফিশিয়াল সিলেকশন, কানস লায়ন গোল্ড [ GOLD CANNES LION ], ব্রিটিশ অ্যারোজ এবং ডিএন্ডএডি সহ বহু সম্মাননা।",
    p3: "অ্যাপল, পোর্শে, নাইকি, রেড বুল, মার্সিডিজ-বেঞ্জ এবং ফোর্ডের বিশ্বব্যাপী ক্যাম্পেইনে তাঁর পরিচালিত বিজ্ঞাপন ব্যাপকভাবে প্রশংসিত [ GLOBAL CAMPAIGNS ]। বর্তমানে তিনি বৈশ্বিক প্রজেক্টের পাশাপাশি তাঁর প্রথম ফিচার ফিল্মের কাজ করছেন।"
  },
  ar: {
    p1: "إعزاز مهدي هو مصور سينمائي ومخرج إعلانات عصامي. تشكلت طفولته بين دكا ولندن وتوكيو، مما انعكس بقوة في أسلوبه البصري التأملي والشاعري الذي يركز على القصص الإنسانية.",
    p2: "حصدت أعماله إشادة عالمية واسعة، بما في ذلك جائزة كوداك لعام 2026 كمخرج الإعلانات والفيديو كليب لهذا العام [ KODAK 35MM ]، واختيارات رسمية في مهرجانات الأوسكار للأفلام القصيرة، وجائزة كان ليونز الذهبية [ GOLD CANNES LION ]، والعديد من الجوائز الدولية.",
    p3: "تتضمن أعماله التجارية حملات عالمية لشركات آبل، وبورشه، ونايكي، وريد بول، ومرسيدس بنز [ GLOBAL CAMPAIGNS ]. يعمل إعزاز حالياً في جميع أنحاء العالم أثناء تطوير فيلمه الروائي الطويل الأول."
  }
};

const paragraphVariant = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
  }
};

export const AboutPage = () => {
  const [activeImageKey, setActiveImageKey] = useState('default');
  const [bioLang, setBioLang] = useState('en'); // 'en', 'bn', 'ar'

  const currentBio = bioTextData[bioLang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen bg-canvas text-ink pt-4 md:pt-6 pb-12 px-4 sm:px-8 max-w-[1700px] mx-auto space-y-16 md:space-y-24 font-sans select-none"
    >
      
      {/* TOP SECTION: BIOGRAPHY + DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start border-b border-line pb-16 md:pb-20">
        
        {/* Left Side: Photo Frame Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-mono-custom tracking-[0.25em] uppercase text-muted font-bold">
            <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
            <span>BIOGRAPHY // DIRECTOR & DOP</span>
          </div>

          <div className="w-full aspect-square overflow-hidden bg-surface border border-line relative">
            <img
              src={bioImages[activeImageKey] || bioImages.default}
              alt="Ejaz Mehedi Portrait"
              className="w-full h-full object-cover transition-all duration-700 filter brightness-95 contrast-105"
            />
          </div>
        </motion.div>

        {/* Right Side: Biography Paragraphs with Tiny Language Switch & Direct Contact */}
        <div className="lg:col-span-7 space-y-8 pt-2">
          
          {/* Biography Header with Tiny Language Selector */}
          <div className="flex items-center justify-between border-b border-line/40 pb-3">
            <span className="text-xs font-mono-custom tracking-[0.25em] uppercase text-muted font-bold">
              BIOGRAPHY ARCHIVE
            </span>

            {/* Character Script Language Selector [ A | অ | ع ] */}
            <div className="flex items-center gap-1.5 text-xs font-mono-custom uppercase tracking-wider">
              <button
                onClick={() => setBioLang('en')}
                title="English"
                className={`px-2 py-1 transition-all rounded-sm font-bold text-xs ${
                  bioLang === 'en' ? 'bg-ink text-canvas font-black scale-105' : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                A
              </button>
              <span className="text-muted/40 text-[10px]">/</span>
              <button
                onClick={() => setBioLang('bn')}
                title="বাংলা"
                className={`px-2 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'bn' ? 'bg-ink text-canvas font-black scale-105' : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                অ
              </button>
              <span className="text-muted/40 text-[10px]">/</span>
              <button
                onClick={() => setBioLang('ar')}
                title="العربية"
                className={`px-2 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'ar' ? 'bg-ink text-canvas font-black scale-105' : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                ع
              </button>
            </div>
          </div>

          {/* Animated Biography Paragraphs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bioLang}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -10 }}
              transition={{ staggerChildren: 0.12 }}
              className={`space-y-5 text-sm sm:text-base leading-relaxed text-ink-soft font-light ${
                bioLang === 'ar' ? 'text-right dir-rtl font-sans' : ''
              }`}
            >
              <motion.p variants={paragraphVariant}>
                {currentBio.p1}
              </motion.p>

              <motion.p variants={paragraphVariant}>
                {currentBio.p2.split('[ KODAK 35MM ]')[0]}
                <span
                  onMouseEnter={() => setActiveImageKey('kodak')}
                  onMouseLeave={() => setActiveImageKey('default')}
                  onTouchStart={() => setActiveImageKey('kodak')}
                  className="px-2 py-0.5 mx-1 bg-ink text-canvas font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-ink-soft transition-colors inline-block"
                >
                  [ KODAK 35MM ]
                </span>
                {currentBio.p2.split('[ KODAK 35MM ]')[1]?.split('[ GOLD CANNES LION ]')[0]}
                <span
                  onMouseEnter={() => setActiveImageKey('cannes')}
                  onMouseLeave={() => setActiveImageKey('default')}
                  onTouchStart={() => setActiveImageKey('cannes')}
                  className="px-2 py-0.5 mx-1 bg-ink text-canvas font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-ink-soft transition-colors inline-block"
                >
                  [ GOLD CANNES LION ]
                </span>
                {currentBio.p2.split('[ GOLD CANNES LION ]')[1]}
              </motion.p>

              <motion.p variants={paragraphVariant}>
                {currentBio.p3.split('[ GLOBAL CAMPAIGNS ]')[0]}
                <span
                  onMouseEnter={() => setActiveImageKey('nyc')}
                  onMouseLeave={() => setActiveImageKey('default')}
                  onTouchStart={() => setActiveImageKey('nyc')}
                  className="px-2 py-0.5 mx-1 bg-ink text-canvas font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-ink-soft transition-colors inline-block"
                >
                  [ GLOBAL CAMPAIGNS ]
                </span>
                {currentBio.p3.split('[ GLOBAL CAMPAIGNS ]')[1]}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* DIRECT CONTACT AREA */}
          <div className="pt-6 border-t border-line/60 space-y-6">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-muted font-semibold">
              DIRECT CONTACT
            </span>

            {/* Personal Email — Electric Green Accent */}
            <div className="bg-surface border border-line p-4 sm:p-5">
              <span className="text-[9px] font-sans text-muted uppercase tracking-[0.25em] block">
                PERSONAL EMAIL
              </span>
              <a
                href={`mailto:${PERSONAL_EMAIL}`}
                className="text-lg sm:text-xl font-sans text-accent font-bold tracking-tight hover:brightness-110 transition-all"
              >
                {PERSONAL_EMAIL}
              </a>
            </div>

            {/* Social Media — Logo Tiles */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group flex items-center text-accent transition-colors"
              >
                <span className="w-9 h-9 border border-accent/40 flex items-center justify-center group-hover:bg-accent-soft group-hover:border-accent transition-all">
                  <InstagramIcon className="w-4 h-4" />
                </span>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="group flex items-center text-accent transition-colors"
              >
                <span className="w-9 h-9 border border-accent/40 flex items-center justify-center group-hover:bg-accent-soft group-hover:border-accent transition-all">
                  <LinkedinIcon className="w-4 h-4" />
                </span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* SECTION: PRESS & INTERVIEWS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-line pb-16 md:pb-20"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-muted">
          PRESS & INTERVIEWS
        </h2>

        <div className="space-y-6">
          {pressData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-line/60 pb-6 group"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono-custom text-muted uppercase tracking-widest block">
                  {item.publisher} — {item.date}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-serif text-ink font-light group-hover:text-ink-soft transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted font-light max-w-2xl">
                  {item.description}
                </p>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono-custom text-muted hover:text-ink uppercase tracking-widest shrink-0 flex items-center gap-1"
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
        className="space-y-6 md:space-y-8 border-b border-line pb-16 md:pb-20"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-muted">
          AWARDS & HONORS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {awardsData.map((award) => (
            <div key={award.id} className="space-y-2">
              <span className="text-xs font-mono-custom text-muted uppercase tracking-widest block">
                {award.date} — {award.organization}
              </span>
              <h3 className="text-sm sm:text-base font-serif text-ink font-light">
                {award.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed">
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
        className="space-y-6 md:space-y-8 pb-12"
      >
        <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-muted">
          SELECTED CLIENTS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-xs font-mono-custom text-ink-soft">
          {clientsData.map((client, idx) => (
            <div key={idx} className="border-l border-line-heavy pl-3 py-1">
              {client}
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};
