import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ejazPortrait from '../assets/ejaz-portrait.png';
import omanMap from '../assets/oman-outline.png';
import bangladeshMap from '../assets/bangladesh-outline.png';

const PERSONAL_EMAIL = 'contact@ejazmehedi.com';
const INSTAGRAM_URL = 'https://instagram.com/ejazmehedi';

const keywordImages = {
  oman: omanMap,
  bangladesh: bangladeshMap,
};

// Real photos shown in the portrait frame on hover
const portraitHoverPhotos = {
  bangladesh: [
    '/bio/bangladesh/1.jpg',
    '/bio/bangladesh/2.jpg',
    '/bio/bangladesh/3.jpg',
    '/bio/bangladesh/4.jpg',
    '/bio/bangladesh/5.jpg'
  ],
  oman: [
    '/bio/oman/1.png',
    '/bio/oman/2.jpg',
    '/bio/oman/3.jpg'
  ],
  robreiner: ['/bio/rob-reiner.jpg'],
  standbyme: ['/bio/stand-by-me.png'],
  morshedulislam: ['/bio/morshedul-islam.jpg'],
  dipunumbertwo: ['/bio/dipu-number-two.png']
};

const bioTextData = {
  en: {
    p1: "Ejaz Mehedi is a Bangladeshi cinematographer and filmmaker whose visual perspective has been shaped by both an intimacy with home and long periods spent away from it.",
    p2: "He grew up in Dhaka, Bangladesh where some of his earliest memories of cinema came through films such as Rob Reiner’s Stand By Me and Morshedul Islam’s Dipu Number Two. Different in language and geography but similar in their emotional attention to landscapes, friendship, memory, growing up and trauma, both films stayed with him long before he understood filmmaking as a profession.",
    p3: "His formative years later took him from Dhaka to Nottingham in the United Kingdom and Cyberjaya in Malaysia, followed by years of living and working across different countries. Distance gradually changed the way he looked at Bangladesh. Returning home after long stretches abroad gave him the perspective of both an insider and an outsider: deeply familiar with the rhythms and contradictions of South Asian life, yet able to observe them with a certain separation. That duality has become central to his work, combining culturally specific stories with a broader international visual language.",
    p4: "His work has since screened at more than 55 film festivals across 15 countries and received 19 awards. He photographed Nuhash Humayun’s MOSHARI, executive produced by Jordan Peele’s Monkeypaw Productions and Riz Ahmed’s Left Handed Films. The film became the first Bangladeshi short to qualify for the Academy Awards and received major recognition at SXSW, the Melbourne International Film Festival and Fantasia. He also served as Director of Photography on FOREIGNERS ONLY, produced for 20th Digital Studio and released on Hulu, as well as A Thing About Kashem and the feature film Moving Bangladesh.",
    p5: "He is currently based between Muscat, Dhaka and, more recently, New York City.",
    p6: "In Oman, besides working as a freelance cinematographer and director he also runs DUSK, a hybrid creative agency and production company producing premium brand films, commercials and branded content for clients across Oman and the wider region."
  },
  bn: {
    p1: "এজাজ মেহেদী একজন বাংলাদেশি চিত্রগ্রাহক (Cinematographer) ও চলচ্চিত্র নির্মাতা, যার ভিজ্যুয়াল দৃষ্টিভঙ্গি গড়ে উঠেছে নিজের দেশকে খুব কাছ থেকে দেখা এবং দীর্ঘ সময় দেশ থেকে দূরে থাকার অভিজ্ঞতার মধ্য দিয়ে।",
    p2: "তিনি ঢাকায় বেড়ে উঠেছেন, যেখানে তাঁর শৈশবের চলচ্চিত্রের স্মৃতি ছিল রব রাইনারের Stand By Me এবং মোরশেদুল ইসলামের দীপু নাম্বার টু চলচ্চিত্রের মাধ্যমে। ভাষা ও ভৌগোলিক প্রেক্ষাপট ভিন্ন হলেও বন্ধুত্ব, স্মৃতি, বেড়ে ওঠা এবং পরিবেশের প্রতি আবেগময় দৃষ্টির দিক থেকে দুটি কাজই তাঁকে গভীরভাবে প্রভাবিত করে।",
    p3: "পরবর্তীতে তাঁর শিক্ষাজীবন ও কর্মজীবন তাঁকে ঢাকা থেকে যুক্তরাজ্য এবং মালয়েশিয়া হয়ে বিশ্বের বিভিন্ন দেশে নিয়ে যায়। দেশ থেকে দূরে থাকার ফলে বাংলাদেশের প্রতি তাঁর দৃষ্টিভঙ্গিতে একটি দ্বৈত দৃষ্টিভঙ্গি তৈরি হয়—একজন স্থানীয় এবং একজন পর্যবেক্ষণশীল বহিরাগত হিসেবে।",
    p4: "এ পর্যন্ত তাঁর কাজ ১৫টি দেশের ৫৫টিরও বেশি চলচ্চিত্র উৎসবে প্রদর্শিত হয়েছে এবং ১৯টি পুরস্কার অর্জন করেছে। তিনি নুহাশ হুমায়ূনের MOSHARI এবং 20th Digital Studio এর FOREIGNERS ONLY, পাশাপাশি A Thing About Kashem এবং Moving Bangladesh চলচ্চিত্র সমূহের চিত্রগ্রাহক ছিলেন।",
    p5: "বর্তমানে তিনি মাস্কাট, ঢাকা এবং নিউ ইয়র্ক সিটির মধ্যে কাজ করছেন।",
    p6: "ওমানে তিনি DUSK নামের একটি হাইব্রিড ক্রিয়েটিভ এজেন্সি ও প্রোডাকশন কোম্পানি পরিচালনা করেন।"
  },
  ar: {
    p1: "إيجاز مهدي هو مدير تصوير سينمائي وصانع أفلام بنغلاديشي، تشكّلت رؤيته البصرية من خلال ارتباطه العميق بوطنه ومن خلال فترات طويلة قضاها بعيداً عنه.",
    p2: "نشأ في مدينة دكا في بنغلاديش، حيث بدأت علاقته المبكرة بالسينما من خلال أفلام مثل Stand By Me للمخرج روب راينر وDipu Number Two للمخرج مرشد الإسلام.",
    p3: "عُرضت أعماله في أكثر من 55 مهرجاناً سينمائياً في 15 دولة، وحصدت 19 جائزة. وكان مدير التصوير لفيلم MOSHARI وفيلم FOREIGNERS ONLY لشركة 20th Digital Studio وخول منصة Hulu، فضلاً عن فيلم A Thing About Kashem والفيلم الروائي Moving Bangladesh.",
    p4: "يقيم إيجاز مهدي حالياً بين مسقط ودكا ومدينة نيويورك. كما يدير في سلطنة عُمان شركة DUSK لتصوير وتصميم المحتوى البصري والإعلانات."
  }
};

const paragraphVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } 
  }
};

export const AboutPage = ({ cmsInfo, cmsClients, isEditMode }) => {
  const { aboutData, updateAbout } = useCMS();
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [awardFilter, setAwardFilter] = useState('all');

  const personalEmail = cmsInfo?.personalEmail || PERSONAL_EMAIL;
  const instagramUrl = cmsInfo?.instagramUrl || INSTAGRAM_URL;
  const activeClients = cmsClients || clientsData;

  const [bioLang, setBioLang] = useState('en');

  // Photo Slideshow Loop timer when hovering over Bangladesh or Oman
  useEffect(() => {
    setSlideIndex(0);
    if (!hoveredKeyword || !portraitHoverPhotos[hoveredKeyword] || portraitHoverPhotos[hoveredKeyword].length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % portraitHoverPhotos[hoveredKeyword].length);
    }, 2400);
    return () => clearInterval(interval);
  }, [hoveredKeyword]);

  const currentBio = bioTextData[bioLang];

  const interactiveConfigs = [
    {
      key: 'standbyme',
      matches: ['Stand By Me', 'Stand By ME'],
      customClass: 'font-bold italic border-b border-dashed border-ink/40 hover:border-ink'
    },
    {
      key: 'dipunumbertwo',
      matches: ['Dipu Number Two', 'Dipu Number two', 'দীপু নাম্বার টু'],
      customClass: 'font-bold italic border-b border-dashed border-ink/40 hover:border-ink'
    },
    {
      key: 'robreiner',
      matches: ["Rob Reiner's", "Rob Reiner’s", "Rob Reiner", "রব রাইনারের", "روب راينر"],
      customClass: 'font-semibold border-b border-dashed border-ink/40 hover:border-ink'
    },
    {
      key: 'morshedulislam',
      matches: ["Morshedul Islam's", "Morshedul Islam’s", "Morshedul Islam", "মোরশেদুল ইসলামের", "مرشد الإسلام"],
      customClass: 'font-semibold border-b border-dashed border-ink/40 hover:border-ink'
    },
    {
      key: 'bangladesh',
      matches: ['Dhaka, Bangladesh', 'Dhaka,Bangladesh', 'Bangladesh', 'বাংলাদেশ', 'بنغلاديش'],
      isMap: true,
      mapImg: bangladeshMap,
      customClass: 'font-medium'
    },
    {
      key: 'oman',
      matches: ['Muscat, Oman', 'Muscat,Oman', 'Oman', 'ওমান', 'عُمان'],
      isMap: true,
      mapImg: omanMap,
      customClass: 'font-medium'
    }
  ];

  const renderInteractiveText = (text) => {
    if (!text) return null;
    let parts = [text];

    interactiveConfigs.forEach((cfg) => {
      cfg.matches.forEach((matchStr) => {
        const nextParts = [];
        parts.forEach((part) => {
          if (typeof part === 'string') {
            const lower = part.toLowerCase();
            const matchLower = matchStr.toLowerCase();
            let idx = lower.indexOf(matchLower);
            let cursor = 0;
            let count = 0;
            while (idx !== -1) {
              const end = idx + matchLower.length;
              const charAfter = lower[end];
              const charBefore = idx > 0 ? lower[idx - 1] : '';

              // Avoid matching part of longer words (e.g. "Bangladeshi" when searching for "Bangladesh")
              if ((charAfter && /[a-z]/i.test(charAfter)) || (charBefore && /[a-z]/i.test(charBefore))) {
                idx = lower.indexOf(matchLower, end);
                continue;
              }

              nextParts.push(part.slice(cursor, idx));
              const currentMatchText = part.slice(idx, end);
              nextParts.push(
                <span
                  key={`${cfg.key}-${count++}-${idx}`}
                  onMouseEnter={() => setHoveredKeyword(cfg.key)}
                  onMouseLeave={() => setHoveredKeyword(null)}
                  onTouchStart={() => setHoveredKeyword(cfg.key)}
                  onTouchEnd={() => setHoveredKeyword(null)}
                  className={`cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center gap-0.5 align-baseline ${cfg.customClass}`}
                >
                  {currentMatchText}
                  {cfg.isMap && (
                    <img
                      src={cfg.mapImg}
                      alt=""
                      className="inline-block h-5 sm:h-6 w-auto opacity-90 pointer-events-none -mb-0.5 ml-0.5"
                      draggable={false}
                    />
                  )}
                </span>
              );
              cursor = end;
              idx = lower.indexOf(matchLower, cursor);
            }
            nextParts.push(part.slice(cursor));
          } else {
            nextParts.push(part);
          }
        });
        parts = nextParts;
      });
    });

    return parts;
  };

  const filteredAwards = awardsData.filter((item) => {
    if (awardFilter === 'moshari') return item.film === 'MOSHARI';
    if (awardFilter === 'foreigners') return item.film === 'FOREIGNERS ONLY';
    return true;
  });

  const activeHoverImages = hoveredKeyword && portraitHoverPhotos[hoveredKeyword] ? portraitHoverPhotos[hoveredKeyword] : null;
  const currentHoverPhoto = activeHoverImages ? activeHoverImages[slideIndex % activeHoverImages.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen text-[var(--about-ink)] font-medium pt-2 pb-24 px-4 sm:px-8 md:px-12 font-sans select-none max-w-[1700px] mx-auto space-y-12 md:space-y-16"
    >
      
      {/* TOP SECTION: BIOGRAPHY + PORTRAIT & DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch pb-12 md:pb-16">
        
        {/* Left Side: Photo Frame Container — swaps to demo photo on keyword hover */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="w-full flex-1 min-h-[480px] lg:min-h-0 overflow-hidden bg-[var(--about-ink-10)] border border-[var(--about-border)] relative group shadow-xl">
            <AnimatePresence mode="wait">
              {currentHoverPhoto ? (
                <motion.div
                  key={`${hoveredKeyword}-${currentHoverPhoto}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentHoverPhoto}
                    alt={hoveredKeyword}
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.img
                  key="default-portrait"
                  src={ejazPortrait}
                  alt="Ejaz Mehedi"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Biography & Character Script Language Switcher */}
        <div className="lg:col-span-7 space-y-6 pt-1">
          
          {/* Biography Header with Character Script Language Selector [ A | অ | ع ] */}
          <div className="flex items-center justify-end pb-3">
            {/* Character Script Selector [ A / অ / ع ] */}
            <div className="flex items-center gap-1.5 text-xs font-mono-custom uppercase tracking-wider">
              <button
                onClick={() => setBioLang('en')}
                title="English"
                className={`px-2.5 py-1 transition-all rounded-sm text-xs ${
                  bioLang === 'en' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
                }`}
              >
                A
              </button>
              <span className="text-[var(--about-ink)] text-[10px]">/</span>
              <button
                onClick={() => setBioLang('bn')}
                title="বাংলা"
                className={`px-2.5 py-1 transition-all rounded-sm text-xs font-sans ${
                  bioLang === 'bn' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
                }`}
              >
                অ
              </button>
              <span className="text-[var(--about-ink)] text-[10px]">/</span>
              <button
                onClick={() => setBioLang('ar')}
                title="العربية"
                className={`px-2.5 py-1 transition-all rounded-sm text-xs font-sans ${
                  bioLang === 'ar' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
                }`}
              >
                ع
              </button>
            </div>
          </div>

          {/* Biography Text Paragraphs — Directly Editable on Original Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bioLang}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -6 }}
              transition={{ staggerChildren: 0.08 }}
              className={`space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--about-ink)] font-medium ${
                bioLang === 'ar' ? 'text-right dir-rtl font-sans' : ''
              }`}
            >
              {Object.keys(currentBio).map((key) => (
                <motion.p
                  key={key}
                  variants={paragraphVariant}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    if (!isEditMode) return;
                    const newText = e.target.innerText;
                    const updatedLangBio = {
                      ...(aboutData?.bio?.[bioLang] || currentBio),
                      [key]: newText
                    };
                    updateAbout({
                      bio: {
                        ...(aboutData?.bio || bioTextData),
                        [bioLang]: updatedLangBio
                      }
                    });
                  }}
                  className={`${
                    isEditMode
                      ? 'outline-dashed outline-1 outline-accent/60 hover:outline-accent bg-accent/5 p-2 rounded cursor-text transition-all'
                      : ''
                  }`}
                >
                  {isEditMode ? currentBio[key] : renderInteractiveText(currentBio[key])}
                </motion.p>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Contact Info at bottom of biography */}
          <div className="pt-8 space-y-5 text-sm font-mono-custom">
            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">INSTAGRAM</div>
              <a
                href="https://instagram.com/ejazmehedi"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--about-ink)] hover:opacity-70 transition-opacity block"
              >
                @ejazmehedi
              </a>
            </div>
            
            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">PERSONAL</div>
              <a
                href="mailto:ejazmeh.work@gmail.com"
                className="text-[var(--about-ink)] hover:opacity-70 transition-opacity block"
              >
                ejazmeh.work@gmail.com
              </a>
            </div>

            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">Vimeo</div>
              <a
                href="https://vimeo.com/ejazmehedi"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--about-ink)] hover:opacity-70 transition-opacity block"
              >
                https://vimeo.com/ejazmehedi
              </a>
            </div>

            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">IMDb:</div>
              <a
                href="https://www.imdb.com/name/nm13341457/"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--about-ink)] hover:opacity-70 transition-opacity block"
              >
                https://www.imdb.com/name/nm13341457/
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* FULL TABULAR AWARDS & HONORS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink)]">
            AWARDS & FESTIVAL EXHIBITIONS ({filteredAwards.length})
          </h2>

          {/* Minimal Filter */}
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-widest">
            <button
              onClick={() => setAwardFilter('all')}
              className={`px-2.5 py-0.5 rounded-sm ${
                awardFilter === 'all' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
              }`}
            >
              ALL
            </button>
            <span className="text-[var(--about-ink)]">/</span>
            <button
              onClick={() => setAwardFilter('moshari')}
              className={`px-2.5 py-0.5 rounded-sm ${
                awardFilter === 'moshari' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
              }`}
            >
              MOSHARI
            </button>
            <span className="text-[var(--about-ink)]">/</span>
            <button
              onClick={() => setAwardFilter('foreigners')}
              className={`px-2.5 py-0.5 rounded-sm ${
                awardFilter === 'foreigners' ? 'text-[var(--about-ink)] underline underline-offset-4' : 'text-[var(--about-ink)] hover:text-[var(--about-ink)]'
              }`}
            >
              FOREIGNERS ONLY
            </button>
          </div>
        </div>

        {/* Tabular Archive */}
        <div className="text-xs font-mono-custom">
          {filteredAwards.map((award) => (
            <div
              key={award.id}
              className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline hover:bg-[var(--about-ink-5)] transition-colors px-1"
            >
              {/* 1. FESTIVAL NAME WITH YEAR */}
              <div className="sm:col-span-5 text-[var(--about-ink)] font-normal truncate">
                {award.organization} {award.date}
              </div>

              {/* 2. AWARD NAME */}
              <div className="sm:col-span-4 text-[var(--about-ink)] font-medium">
                {award.title}
              </div>

              {/* 3. FILM NAME */}
              <div className="sm:col-span-3 text-[var(--about-ink)] uppercase text-right truncate">
                {award.film || 'NARRATIVE'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRESS & INTERVIEWS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink)]">
            PRESS & INTERVIEWS ({pressData.length})
          </h2>
          <span className="text-[10px] font-mono-custom text-[var(--about-ink)] uppercase">GLOBAL COVERAGE
          </span>
        </div>

        <div className="text-xs font-mono-custom">
          {pressData.map((item) => (
            <div
              key={item.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--about-ink-5)] transition-colors px-1 group"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-3 text-[var(--about-ink)]">
                  <span className="text-[var(--about-ink)] uppercase">{item.publisher}</span>
                  <span>—</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-sm font-sans text-[var(--about-ink)] group-hover:underline">
                  {item.title}
                </h3>
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono-custom text-[var(--about-ink)] hover:opacity-60 border border-[var(--about-border)] px-2.5 py-1 flex items-center gap-1 uppercase tracking-widest shrink-0 transition-all rounded-sm"
                >
                  <span>READ ARTICLE</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SELECTED CLIENTS */}
      <div className="space-y-6 pb-8">
        <div className="pb-3">
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink-80)]">
            SELECTED CLIENTS & BRANDED PARTNERS
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono-custom text-[var(--about-ink)]">
          {activeClients.map((client, idx) => (
            <div key={idx} className="pl-3 py-2 bg-[var(--about-ink-5)] hover:bg-[var(--about-ink-10)] transition-all rounded-r-sm">
              {client}
            </div>
          ))}
        </div>
      </div>

      {/* Floating map removed — hover now swaps the portrait frame above with demo photos */}
    </motion.div>
  );
};
