import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ejazPortrait from '../assets/ejaz-portrait.png';
import omanMap from '../assets/oman-outline.png';
import bangladeshMap from '../assets/bangladesh-outline.png';

const PERSONAL_EMAIL = 'ejazmeh.work@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/ejazmehedi';

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
    p4: "His work has since screened at more than 55 film festivals across 15 countries and received 19 awards. He photographed Nuhash Humayun’s MOSHARI, executive produced by Jordan Peele’s Monkeypaw Productions and Riz Ahmed’s Left Handed Films. The film received major recognition at SXSW, the Melbourne International Film Festival and Fantasia. He also served as Director of Photography on FOREIGNERS ONLY, produced for 20th Digital Studio and released on Hulu, as well as A Thing About Kashem and the feature film Moving Bangladesh.",
    p5: "He is currently based between Muscat, Dhaka and, more recently, New York City.",
    p6: "In Oman, besides working as a freelance cinematographer and director he also runs DUSK, a hybrid creative agency and production company producing premium brand films, commercials and branded content for clients across Oman and the wider region."
  },
  bn: {
    p1: "এজাজ মেহেদী একজন বাংলাদেশি সিনেম্যাটোগ্রাফার ও ফিল্মমেকার। দেশের প্রতি টান আর দীর্ঘ দিন প্রবাসে থাকার অভিজ্ঞতাই তাঁর ভিজ্যুয়াল পারসপেক্টিভ বা দৃশ্যভাবনাকে সমৃদ্ধ করেছে।",
    p2: "তিনি ঢাকায় বেড়ে ওঠেন। সিনেমা নিয়ে তাঁর প্রাথমিক আগ্রহ তৈরি হয় Rob Reiner-এর Stand By Me এবং Morshedul Islam-এর Dipu Number Two চলচ্চিত্রের মাধ্যমে। ভাষা বা ভৌগোলিক প্রেক্ষাপট আলাদা হলেও, ফ্রেমের সৌন্দর্য, বন্ধুত্ব, স্মৃতি আর বেড়ে ওঠার মানবিক অনুভূতি দুটি সিনেমাতেই গভীরভাবে ফুটে উঠেছিল—যা ফিল্মমেকিংকে পেশা হিসেবে বেছে নেওয়ার অনেক আগেই তাঁর মনে দাগ কাটে।",
    p3: "পরবর্তীতে তিনি পড়াশোনা ও কাজের সূত্রে ঢাকা থেকে যুক্তরাজ্যের নটিংহাম এবং মালয়েশিয়ার সাইবারজায়ায় যান। এরপর বহু বছর বিভিন্ন দেশে কাজ করার অভিজ্ঞতা অর্জন করেন। এই দূরত্বের কারণে বাংলাদেশের দিকে তাকানোর দৃষ্টিভঙ্গিও ধীরে ধীরে বদলে যায়। দীর্ঘ সময় প্রবাসে কাটিয়ে দেশে ফেরার পর তিনি দেশকে দেখতে পান একজন ইনসাইডার এবং আউটসাইডার—দুই রূপেই। একদিকে দক্ষিণ এশীয় জীবনের ছন্দ ও জটিলতার সাথে গভীর পরিচয়, অন্যদিকে কিছুটা দূর থেকে সবকিছু পরখ করার ক্ষমতা। এই দ্বৈত ভাবনাই তাঁর কাজের মূল ভিত্তি হয়ে ওঠে, যা স্থানীয় গল্পগুলোকে আন্তর্জাতিক ভিজ্যুয়াল ল্যাঙ্গুয়েজে উপস্থাপন করতে সাহায্য করে।",
    p4: "এ পর্যন্ত তাঁর কাজ ১৫টি দেশের ৫৫টিরও বেশি ফিল্ম ফেস্টিভ্যালে প্রদর্শিত হয়েছে এবং অর্জন করেছে ১৯টি আন্তর্জাতিক পুরস্কার। তিনি নুহাশ হুমায়ূনের বিখ্যাত শটফিল্ম MOSHARI-র ডিরেক্টর অব ফটোগ্রাফি (DP) হিসেবে কাজ করেছেন, যার এক্সিকিউটিভ প্রযোজক ছিলেন জর্ডান পিলের Monkeypaw Productions এবং রিজ আহমেদের Left Handed Films। চলচ্চিত্রটি SXSW, মেলবোর্ন আন্তর্জাতিক ফিল্ম ফেস্টিভ্যাল ও ফ্যান্টাসিয়া উৎসবে বড় ধরনের স্বীকৃতি পায়। এছাড়া তিনি 20th Digital Studio-এর প্রযোজনায় Hulu-তে মুক্তিপ্রাপ্ত FOREIGNERS ONLY, এবং A Thing About Kashem ও ফিচার ফিল্ম Moving Bangladesh-এর ডিরেক্টর অব ফটোগ্রাফি হিসেবে দায়িত্ব পালন করেছেন।",
    p5: "বর্তমানে তিনি মাস্কাট, ঢাকা এবং অতি সম্প্রতি নিউ ইয়র্ক সিটিকে কেন্দ্র করে তাঁর কাজ পরিচালনা করছেন।",
    p6: "ওমানে ফ্রিল্যান্স সিনেম্যাটোগ্রাফার ও ডিরেক্টর হিসেবে কাজের পাশাপাশি তিনি DUSK নামের একটি ক্রিয়েটিভ এজেন্সি ও প্রোডাকশন হাউসের ডিরেক্টর। এটি ওমানসহ এই অঞ্চলে প্রিমিয়াম ব্র্যান্ড ফিল্ম, বিজ্ঞাপন ও কনটেন্ট তৈরি করে থাকে।"
  },
  ar: {
    p1: "إيجاز مهدي هو مدير تصوير سينمائي وصانع أفلام بنغلاديشي، تشكّلت رؤيته البصرية الفنية من واقع ارتباطه الوجداني العميق بموطنه واغترابه عنه لفترات طويلة.",
    p2: "نشأ إيجاز في مدينة دكا في بنغلاديش، حيث ارتبطت أولى ذكرياته السينمائية بأفلام مثل Stand By Me للمخرج Rob Reiner وفيلم Dipu Number Two للمخرج Morshedul Islam. ورغم الاختلاف في اللغة والجغرافيا، إلا أن العاطفة المشتركة والاهتمام بالبيئة وتفاصيل الصداقة والذاكرة وتجارب النشأة قد تركت أثراً عميقاً في نفسه قبل أن يدرك أن السينما ستكون مهنته.",
    p3: "أخذته سنوات تكوينه بعد ذلك من دكا إلى نوتنغهام في المملكة المتحدة وسايبرجايا في ماليزيا، تلتها سنوات من العيش والعمل عبر دول متعددة. غيّرت تلك المسافات تدريجياً طريقة رؤيته لبنغلاديش؛ فكانت عودته لبلاده تمنحه منظوراً مزدوجاً يجمع بين المنتمي الخبير والمراقب المحايد: عارفاً بتفاصيل الحياة في جنوب آسيا وتناقضاتها، وممتلكاً القدرة على تأملها برؤية تحليليّة. أصبحت هذه الازدواجية ركيزة أساسية في أعماله تجمع بين الحكايات ذات الطابع الثقافي المحلي واللغة البصرية العالمية.",
    p4: "عُرضت أعماله في أكثر من 55 مهرجاناً سينمائياً عبر 15 دولة وحصدت 19 جائزة. تولى إيجاز إدارة التصوير لفيلم MOSHARI للمخرج نوهاد همايون، والذي أنتجه تنفيذياً شركة Monkeypaw Productions للمخرج جوردان بيل وشركة Left Handed Films للفنان ريز أحمد. وحظي الفيلم بتقدير كبير في مهرجانات SXSW ومهرجان ملبورن السينمائي الدولي ومهرجان فانتازيا. كما عمل مديراً للتصوير في فيلم FOREIGNERS ONLY من إنتاج 20th Digital Studio والمُعرض على منصة Hulu، بالإضافة إلى فيلم A Thing About Kashem والفيلم الروائي Moving Bangladesh.",
    p5: "يقيم إيجاز مهدي حالياً ويمارس نشاطه بين مسقط ودكا ومؤخراً مدينة نيويورك.",
    p6: "وفي سلطنة عُمان، إلى جانب عمله كمدير تصوير ومخرج مستقل، يدير أيضاً شركة DUSK وهي وكالة إبداعية وشركة إنتاج متكاملة تُنتج الأفلام الإعلانية والمحتوى البصري الرفيع للعلامات التجارية في عُمان والمنطقة."
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
  const {
    aboutData,
    awards,
    press,
    clients,
    updateAbout,
    updateAward,
    addAward,
    deleteAward,
    updatePress,
    addPress,
    deletePress,
    updateClients
  } = useCMS();
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [awardFilter, setAwardFilter] = useState('all');

  const activeAwards = (awards && awards.length > 0) ? awards : awardsData;
  const activePress = (press && press.length > 0) ? press : pressData;
  const activeClientsList = (clients && clients.length > 0) ? clients : clientsData;

  const [bioLang, setBioLang] = useState('en');

  // Photo Slideshow Loop timer when hovering over Bangladesh or Oman
  useEffect(() => {
    setSlideIndex(0);
    if (!hoveredKeyword) return;
    const images = portraitHoverPhotos[hoveredKeyword];
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 2200);

    return () => clearInterval(timer);
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

  const renderInteractiveText = (text, renderedMaps = new Set()) => {
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

              const shouldShowMap = cfg.isMap && !renderedMaps.has(cfg.key);
              if (shouldShowMap) {
                renderedMaps.add(cfg.key);
              }

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
                  {shouldShowMap && (
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

  // Extract unique film titles dynamically from active awards
  const awardCategories = React.useMemo(() => {
    const films = new Set();
    activeAwards.forEach((item) => {
      if (item.film && item.film.trim()) {
        films.add(item.film.trim().toUpperCase());
      }
    });
    return Array.from(films);
  }, [activeAwards]);

  const filteredAwards = activeAwards.filter((item) => {
    if (awardFilter === 'all') return true;
    if (!item.film) return false;
    const filmUpper = item.film.trim().toUpperCase();
    const filterUpper = awardFilter.trim().toUpperCase();
    return filmUpper === filterUpper || filmUpper.includes(filterUpper);
  });

  const activeHoverImages = hoveredKeyword && portraitHoverPhotos[hoveredKeyword] ? portraitHoverPhotos[hoveredKeyword] : null;
  const currentHoverPhoto = activeHoverImages ? activeHoverImages[slideIndex % activeHoverImages.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen text-[var(--about-ink)] font-medium pt-2 pb-24 px-4 sm:px-8 md:px-12 font-sans select-none w-full space-y-12 md:space-y-16"
    >
      
      {/* TOP SECTION: BIOGRAPHY + PORTRAIT & DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch pb-12 md:pb-16">
        
        {/* Left Side: Photo Container — uncropped natural size, positioned slightly lower for natural alignment */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center self-center my-auto min-h-[500px] pt-4 lg:pt-14">
          <div className="w-full relative group flex items-center justify-center my-auto">
            <AnimatePresence mode="wait">
              {!currentHoverPhoto ? (
                <motion.img
                  key="ejaz-portrait"
                  src={ejazPortrait}
                  alt="Ejaz Mehedi"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full h-auto object-contain filter brightness-95 contrast-105"
                />
              ) : (
                <motion.img
                  key={`${hoveredKeyword}-${currentHoverPhoto}`}
                  src={currentHoverPhoto}
                  alt={hoveredKeyword || 'Bio detail'}
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full h-auto max-h-[750px] object-contain"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Biography & Character Script Language Switcher */}
        <div className="lg:col-span-7 space-y-6 pt-1">
          
          {/* Biography Header with Character Script Language Selector [ A | অ | ع ] — HIDDEN FOR NOW */}
          {/* 
          <div className="flex items-center justify-end pb-3">
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
          */}

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
              {(() => {
                const renderedMaps = new Set();
                return Object.keys(currentBio).map((key) => (
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
                        ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] text-[var(--about-ink)] p-2.5 rounded cursor-text hover:bg-[var(--about-ink-20)] focus:bg-[var(--about-paper)] transition-all'
                        : ''
                    }`}
                  >
                    {isEditMode ? currentBio[key] : renderInteractiveText(currentBio[key], renderedMaps)}
                  </motion.p>
                ));
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Contact Info at bottom of biography */}
          <div className="pt-8 space-y-5 text-sm font-mono-custom">
            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">INSTAGRAM</div>
              <a
                href={aboutData.instagram || "https://www.instagram.com/ejazmehedi"}
                target="_blank"
                rel="noreferrer"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => isEditMode && updateAbout({ instagram: e.target.innerText.trim() })}
                className={`text-[var(--about-ink)] hover:opacity-70 transition-opacity block ${
                  isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
                }`}
              >
                {aboutData.instagram || "https://www.instagram.com/ejazmehedi"}
              </a>
            </div>
            
            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">PERSONAL EMAIL</div>
              <a
                href={`mailto:${aboutData.email || "ejazmeh.work@gmail.com"}`}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => isEditMode && updateAbout({ email: e.target.innerText.trim() })}
                className={`text-[var(--about-ink)] hover:opacity-70 transition-opacity block ${
                  isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
                }`}
              >
                {aboutData.email || "ejazmeh.work@gmail.com"}
              </a>
            </div>

            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">VIMEO</div>
              <a
                href={aboutData.vimeo || 'https://vimeo.com/ejazmehedi'}
                target="_blank"
                rel="noreferrer"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => isEditMode && updateAbout({ vimeo: e.target.innerText.trim() })}
                className={`text-[var(--about-ink)] hover:opacity-70 transition-opacity block ${
                  isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
                }`}
              >
                {aboutData.vimeo || 'https://vimeo.com/ejazmehedi'}
              </a>
            </div>

            <div className="space-y-0.5">
              <div className="text-[var(--about-ink)] uppercase tracking-widest text-xs font-semibold">IMDb:</div>
              <a
                href={aboutData.imdb || 'https://www.imdb.com/name/nm13341457/'}
                target="_blank"
                rel="noreferrer"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => isEditMode && updateAbout({ imdb: e.target.innerText.trim() })}
                className={`text-[var(--about-ink)] hover:opacity-70 transition-opacity block ${
                  isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
                }`}
              >
                {aboutData.imdb || 'https://www.imdb.com/name/nm13341457/'}
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* FULL TABULAR AWARDS & HONORS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <h2
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditMode) return;
                const cleaned = e.target.innerText.replace(/\s*\(\d+\)$/, '').trim();
                updateAbout({ awardsSectionTitle: cleaned });
              }}
              className={`text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink)] ${
                isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
              }`}
            >
              {aboutData?.awardsSectionTitle || 'AWARDS & FESTIVAL EXHIBITIONS'} ({filteredAwards.length})
            </h2>
            {isEditMode && (
              <button
                onClick={() => addAward({ organization: "NEW FESTIVAL", date: "2026", title: "BEST CINEMATOGRAPHY", film: "NEW FILM" })}
                className="px-2.5 py-1 bg-[var(--about-ink)] text-[var(--about-bg)] font-mono-custom text-[10px] font-bold uppercase rounded hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Add Award
              </button>
            )}
          </div>

          {/* Dynamic Film Categories Filter Bar — Auto-adjusts as awards are added/edited */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-2 gap-y-1.5 text-xs font-mono-custom uppercase tracking-widest max-w-full">
            <button
              onClick={() => setAwardFilter('all')}
              className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                awardFilter === 'all' ? 'text-[var(--about-ink)] underline underline-offset-4 font-bold' : 'opacity-70 text-[var(--about-ink)] hover:opacity-100'
              }`}
            >
              ALL
            </button>
            {awardCategories.map((catName) => (
              <React.Fragment key={catName}>
                <span className="opacity-40 text-[var(--about-ink)] text-[10px]">/</span>
                <button
                  onClick={() => setAwardFilter(catName)}
                  className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                    awardFilter.toUpperCase() === catName.toUpperCase() ? 'text-[var(--about-ink)] underline underline-offset-4 font-bold' : 'opacity-70 text-[var(--about-ink)] hover:opacity-100'
                  }`}
                >
                  {catName}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Continuous Inline Awards Block — Styled Exactly Like Press Section */}
        <div className="text-sm sm:text-base md:text-lg font-sans font-normal leading-relaxed sm:leading-loose text-[var(--about-ink)] tracking-normal border-t border-[var(--about-ink)]/20 pt-4">
          {filteredAwards.map((award, idx) => (
            <React.Fragment key={award.id}>
              <span className="inline group/item">
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditMode && updateAward(award.id, { organization: e.target.innerText.trim() })}
                  className={`font-bold ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                >
                  {award.organization}
                </span>
                <span className="opacity-60 px-1.5">—</span>
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditMode && updateAward(award.id, { title: e.target.innerText.trim() })}
                  className={`font-normal ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                >
                  {award.title}
                </span>
                {award.film && (
                  <span className="opacity-70 ml-1">
                    (
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => isEditMode && updateAward(award.id, { film: e.target.innerText.trim() })}
                      className={`${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                    >
                      {award.film}
                    </span>
                    )
                  </span>
                )}
                {award.date && (
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => isEditMode && updateAward(award.id, { date: e.target.innerText.trim() })}
                    className={`opacity-60 ml-1 ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                  >
                    ({award.date})
                  </span>
                )}
                {isEditMode && (
                  <button
                    onClick={() => deleteAward(award.id)}
                    className="text-red-700 hover:text-red-900 bg-red-500/20 px-1 py-0.2 rounded text-[10px] ml-1 cursor-pointer font-bold inline"
                    title="Delete Award"
                  >
                    ×
                  </button>
                )}
              </span>
              {idx < filteredAwards.length - 1 && (
                <span className="opacity-40 px-2 font-sans font-light">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PRESS & INTERVIEWS ARCHIVE */}
      <div className="space-y-6 pb-12 md:pb-16">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <h2
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditMode) return;
                const cleaned = e.target.innerText.replace(/\s*\(\d+\)$/, '').trim();
                updateAbout({ pressSectionTitle: cleaned });
              }}
              className={`text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink)] ${
                isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
              }`}
            >
              {aboutData?.pressSectionTitle || 'PRESS & INTERVIEWS'} ({activePress.length})
            </h2>
            {isEditMode && (
              <button
                onClick={() => addPress({ publisher: "PRESS OUTLET", date: "2026", title: "NEW INTERVIEW FEATURE", link: "https://example.com" })}
                className="px-2.5 py-1 bg-[var(--about-ink)] text-[var(--about-bg)] font-mono-custom text-[10px] font-bold uppercase rounded hover:opacity-90 cursor-pointer shadow-sm"
              >
                + Add Press Item
              </button>
            )}
          </div>
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => isEditMode && updateAbout({ globalCoverageBadgeText: e.target.innerText.trim() })}
            className={`text-[10px] font-mono-custom text-[var(--about-ink)] uppercase ${
              isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
            }`}
          >
            {aboutData?.globalCoverageBadgeText || 'GLOBAL COVERAGE'}
          </span>
        </div>

        {/* Continuous Inline Press / Media Block — CAPS LOCK Outlet Names */}
        <div className="text-sm sm:text-base md:text-lg font-sans font-normal leading-relaxed sm:leading-loose text-[var(--about-ink)] tracking-normal border-t border-[var(--about-ink)]/20 pt-4">
          {activePress.map((item, idx) => (
            <React.Fragment key={item.id}>
              <span className="inline group/item">
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditMode && updatePress(item.id, { publisher: e.target.innerText.trim() })}
                  className={`uppercase font-bold tracking-wider ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                >
                  {item.publisher}
                </span>
                <span className="opacity-60 px-1.5">—</span>
                {item.link && !isEditMode ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline items-center gap-1 hover:underline text-[var(--about-ink)] underline-offset-2"
                  >
                    <span>{item.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-60 group-hover/item:opacity-100 shrink-0 inline ml-0.5" />
                  </a>
                ) : (
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => isEditMode && updatePress(item.id, { title: e.target.innerText.trim() })}
                    className={`font-normal ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                  >
                    {item.title}
                  </span>
                )}
                {item.date && (
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => isEditMode && updatePress(item.id, { date: e.target.innerText.trim() })}
                    className={`opacity-60 ml-1 ${isEditMode ? 'outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-1 rounded cursor-text' : ''}`}
                  >
                    ({item.date})
                  </span>
                )}
                {isEditMode && (
                  <span className="inline items-center gap-1 ml-1 text-xs">
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => isEditMode && updatePress(item.id, { link: e.target.innerText.trim() })}
                      className="outline-dashed outline-1 outline-[var(--about-ink)]/70 bg-[var(--about-paper)] text-[var(--about-ink)] px-1 py-0.5 rounded cursor-text text-[10px]"
                    >
                      {item.link || 'url'}
                    </span>
                    <button
                      onClick={() => deletePress(item.id)}
                      className="text-red-700 hover:text-red-900 bg-red-500/20 px-1 py-0.2 rounded text-[10px] cursor-pointer font-bold inline"
                      title="Delete Press Item"
                    >
                      ×
                    </button>
                  </span>
                )}
              </span>
              {idx < activePress.length - 1 && (
                <span className="opacity-40 px-2 font-sans font-light">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* SELECTED CLIENTS */}
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between pb-3">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditMode) return;
              const cleaned = e.target.innerText.replace(/\s*\(\d+\)$/, '').trim();
              updateAbout({ clientsSectionTitle: cleaned });
            }}
            className={`text-xs font-mono-custom tracking-[0.25em] uppercase text-[var(--about-ink-80)] ${
              isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)]' : ''
            }`}
          >
            {aboutData?.clientsSectionTitle || 'SELECTED CLIENTS & BRANDED PARTNERS'} ({activeClientsList.length})
          </h2>
          {isEditMode && (
            <button
              onClick={() => updateClients([...activeClientsList, "NEW CLIENT"])}
              className="px-2.5 py-1 bg-[var(--about-ink)] text-[var(--about-bg)] font-mono-custom text-[10px] font-bold uppercase rounded hover:opacity-90 cursor-pointer shadow-sm"
            >
              + Add Client
            </button>
          )}
        </div>

        {/* Continuous Inline Clients Block — Background Shapes Removed */}
        <div className="text-sm sm:text-base md:text-lg font-sans font-normal leading-relaxed sm:leading-loose text-[var(--about-ink)] tracking-normal border-t border-[var(--about-ink)]/20 pt-4">
          {activeClientsList.map((client, idx) => (
            <React.Fragment key={idx}>
              <span className="inline font-bold">
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditMode) return;
                    const updated = [...activeClientsList];
                    updated[idx] = e.target.innerText.trim();
                    updateClients(updated);
                  }}
                  className={`${isEditMode ? 'outline-dashed outline-2 outline-[var(--about-ink)]/70 bg-[var(--about-ink-10)] px-2 py-1 rounded cursor-text focus:bg-[var(--about-paper)] font-bold' : ''}`}
                >
                  {client}
                </span>
                {isEditMode && (
                  <button
                    onClick={() => {
                      const updated = activeClientsList.filter((_, i) => i !== idx);
                      updateClients(updated);
                    }}
                    className="text-red-700 hover:text-red-900 bg-red-500/20 px-1 py-0.2 rounded text-[10px] ml-1 cursor-pointer font-bold inline"
                    title="Delete Client"
                  >
                    ×
                  </button>
                )}
              </span>
              {idx < activeClientsList.length - 1 && (
                <span className="opacity-40 px-2 font-sans font-light">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
