import React, { useState } from 'react';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ejazPortrait from '../assets/ejaz-portrait.png';

const PERSONAL_EMAIL = 'contact@ejazmehedi.com';
const INSTAGRAM_URL = 'https://instagram.com/ejazmehedi';

const OmanFlagIcon = ({ className }) => (
  <svg viewBox="0 0 36 24" className={className} aria-hidden="true">
    <rect width="36" height="24" fill="#ffffff" />
    <rect y="8" width="36" height="8" fill="#e21836" />
    <rect y="16" width="36" height="8" fill="#009b4e" />
    <rect width="12" height="24" fill="#e21836" />
    <path d="M5 6c1.6 2.1 1.6 4.4 0 6.5-0.8-1.1-1.3-2.2-1.3-3.25S4.2 7.1 5 6z" fill="#ffffff" />
  </svg>
);

const BangladeshFlagIcon = ({ className }) => (
  <svg viewBox="0 0 36 24" className={className} aria-hidden="true">
    <rect width="36" height="24" fill="#006a4e" />
    <circle cx="14.4" cy="12" r="6.3" fill="#f42a41" />
  </svg>
);

const bioImages = {
  default: ejazPortrait,
  oman: "https://media.istockphoto.com/id/1060040826/photo/oman-omani-flag-textile-cloth-fabric-waving-on-the-top-sunrise-mist-fog.jpg",
  bangladesh: "https://img.magnific.com/premium-photo/national-flag-texture-bangladesh-map_485374-17422.jpg",
  southasia: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Map_of_South_Asia.png/960px-Map_of_South_Asia.png"
};

const bioTextData = {
  en: {
    p1: "Born and raised in the cradle of Dhaka, Bangladesh, Ejaz is a self-taught cinematographer and filmmaker working on narratives, commercials, and music videos.",
    p2: "Deeply moved by Rob Reiner's \"Stand By Me\" and Morshedul Islam's \"Dipu Number Two\", the two films perhaps sparked an artistic curiosity and passion for story in his childhood. While pursuing a photography degree in his early twenties with a deep-rooted interest in the art form, Ejaz became heavily invested in motion pictures after working on a series of documentary films.",
    p3: "Recently Ejaz was behind the camera on Jordan Peele and Riz Ahmed's executive produced short film \"MOSHARI\". The multi-OSCAR®-qualifying, groundbreaking, genre-bending horror short won 11 awards from 20+ festivals around the world in 2022.",
    p4: "One of Ejaz's other recent films \"FOREIGNERS ONLY\" is the first Bangladeshi film commissioned for any US streaming platform by 20th Digital Studio. The film recently aired on US streaming giant HULU's Bite Size Halloween Season 3 - Episode 9.",
    p5: "Currently based in Oman and Bangladesh, Ejaz actively seeks stories and projects that resonate with his South Asian roots and identity. He has also shot several commercials and branded content for a variety of clients including Vodafone, Yamaha, Uber, Majid-Al-Futtaim, Muscat Bay, BBC Storyworks, The Global Fund, Omran Group, and more."
  },
  bn: {
    p1: "ঢাকার স্নিগ্ধ কোলে লালিত-পালিত এজাজ মেহেদী একজন স্বশিক্ষিত চিত্রগ্রাহক ও চলচ্চিত্র নির্মাতা, যিনি কাহিনিচিত্র, বাণিজ্যিক বিজ্ঞাপন ও মিউজিক ভিডিও নির্মাণে কাজ করছেন।",
    p2: "রব রাইনারের 'স্ট্যান্ড বাই মি' এবং মোরশেদুল ইসলামের 'দীপু নম্বর টু' ছবি দুটি শৈশবেই তাঁর মনে গল্প ও শিল্পের প্রতি গভীর অনুরাগের জন্ম দেয়। বিশের কোঠায় ফটোগ্রাফিতে ডিগ্রি অর্জনের সময় ডকুমেন্টারি সিরিজে কাজের মাধ্যমে চলচ্ছছবির প্রতি তাঁর গভীর প্রেম তৈরি হয়।",
    p3: "সম্প্রতি এজাজ জর্ডান পিল এবং রিজ আহমেদ প্রযোজিত প্রশংসিত স্বল্পদৈর্ঘ্য চলচ্চিত্র \"মশারি\"-র চিত্রগ্রাহক (DOP) হিসেবে কাজ করেছেন। অস্কার® যোগ্যতাসম্পন্ন এই হরর শর্ট ফিল্মটি ২০২২ সালে বিশ্বের ২০টিরও বেশি উৎসবে ১১টি পুরস্কার অর্জন করে।",
    p4: "তাঁর অন্যতম আলোচিত চলচ্চিত্র \"ফরেনার্স অনলি\" হলো ২০থ ডিজিটাল স্টুдио কর্তৃক মার্কিন স্ট্রিমারের জন্য কমিশন করা প্রথম বাংলাদেশি চলচ্চিত্র, যা পরে HULU-র বাইট সাইজ হ্যালোউইন সিজন ৩-এ পরিবেশিত হয়।",
    p5: "বর্তমানে ওমান ও বাংলাদেশে অবস্থানরত এজাজ দক্ষিণ এশীয় শেকড় ও পরিচয়ের সাথে সংগতিপূর্ণ গল্প খুঁজে চলেছেন। তিনি ভোডাফোন, ইয়ামাহা, উবার, মজিদ-আল-ফুত্তাইম, মাসকাট বে, বিবিসি স্টোরিওয়ার্কস, দ্য গ্লোবাল ফান্ড, ওমান গ্রুপসহ বিভিন্ন বৈশ্বিক ব্র্যান্ডের বাণিজ্যিক বিজ্ঞাপন চিত্রায়িত করেছেন।"
  },
  ar: {
    p1: "نشأ إعزاز مهدي في دكا، بنغلاديش، وهو مدير تصوير سينمائي ومخرج عصامي يعمل في الأفلام الروائية والإعلانات التجارية والفيديو كليب.",
    p2: "تأثر في طفولته بشدة بفيلم 'Stand By Me' للمخرج روب راينر وفيلم 'Dipu Number Two' للمخرج مرشد الإسلام، مما أشعل شغفه بالسرد البصري. وأثناء دراسته للتصوير الفوتوغرافي في أوائل عشرينياته، دخل عالم السينما عبر إخراج الأفلام الوثائقية.",
    p3: "مؤخراً، عمل إعزاز كمدير تصوير للفيلم القصير 'موشاري' من إنتاج جوردان بيل وريز أحمد. حصد الفيلم المؤهل لجوائز الأوسكار® 11 جائزة في أكثر من 20 مهرجاناً سينمائياً حول العالم في عام 2022.",
    p4: "كما يعد فيلمه القصير 'FOREIGNERS ONLY' أول فيلم بنغلاديشي يتم تكليفه للمنصات الأمريكية بواسطة 20th Digital Studio، حيث عُرض على منصة HULU العالمية.",
    p5: "يقيم إعزاز حالياً بين عُمان وبنغلاديش، ويسعى دائماً لإخراج قصص تعبر عن هويته وجذوره في جنوب آسيا. وقد صور إعلانات تجارية لعلامات بارزة مثل فودافون، ياماها، أوبر، ماجد الفطيم، مسقط باي، بي بي سي ستوري ووركس، عمران، وغيرها."
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

export const AboutPage = ({ cmsInfo, cmsClients }) => {
  const [activeImageKey, setActiveImageKey] = useState('default');
  const [awardFilter, setAwardFilter] = useState('all');

  const personalEmail = cmsInfo?.personalEmail || PERSONAL_EMAIL;
  const instagramUrl = cmsInfo?.instagramUrl || INSTAGRAM_URL;
  const activeClients = cmsClients || clientsData;

  const [bioLang, setBioLang] = useState('en');

  const currentBio = bioLang === 'en' && cmsInfo?.bioEn
    ? { ...bioTextData.en, ...cmsInfo.bioEn }
    : bioTextData[bioLang];

  const interactiveKeywords = {
    en: [
      { key: 'oman', match: 'Oman', icon: <OmanFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'bangladesh', match: 'Bangladesh', icon: <BangladeshFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'southasia', match: 'South Asian' },
      { key: 'southasia', match: 'South Asia' }
    ],
    bn: [
      { key: 'oman', match: 'ওমান', icon: <OmanFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'bangladesh', match: 'বাংলাদেশ', icon: <BangladeshFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'southasia', match: 'দক্ষিণ এশীয়' }
    ],
    ar: [
      { key: 'oman', match: 'عُمان', icon: <OmanFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'bangladesh', match: 'بنغلاديش', icon: <BangladeshFlagIcon className="w-3.5 h-3.5 rounded-[1px]" /> },
      { key: 'southasia', match: 'جنوب آسيا' }
    ]
  };

  const renderInteractiveText = (text) => {
    if (!text) return null;
    const keywords = interactiveKeywords[bioLang] || interactiveKeywords.en;
    let parts = [text];

    keywords.forEach((kw) => {
      const nextParts = [];
      parts.forEach((part) => {
        if (typeof part === 'string') {
          const lower = part.toLowerCase();
          const kwLower = kw.match.toLowerCase();
          let idx = lower.indexOf(kwLower);
          let cursor = 0;
          let count = 0;
          while (idx !== -1) {
            nextParts.push(part.slice(cursor, idx));
            nextParts.push(
              <span
                key={`${kw.key}-${count++}`}
                onMouseEnter={() => setActiveImageKey(kw.key)}
                onMouseLeave={() => setActiveImageKey('default')}
                onTouchStart={() => setActiveImageKey(kw.key)}
                onTouchEnd={() => setActiveImageKey('default')}
                className="px-1.5 py-0.5 mx-0.5 bg-[var(--about-chip-bg)] text-[var(--about-chip-text)] font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-[var(--about-chip-hover)] transition-colors inline-flex items-center gap-1 align-baseline rounded-sm shadow-sm"
              >
                {kw.icon}
                {part.slice(idx, idx + kw.match.length)}
              </span>
            );
            cursor = idx + kw.match.length;
            idx = lower.indexOf(kwLower, cursor);
          }
          nextParts.push(part.slice(cursor));
        } else {
          nextParts.push(part);
        }
      });
      parts = nextParts;
    });

    return parts;
  };

  const filteredAwards = awardsData.filter((item) => {
    if (awardFilter === 'moshari') return item.film === 'MOSHARI';
    if (awardFilter === 'foreigners') return item.film === 'FOREIGNERS ONLY';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen text-[var(--about-ink)] pt-2 pb-24 px-4 sm:px-6 lg:px-8 font-sans select-none max-w-[1700px] mx-auto space-y-12 md:space-y-16"
    >
      
      {/* TOP SECTION: BIOGRAPHY + PORTRAIT & DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start pb-12 md:pb-16">
        
        {/* Left Side: Photo Frame Container */}
        <div className="lg:col-span-5 space-y-6">
          <div className="w-full aspect-square overflow-hidden bg-[var(--about-ink-10)] border border-[var(--about-border)] relative group shadow-xl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={activeImageKey}
                src={bioImages[activeImageKey] || bioImages.default}
                alt="Ejaz Mehedi"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                draggable={false}
                className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
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
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs ${
                  bioLang === 'en' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)] font-black scale-105 shadow' : 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)] hover:bg-[var(--about-ink-10)]'
                }`}
              >
                A
              </button>
              <span className="text-[var(--about-ink-30)] text-[10px]">/</span>
              <button
                onClick={() => setBioLang('bn')}
                title="বাংলা"
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'bn' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)] font-black scale-105 shadow' : 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)] hover:bg-[var(--about-ink-10)]'
                }`}
              >
                অ
              </button>
              <span className="text-[var(--about-ink-30)] text-[10px]">/</span>
              <button
                onClick={() => setBioLang('ar')}
                title="العربية"
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'ar' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)] font-black scale-105 shadow' : 'text-[var(--about-ink-70)] hover:text-[var(--about-ink)] hover:bg-[var(--about-ink-10)]'
                }`}
              >
                ع
              </button>
            </div>
          </div>

          {/* Biography Text Paragraphs */}
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
                <motion.p key={key} variants={paragraphVariant}>
                  {renderInteractiveText(currentBio[key])}
                </motion.p>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Contact Info at bottom of biography */}
          <div className="pt-8 space-y-3 text-sm font-mono-custom">
            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--about-ink)] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-1 group"
            >
              EJAZMEHEDI
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {/* Email */}
            <a
              href={`mailto:${personalEmail}`}
              className="text-[var(--about-ink)] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-1 group"
            >
              {personalEmail}
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

        </div>

      </div>

      {/* FULL TABULAR AWARDS & HONORS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase font-bold text-[var(--about-ink-80)]">
            AWARDS & FESTIVAL EXHIBITIONS ({filteredAwards.length})
          </h2>

          {/* Minimal Filter */}
          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-widest">
            <button
              onClick={() => setAwardFilter('all')}
              className={`px-2.5 py-0.5 rounded-sm font-bold ${
                awardFilter === 'all' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)]' : 'text-[var(--about-ink-60)] hover:text-[var(--about-ink)]'
              }`}
            >
              ALL
            </button>
            <span className="text-[var(--about-ink-30)]">/</span>
            <button
              onClick={() => setAwardFilter('moshari')}
              className={`px-2.5 py-0.5 rounded-sm font-bold ${
                awardFilter === 'moshari' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)]' : 'text-[var(--about-ink-60)] hover:text-[var(--about-ink)]'
              }`}
            >
              MOSHARI
            </button>
            <span className="text-[var(--about-ink-30)]">/</span>
            <button
              onClick={() => setAwardFilter('foreigners')}
              className={`px-2.5 py-0.5 rounded-sm font-bold ${
                awardFilter === 'foreigners' ? 'bg-[var(--about-chip-bg)] text-[var(--about-chip-text)]' : 'text-[var(--about-ink-60)] hover:text-[var(--about-ink)]'
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
              <div className="sm:col-span-2 text-[var(--about-ink-70)] font-bold">
                {award.date}
              </div>
              <div className="sm:col-span-3 text-[var(--about-ink)] font-black uppercase truncate">
                {award.film || 'NARRATIVE'}
              </div>
              <div className="sm:col-span-4 text-[var(--about-ink)] font-medium">
                {award.title}
              </div>
              <div className="sm:col-span-3 text-[var(--about-ink-70)] text-right hidden sm:block truncate font-bold">
                {award.organization}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRESS & INTERVIEWS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase font-bold text-[var(--about-ink-80)]">
            PRESS & INTERVIEWS ({pressData.length})
          </h2>
          <span className="text-[10px] font-mono-custom text-[var(--about-ink-60)] uppercase font-bold">
            GLOBAL COVERAGE
          </span>
        </div>

        <div className="text-xs font-mono-custom">
          {pressData.map((item) => (
            <div
              key={item.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--about-ink-5)] transition-colors px-1 group"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-3 text-[var(--about-ink-70)]">
                  <span className="font-bold text-[var(--about-ink)] uppercase">{item.publisher}</span>
                  <span>—</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-sm font-sans text-[var(--about-ink)] font-bold group-hover:underline">
                  {item.title}
                </h3>
              </div>

              {item.link && item.link !== '#' && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono-custom text-[var(--about-ink)] hover:bg-[var(--about-chip-bg)] hover:text-[var(--about-chip-text)] border border-[var(--about-border)] px-2.5 py-1 flex items-center gap-1 uppercase tracking-widest shrink-0 font-bold transition-all rounded-sm"
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
          <h2 className="text-xs font-mono-custom tracking-[0.25em] uppercase font-bold text-[var(--about-ink-80)]">
            SELECTED CLIENTS & BRANDED PARTNERS
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono-custom text-[var(--about-ink)] font-bold">
          {activeClients.map((client, idx) => (
            <div key={idx} className="pl-3 py-2 bg-[var(--about-ink-5)] hover:bg-[var(--about-chip-bg)] hover:text-[var(--about-chip-text)] transition-all rounded-r-sm">
              {client}
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
