import React, { useState } from 'react';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ExternalLink, Award, Sparkles, Film } from 'lucide-react';
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

/* ---------------------------------------------------- */
/* CLIENT LOGOS VISUAL SHOWCASE (Matching User Image)   */
/* ---------------------------------------------------- */
const FeaturedClientLogosGrid = () => {
  return (
    <div className="bg-black text-white p-8 sm:p-12 rounded-sm border border-black shadow-2xl space-y-8">
      <div className="flex items-center justify-between border-b border-white/20 pb-4">
        <h3 className="font-mono-custom text-sm font-bold tracking-[0.3em] uppercase text-white">
          CLIENTS
        </h3>
        <span className="text-[10px] font-mono-custom text-[#b5ff32] uppercase tracking-widest font-bold">
          BRANDED DIRECTORIAL & CINEMATOGRAPHY
        </span>
      </div>

      {/* 5-Column Grid matching user's reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-12 items-center justify-items-center">
        
        {/* 1. Hulu */}
        <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform cursor-pointer">
          <span className="text-[#1ce783] font-black text-3xl sm:text-4xl tracking-tighter lowercase font-sans">
            hulu
          </span>
        </div>

        {/* 2. Yamaha */}
        <div className="flex items-center justify-center gap-2 p-4 text-[#e60012] hover:scale-110 transition-transform cursor-pointer">
          <svg className="w-7 h-7 shrink-0 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 4v16M4 12h16M6.34 6.34l11.32 11.32M6.34 17.66L17.66 6.34" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-black tracking-widest text-lg sm:text-xl font-sans uppercase">
            YAMAHA
          </span>
        </div>

        {/* 3. Vodafone */}
        <div className="flex items-center justify-center gap-2.5 p-4 hover:scale-110 transition-transform cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#e60000] flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-black italic leading-none transform translate-y-[-1px]">”</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-white tracking-tight lowercase font-sans">
            vodafone
          </span>
        </div>

        {/* 4. Waldorf Astoria */}
        <div className="flex flex-col items-center justify-center text-center text-white p-4 space-y-0.5 hover:scale-110 transition-transform cursor-pointer">
          <span className="font-serif text-2xl tracking-tighter font-normal text-white">W W</span>
          <span className="text-[9px] font-mono-custom tracking-[0.2em] uppercase text-neutral-200 font-bold">
            WALDORF ASTORIA
          </span>
          <span className="text-[7px] font-mono-custom tracking-[0.25em] uppercase text-neutral-400">
            HOTELS & RESORTS
          </span>
        </div>

        {/* 5. CNBC */}
        <div className="flex flex-col items-center justify-center gap-1 p-4 hover:scale-110 transition-transform cursor-pointer">
          <div className="flex items-center gap-0.5">
            <span className="w-2 h-3.5 bg-red-500 rounded-t-full transform -rotate-45" />
            <span className="w-2 h-4 bg-yellow-500 rounded-t-full transform -rotate-15" />
            <span className="w-2 h-4.5 bg-green-500 rounded-t-full" />
            <span className="w-2 h-4 bg-blue-500 rounded-t-full transform rotate-15" />
            <span className="w-2 h-3.5 bg-purple-500 rounded-t-full transform rotate-45" />
          </div>
          <span className="font-black text-white tracking-widest text-base sm:text-lg font-sans uppercase">
            CNBC
          </span>
        </div>

        {/* 6. Disney+ */}
        <div className="flex items-center justify-center gap-0.5 text-white p-4 hover:scale-110 transition-transform cursor-pointer">
          <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-blue-400 italic">
            Disney
          </span>
          <span className="text-blue-400 font-black text-2xl sm:text-3xl">+</span>
        </div>

        {/* 7. The Economist */}
        <div className="bg-[#e3120b] text-white px-4 py-2 text-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
          <span className="font-serif font-bold text-sm sm:text-base tracking-tight block leading-tight">
            The<br/>Economist
          </span>
        </div>

        {/* 8. Majid Al Futtaim */}
        <div className="flex flex-col items-center justify-center text-white p-4 space-y-1 hover:scale-110 transition-transform cursor-pointer">
          <div className="w-7 h-7 border-2 border-white rounded-t-full flex items-center justify-center">
            <div className="w-2.5 h-3.5 bg-white rounded-t-full" />
          </div>
          <div className="text-center space-y-0.5">
            <span className="text-[9px] font-sans text-neutral-300 block dir-rtl">ماجد الفطيم</span>
            <span className="text-[9px] font-mono-custom tracking-widest uppercase font-bold text-white block">
              MAJID AL FUTTAIM
            </span>
          </div>
        </div>

        {/* 9. Al Mouj Muscat */}
        <div className="flex flex-col items-center justify-center text-[#0084c8] text-center p-4 space-y-0.5 hover:scale-110 transition-transform cursor-pointer">
          <span className="text-xl font-bold font-sans tracking-tight">الموج</span>
          <span className="text-lg font-black tracking-tight text-[#0084c8]">al mouj</span>
          <span className="text-[8px] font-mono-custom tracking-[0.25em] uppercase text-neutral-400">muscat مسقط</span>
        </div>

        {/* 10. Uber */}
        <div className="flex items-center justify-center p-4 hover:scale-110 transition-transform cursor-pointer">
          <span className="text-white font-black text-3xl sm:text-4xl tracking-tighter font-sans">
            Uber
          </span>
        </div>

        {/* 11. Bank Muscat */}
        <div className="flex items-center justify-center gap-2.5 text-white p-4 hover:scale-110 transition-transform cursor-pointer">
          <div className="w-5 h-5 bg-[#e60012] transform rotate-45 shrink-0 shadow" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-sans text-neutral-300 dir-rtl">بنك مسقط</span>
            <span className="text-xs font-bold font-sans text-white uppercase tracking-wider">
              bank muscat
            </span>
          </div>
        </div>

        {/* 12. OQGN */}
        <div className="flex items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-wider font-sans p-4 hover:scale-110 transition-transform cursor-pointer">
          <span>OQ</span>
          <span className="text-[#80ba27]">G</span>
          <span>N</span>
        </div>

        {/* 13. The Sustainable City Yiti */}
        <div className="bg-white text-black px-3 py-2 text-center rounded-sm space-y-0.5 shadow hover:scale-110 transition-transform cursor-pointer">
          <span className="text-[9px] font-sans font-bold block text-blue-900 dir-rtl">المدينة المستدامة - يتي</span>
          <span className="text-[8px] font-mono-custom tracking-wider uppercase font-bold text-blue-950 block">
            THE SUSTAINABLE CITY - YITI
          </span>
        </div>

        {/* 14. The Global Fund */}
        <div className="flex items-center justify-center gap-2 text-white p-4 hover:scale-110 transition-transform cursor-pointer">
          <svg className="w-6 h-6 text-white shrink-0 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7a5 5 0 1 0 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col text-left text-white leading-tight font-black text-xs uppercase tracking-wider">
            <span>THE</span>
            <span>GLOBAL</span>
            <span>FUND</span>
          </div>
        </div>

      </div>
    </div>
  );
};

const bioImages = {
  default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  moshari: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
  foreigners: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop",
  clients: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop"
};

const bioTextData = {
  en: {
    p1: "Born and raised in the cradle of Dhaka, Bangladesh, Ejaz is a self-taught cinematographer and filmmaker working on narratives, commercials, and music videos.",
    p2: "Deeply moved by Rob Reiner's \"Stand By Me\" and Morshedul Islam's \"Dipu Number Two\", the two films perhaps sparked an artistic curiosity and passion for story in his childhood. While pursuing a photography degree in his early twenties with a deep-rooted interest in the art form, Ejaz became heavily invested in motion pictures after working on a series of documentary films.",
    p3: "Recently Ejaz was behind the camera on Jordan Peele and Riz Ahmed's executive produced short film \"MOSHARI\" [ MOSHARI ]. The multi-OSCAR®-qualifying, groundbreaking, genre-bending horror short won 11 awards from 20+ festivals around the world in 2022.",
    p4: "One of Ejaz's other recent films \"FOREIGNERS ONLY\" [ FOREIGNERS ONLY ] is the first Bangladeshi film commissioned for any US streaming platform by 20th Digital Studio. The film recently aired on US streaming giant HULU's Bite Size Halloween Season 3 - Episode 9.",
    p5: "Currently based in Oman and Bangladesh, Ejaz actively seeks stories and projects that resonate with his South Asian roots and identity. He has also shot several commercials and branded content for a variety of clients including Vodafone, Yamaha, Uber, Majid-Al-Futtaim, Muscat Bay, BBC Storyworks, The Global Fund, Omran Group, and more [ GLOBAL CLIENTS ]."
  },
  bn: {
    p1: "ঢাকার স্নিগ্ধ কোলে লালিত-পালিত এজাজ মেহেদী একজন স্বশিক্ষিত চিত্রগ্রাহক ও চলচ্চিত্র নির্মাতা, যিনি কাহিনিচিত্র, বাণিজ্যিক বিজ্ঞাপন ও মিউজিক ভিডিও নির্মাণে কাজ করছেন।",
    p2: "রব রাইনারের 'স্ট্যান্ড বাই মি' এবং মোরশেদুল ইসলামের 'দীপু নম্বর টু' ছবি দুটি শৈশবেই তাঁর মনে গল্প ও শিল্পের প্রতি গভীর অনুরাগের জন্ম দেয়। বিশের কোঠায় ফটোগ্রাফিতে ডিগ্রি অর্জনের সময় ডকুমেন্টির সিরিজে কাজের মাধ্যমে চলচ্ছছবির প্রতি তাঁর গভীর প্রেম তৈরি হয়।",
    p3: "সম্প্রতি এজাজ জর্ডান পিল এবং রিজ আহমেদ প্রযোজিত প্রশংসিত স্বল্পদৈর্ঘ্য চলচ্চিত্র \"মশারি\"-র চিত্রগ্রাহক (DOP) হিসেবে কাজ করেছেন [ MOSHARI ]। অস্কার® যোগ্যতাসম্পন্ন এই হরর শর্ট ফিল্মটি ২০২২ সালে বিশ্বের ২০টিরও বেশি উৎসবে ১১টি পুরস্কার অর্জন করে।",
    p4: "তাঁর পরিচালিত অন্য অন্যতম আলোচিত চলচ্চিত্র \"ফরেনার্স অনলি\" [ FOREIGNERS ONLY ] হলো ২০থ ডিজিটাল স্টুডিও কর্তৃক মার্কিন স্ট্রিমারের জন্য কমিশন করা প্রথম বাংলাদেশি চলচ্চিত্র, যা পরে HULU-র বাইট সাইজ হ্যালোউইন সিজন ৩-এ পরিবেশিত হয়।",
    p5: "বর্তমানে ওমান ও বাংলাদেশে অবস্থানরত এজাজ দক্ষিণ এশীয় শেকড় ও পরিচয়ের সাথে সংগতিপূর্ণ গল্প খুঁজে চলেছেন। তিনি ভোডাফোন, ইয়ামাহা, উবার, মজিদ-আল-ফুত্তাইম, মাসকাট বে, বিবিসি স্টোরিওয়ার্কস, দ্য গ্লোবাল ফান্ড, ওমান গ্রুপসহ বিভিন্ন বৈশ্বিক ব্র্যান্ডের বাণিজ্যিক বিজ্ঞাপন চিত্রায়িত করেছেন [ GLOBAL CLIENTS ]।"
  },
  ar: {
    p1: "نشأ إعزاز مهدي في دكا، بنغلاديش، وهو مدير تصوير سينمائي ومخرج عصامي يعمل في الأفلام الروائية والإعلانات التجارية والفيديو كليب.",
    p2: "تأثر في طفولته بشدة بفيلم 'Stand By Me' للمخرج روب راينر وفيلم 'Dipu Number Two' للمخرج مرشد الإسلام، مما أشعل شغفه بالسرد البصري. وأثناء دراسته للتصوير الفوتوغرافي في أوائل عشرينياته، دخل عالم السينما عبر إخراج الأفلام الوثائقية.",
    p3: "مؤخراً، عمل إعزاز كمدير تصوير للفيلم القصير 'موشاري' [ MOSHARI ] من إنتاج جوردان بيل وريز أحمد. حصد الفيلم المؤهل لجوائز الأوسكار® 11 جائزة في أكثر من 20 مهرجاناً سينمائياً حول العالم في عام 2022.",
    p4: "كما يعد فيلمه القصير 'FOREIGNERS ONLY' [ FOREIGNERS ONLY ] أول فيلم بنغلاديشي يتم تكليفه للمنصات الأمريكية بواسطة 20th Digital Studio، حيث عُرض على منصة HULU العالمية.",
    p5: "يقيم إعزاز حالياً بين عُمان وبنغلاديش، ويسعى دائماً لإخراج قصص تعبر عن هويته وجذوره في جنوب آسيا. وقد صور إعلانات تجارية لعلامات بارزة مثل فودافون، ياماها، أوبر، ماجد الفطيم، مسقط باي، بي بي سي ستوري ووركس، عمران، وغيرها [ GLOBAL CLIENTS ]."
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

export const AboutPage = ({ cmsInfo, cmsClients }) => {
  const [activeImageKey, setActiveImageKey] = useState('default');
  const [awardFilter, setAwardFilter] = useState('all'); // 'all', 'moshari', 'foreigners'

  const personalEmail = cmsInfo?.personalEmail || PERSONAL_EMAIL;
  const instagramUrl = cmsInfo?.instagramUrl || INSTAGRAM_URL;
  const linkedinUrl = cmsInfo?.linkedinUrl || LINKEDIN_URL;
  const activeClients = cmsClients || clientsData;

  const [bioLang, setBioLang] = useState('en'); // 'en', 'bn', 'ar'

  const currentBio = bioLang === 'en' && cmsInfo?.bioEn
    ? { ...bioTextData.en, ...cmsInfo.bioEn }
    : bioTextData[bioLang];

  // Helper to parse interactive badges inside bio text
  const renderInteractiveText = (text) => {
    if (!text) return null;

    const badges = [
      { key: 'moshari', label: '[ MOSHARI ]' },
      { key: 'foreigners', label: '[ FOREIGNERS ONLY ]' },
      { key: 'clients', label: '[ GLOBAL CLIENTS ]' }
    ];

    let parts = [text];

    badges.forEach(({ key, label }) => {
      const nextParts = [];
      parts.forEach((part) => {
        if (typeof part === 'string' && part.includes(label)) {
          const sub = part.split(label);
          for (let i = 0; i < sub.length; i++) {
            nextParts.push(sub[i]);
            if (i < sub.length - 1) {
              nextParts.push(
                <span
                  key={`${key}-${i}`}
                  onMouseEnter={() => setActiveImageKey(key)}
                  onMouseLeave={() => setActiveImageKey('default')}
                  onTouchStart={() => setActiveImageKey(key)}
                  className="px-2 py-0.5 mx-1 bg-black text-[#b5ff32] font-mono-custom text-xs font-bold uppercase cursor-pointer hover:bg-black/80 transition-colors inline-block rounded-sm"
                >
                  {label}
                </span>
              );
            }
          }
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen text-black pt-2 md:pt-4 pb-12 px-4 sm:px-8 max-w-[1700px] mx-auto space-y-12 md:space-y-16 font-sans select-none"
    >
      
      {/* OVERSIZED HERO SECTION TITLE */}
      <div className="pt-2 md:pt-4 pb-8 md:pb-12 border-b border-black/20 space-y-3">
        <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase text-black font-sans select-none">
          INFORMATION
        </h1>
        <p className="text-xs sm:text-sm font-mono-custom tracking-[0.22em] uppercase text-black/80 font-bold pl-1 flex flex-wrap items-center gap-2">
          <span>the biography & direct contact archive of</span>
          <span className="font-editorial italic lowercase font-normal border-b border-black/40">ejaz mehedi</span>
          <span className="text-[10px] bg-black text-[#b5ff32] px-2 py-0.5 font-bold uppercase rounded-sm">DOP & FILMMAKER</span>
        </p>
      </div>

      {/* TOP SECTION: BIOGRAPHY + DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start border-b border-black/20 pb-16 md:pb-20">
        
        {/* Left Side: Photo Frame Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="lg:col-span-5 space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-mono-custom tracking-[0.25em] uppercase text-black/80 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>BIOGRAPHY // DIRECTOR & DOP</span>
            </div>
            <span className="text-[10px] text-black/60 font-mono-custom">
              {activeImageKey.toUpperCase()} VIEW
            </span>
          </div>

          <div className="w-full aspect-square overflow-hidden bg-black/10 border border-black/30 relative group shadow-xl">
            <img
              src={bioImages[activeImageKey] || bioImages.default}
              alt="Ejaz Mehedi Portrait"
              className="w-full h-full object-cover transition-all duration-700 filter brightness-95 contrast-105 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 bg-black/90 text-[#b5ff32] font-mono-custom text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-black/40">
              OMAN // BANGLADESH // WORLDWIDE
            </div>
          </div>
        </motion.div>

        {/* Right Side: Biography Paragraphs with Tiny Language Switch & Direct Contact */}
        <div className="lg:col-span-7 space-y-8 pt-2">
          
          {/* Biography Header with Tiny Language Selector */}
          <div className="flex items-center justify-between border-b border-black/20 pb-3">
            <span className="text-xs font-mono-custom tracking-[0.25em] uppercase text-black/80 font-bold flex items-center gap-2">
              <Film className="w-3.5 h-3.5" />
              <span>BIOGRAPHY ARCHIVE</span>
            </span>

            {/* Character Script Language Selector [ A | অ | ع ] */}
            <div className="flex items-center gap-1.5 text-xs font-mono-custom uppercase tracking-wider">
              <button
                onClick={() => setBioLang('en')}
                title="English"
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs ${
                  bioLang === 'en' ? 'bg-black text-[#b5ff32] font-black scale-105 shadow' : 'text-black/70 hover:text-black hover:bg-black/10'
                }`}
              >
                A
              </button>
              <span className="text-black/30 text-[10px]">/</span>
              <button
                onClick={() => setBioLang('bn')}
                title="বাংলা"
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'bn' ? 'bg-black text-[#b5ff32] font-black scale-105 shadow' : 'text-black/70 hover:text-black hover:bg-black/10'
                }`}
              >
                অ
              </button>
              <span className="text-black/30 text-[10px]">/</span>
              <button
                onClick={() => setBioLang('ar')}
                title="العربية"
                className={`px-2.5 py-1 transition-all rounded-sm font-bold text-xs font-sans ${
                  bioLang === 'ar' ? 'bg-black text-[#b5ff32] font-black scale-105 shadow' : 'text-black/70 hover:text-black hover:bg-black/10'
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
              transition={{ staggerChildren: 0.1 }}
              className={`space-y-4 sm:space-y-5 text-sm sm:text-base leading-relaxed text-black font-medium ${
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

          {/* DIRECT CONTACT AREA */}
          <div className="pt-6 border-t border-black/20 space-y-6">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-black/80 font-bold block">
              DIRECT CONTACT & REPRESENTATION
            </span>

            {/* Personal Email Card */}
            <div className="bg-black text-[#b5ff32] border border-black p-5 sm:p-6 rounded-sm shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-sans text-[#b5ff32]/70 uppercase tracking-[0.25em] block font-bold">
                  PERSONAL EMAIL & BOOKINGS
                </span>
                <a
                  href={`mailto:${personalEmail}`}
                  className="text-lg sm:text-xl md:text-2xl font-mono-custom text-[#b5ff32] font-bold tracking-tight hover:underline transition-all"
                >
                  {personalEmail}
                </a>
              </div>
              <a
                href={`mailto:${personalEmail}`}
                className="px-4 py-2 bg-[#b5ff32] text-black font-mono-custom text-xs font-bold uppercase tracking-widest hover:bg-[#a2eb26] transition-colors shrink-0 text-center"
              >
                SEND INQUIRY
              </a>
            </div>

            {/* Social Media — Logo Tiles */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group flex items-center text-black transition-colors gap-2"
              >
                <span className="w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-[#b5ff32] transition-all">
                  <InstagramIcon className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-custom font-bold uppercase tracking-wider group-hover:underline">
                  INSTAGRAM
                </span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="group flex items-center text-black transition-colors gap-2"
              >
                <span className="w-10 h-10 border border-black flex items-center justify-center group-hover:bg-black group-hover:text-[#b5ff32] transition-all">
                  <LinkedinIcon className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono-custom font-bold uppercase tracking-wider group-hover:underline">
                  LINKEDIN
                </span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* FEATURED FILM ACCOLADES SHOWCASE: MOSHARI & FOREIGNERS ONLY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8 border-b border-black/20 pb-16 md:pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/20 pb-4">
          <div>
            <span className="text-[10px] font-mono-custom text-black/60 uppercase tracking-[0.25em] font-bold block">
              FEATURED NARRATIVE PROJECTS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
              MOSHARI & FOREIGNERS ONLY ACCOLADES
            </h2>
          </div>
          <p className="text-xs font-mono-custom text-black/80 max-w-md">
            Multi-Oscar® Qualifying Horror & First Bangladeshi Film Commissioned for HULU by 20th Digital Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* MOSHARI Showcase Box */}
          <div className="bg-black text-white p-6 sm:p-8 rounded-sm space-y-5 border border-black shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-[#b5ff32] font-mono-custom text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#b5ff32]" />
                11 AWARDS // 20+ FESTIVALS
              </span>
              <span className="text-[10px] bg-[#b5ff32] text-black font-bold font-mono-custom px-2 py-0.5 uppercase">
                OSCAR® QUALIFYING
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#b5ff32] tracking-tight">
                MOSHARI (2022)
              </h3>
              <p className="text-xs font-mono-custom text-neutral-400 pt-1">
                Exec Produced by Jordan Peele & Riz Ahmed // DOP: Ejaz Mehedi
              </p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              The groundbreaking, genre-bending horror short won 11 awards from 20+ festivals around the world in 2022 and 2023.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono-custom">
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>SXSW</span>
                <span className="text-white text-right">Grand Jury Award, Best Midnight Short</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>SHORT SHORTS & ASIA</span>
                <span className="text-white text-right">Governor of Tokyo Award (Oscar® Qualifying)</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>WOODSTOCK FILM FESTIVAL</span>
                <span className="text-white text-right">Best Narrative Short (Oscar® Qualifying)</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>ATLANTA FILM FESTIVAL</span>
                <span className="text-white text-right">Best Narrative Short (Oscar® Qualifying)</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>FANTASIA // HOLLYSHORTS</span>
                <span className="text-white text-right">Gold Award & Best Horror Award</span>
              </div>
            </div>
          </div>

          {/* FOREIGNERS ONLY Showcase Box */}
          <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-sm space-y-5 border border-black shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-[#b5ff32] font-mono-custom text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#b5ff32]" />
                HULU STREAMING EXCLUSIVE
              </span>
              <span className="text-[10px] bg-white text-black font-bold font-mono-custom px-2 py-0.5 uppercase">
                20TH DIGITAL STUDIO
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#b5ff32] tracking-tight">
                FOREIGNERS ONLY (2023)
              </h3>
              <p className="text-xs font-mono-custom text-neutral-400 pt-1">
                HULU Bite Size Halloween Season 3 - Ep 9 // DOP: Ejaz Mehedi
              </p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              First Bangladeshi film commissioned for any US streaming platform by 20th Digital Studio. Aired globally on US streaming giant HULU.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono-custom">
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>FANTASIA FILM FESTIVAL (CANADA)</span>
                <span className="text-white text-right">Gold Award, Best Asian Short</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>HOLLYSHORTS FILM FESTIVAL (US)</span>
                <span className="text-white text-right">Best Horror Award</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>BFI LONDON (UK)</span>
                <span className="text-white text-right">Official Selection</span>
              </div>
              <div className="flex items-baseline justify-between text-[#b5ff32] font-bold">
                <span>NEUCHATEL (SWITZERLAND)</span>
                <span className="text-white text-right">Audience Award & Youth Award</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* SECTION: AWARDS & HONORS GRID WITH FILTER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-black/20 pb-16 md:pb-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-black/80">
            AWARDS & FESTIVAL EXHIBITIONS ({filteredAwards.length})
          </h2>

          <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider">
            <button
              onClick={() => setAwardFilter('all')}
              className={`px-3 py-1 rounded-sm font-bold ${
                awardFilter === 'all' ? 'bg-black text-[#b5ff32]' : 'text-black/60 hover:text-black'
              }`}
            >
              ALL ACCOLADES
            </button>
            <span>/</span>
            <button
              onClick={() => setAwardFilter('moshari')}
              className={`px-3 py-1 rounded-sm font-bold ${
                awardFilter === 'moshari' ? 'bg-black text-[#b5ff32]' : 'text-black/60 hover:text-black'
              }`}
            >
              MOSHARI
            </button>
            <span>/</span>
            <button
              onClick={() => setAwardFilter('foreigners')}
              className={`px-3 py-1 rounded-sm font-bold ${
                awardFilter === 'foreigners' ? 'bg-black text-[#b5ff32]' : 'text-black/60 hover:text-black'
              }`}
            >
              FOREIGNERS ONLY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAwards.map((award) => (
            <div key={award.id} className="bg-black/5 border border-black/20 p-5 rounded-sm space-y-2 hover:bg-black/10 transition-all group">
              <div className="flex items-center justify-between text-[10px] font-mono-custom text-black/70 font-bold uppercase">
                <span>{award.date} // {award.film || 'FILM'}</span>
                {award.badge && (
                  <span className="bg-black text-[#b5ff32] px-2 py-0.5 text-[9px]">
                    {award.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-sans text-black font-bold group-hover:underline">
                {award.title}
              </h3>
              <p className="text-xs font-mono-custom text-black/80 font-bold">
                {award.organization}
              </p>
              <p className="text-xs text-black/70 leading-relaxed font-medium">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION: PRESS & INTERVIEWS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6 md:space-y-8 border-b border-black/20 pb-16 md:pb-20"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-black/80">
            PRESS & INTERVIEWS ARCHIVE ({pressData.length})
          </h2>
          <span className="text-[10px] font-mono-custom text-black/60 uppercase font-bold">
            GLOBAL MEDIA COVERAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressData.map((item) => (
            <div
              key={item.id}
              className="bg-black/5 border border-black/20 p-5 rounded-sm space-y-3 group hover:border-black transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono-custom text-black/70 font-bold uppercase">
                <span>{item.publisher}</span>
                <span>{item.date}</span>
              </div>
              <h3 className="text-base font-sans text-black font-bold leading-snug group-hover:opacity-80 transition-opacity">
                {item.title}
              </h3>
              <p className="text-xs text-black/80 font-medium leading-relaxed">
                {item.description}
              </p>

              {item.link && item.link !== '#' && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono-custom text-black font-bold hover:underline uppercase tracking-widest inline-flex items-center gap-1 pt-1"
                >
                  <span>READ ARTICLE / INTERVIEW</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* SECTION: VISUAL CLIENT LOGOS & BRAND PARTNERS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8 pb-12"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono-custom tracking-[0.3em] uppercase font-bold text-black/80">
            SELECTED CLIENTS & BRANDED PARTNERS
          </h2>
          <span className="text-[10px] font-mono-custom text-black/60 uppercase font-bold">
            INTERNATIONAL CAMPAIGNS
          </span>
        </div>

        {/* 1. VISUAL BRAND LOGOS SHOWCASE (Matching Screenshot) */}
        <FeaturedClientLogosGrid />

        {/* 2. COMPLETE CLIENT TEXT TAGS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-xs font-mono-custom text-black font-bold pt-4">
          {activeClients.map((client, idx) => (
            <div key={idx} className="border-l-2 border-black pl-3 py-2 bg-black/5 hover:bg-black hover:text-[#b5ff32] transition-colors rounded-r-sm">
              {client}
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};
