import React, { useState } from 'react';
import { awardsData, pressData, clientsData } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ejazPortrait from '../assets/ejaz-portrait.webp';
import omanMap from '../assets/oman-outline.png';
import bangladeshMap from '../assets/bangladesh-outline.png';
import bangladeshView from '../assets/bangladesh-view.webp';
import omanView from '../assets/oman-view.webp';

const PERSONAL_EMAIL = 'contact@ejazmehedi.com';
const INSTAGRAM_URL = 'https://instagram.com/ejazmehedi';

const keywordImages = {
  oman: omanMap,
  bangladesh: bangladeshMap,
  southasia: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Map_of_South_Asia.png/960px-Map_of_South_Asia.png"
};

// Real photos shown in the portrait frame on hover
const portraitHoverPhotos = {
  oman: [omanView],
  bangladesh: [bangladeshView],
};

const bioTextData = {
  en: {
    p1: "Ejaz Mehedi is a Bangladeshi cinematographer and filmmaker whose visual perspective has been shaped by both an intimacy with home and long periods spent away from it. He grew up in Dhaka, where some of his earliest memories of cinema came through films such as Rob Reiner's Stand By Me and Morshedul Islam's Dipu Number Two. Different in language and geography but similar in their emotional attention to landscapes, friendship, memory, growing up and trauma, both films stayed with him long before he understood filmmaking as a profession.",
    p2: "His formative years later took him from Dhaka to Nottingham in the United Kingdom and Cyberjaya in Malaysia, followed by years of living and working across different countries. Distance gradually changed the way he looked at Bangladesh. Returning home after long stretches abroad gave him the perspective of both an insider and an outsider: deeply familiar with the rhythms and contradictions of South Asian life, yet able to observe them with a certain separation. That duality has become central to his work, combining culturally specific stories with a broader international visual language.",
    p3: "His work has since screened at more than 55 film festivals across 15 countries and received 19 awards. He photographed Nuhash Humayun's MOSHARI, executive produced by Jordan Peele's Monkeypaw Productions and Riz Ahmed's Left Handed Films. The film became the first Bangladeshi short to qualify for the Academy Awards and received major recognition at SXSW, the Melbourne International Film Festival and Fantasia. He also served as Director of Photography on FOREIGNERS ONLY, produced for 20th Digital Studio and released on Hulu, as well as A Thing About Kashem and the feature film Moving Bangladesh.",
    p4: "Alongside film, Ejaz has directed and photographed commercial and branded work for clients including BBC StoryWorks, The Economist, Vodafone, Yamaha, Uber, UNICEF and organisations across the Gulf. He is currently based between Muscat, Dhaka and, more recently, New York City. In Oman, he also runs DUSK, a hybrid creative agency and production company producing premium brand films, commercials and branded content for clients across Oman and the wider region."
  },
  bn: {
    p1: "এজাজ মেহেদী একজন বাংলাদেশি চিত্রগ্রাহক (Cinematographer) ও চলচ্চিত্র নির্মাতা, যার ভিজ্যুয়াল দৃষ্টিভঙ্গি গড়ে উঠেছে নিজের দেশকে খুব কাছ থেকে দেখা এবং দীর্ঘ সময় দেশ থেকে দূরে থাকার অভিজ্ঞতার মধ্য দিয়ে। তিনি ঢাকায় বেড়ে উঠেছেন। চলচ্চিত্রের প্রতি তাঁর আগ্রহের শুরু হয়েছিল শৈশবে, যখন তিনি রব রাইনারের Stand By Me এবং মোরশেদুল ইসলামের দীপু নাম্বার টু দেখেন। ভাষা ও ভৌগোলিক প্রেক্ষাপট ভিন্ন হলেও বন্ধুত্ব, স্মৃতি, বেড়ে ওঠা, ট্রমা এবং পরিবেশকে ঘিরে মানবিক গল্প বলার ক্ষেত্রে দুটি চলচ্চিত্রের মধ্যে যে আবেগময় সাদৃশ্য ছিল, তা তাঁকে গভীরভাবে প্রভাবিত করে। অনেক আগে থেকেই এই চলচ্চিত্রগুলো তাঁর মনে স্থায়ী ছাপ ফেলে, যখন তিনি এখনও চলচ্চিত্র নির্মাণকে পেশা হিসেবে ভাবেননি।",
    p2: "পরবর্তীতে তাঁর শিক্ষাজীবন ও কর্মজীবন তাঁকে ঢাকা থেকে যুক্তরাজ্যের নটিংহ্যাম এবং মালয়েশিয়ার সাইবারজায়ায় নিয়ে যায়। এরপর তিনি বিভিন্ন দেশে বসবাস ও কাজ করেন। দীর্ঘ সময় বিদেশে থাকার ফলে বাংলাদেশের প্রতি তাঁর দৃষ্টিভঙ্গি বদলে যায়। দীর্ঘ বিরতির পর দেশে ফিরে আসা তাঁকে একই সঙ্গে একজন অন্তর্দৃষ্টিসম্পন্ন স্থানীয় এবং একজন পর্যবেক্ষণশীল বহিরাগত হিসেবে দেখার সুযোগ দেয়। দক্ষিণ এশিয়ার জীবনযাত্রার ছন্দ, বৈপরীত্য ও সাংস্কৃতিক বাস্তবতার সঙ্গে গভীর পরিচিতি থাকার পাশাপাশি তিনি সেগুলোকে একটি নিরপেক্ষ দূরত্ব থেকেও পর্যবেক্ষণ করতে সক্ষম হন। এই দ্বৈত অভিজ্ঞতাই তাঁর কাজের অন্যতম বৈশিষ্ট্য, যেখানে স্থানীয় সাংস্কৃতিক গল্প আন্তর্জাতিক ভিজ্যুয়াল ভাষার সঙ্গে মিশে যায়।",
    p3: "এ পর্যন্ত তাঁর কাজ ১৫টি দেশের ৫৫টিরও বেশি চলচ্চিত্র উৎসবে প্রদর্শিত হয়েছে এবং ১৯টি পুরস্কার অর্জন করেছে। তিনি নুহাশ হুমায়ূনের MOSHARI চলচ্চিত্রের চিত্রগ্রাহক ছিলেন, যা জর্ডান পিলের Monkeypaw Productions এবং রিজ আহমেদের Left Handed Films–এর নির্বাহী প্রযোজনায় নির্মিত হয়। চলচ্চিত্রটি একাডেমি অ্যাওয়ার্ডসের জন্য যোগ্যতা অর্জনকারী প্রথম বাংলাদেশি স্বল্পদৈর্ঘ্য চলচ্চিত্র হিসেবে ইতিহাস সৃষ্টি করে এবং SXSW, Melbourne International Film Festival ও Fantasia–তে উল্লেখযোগ্য স্বীকৃতি লাভ করে।",
    p4: "এজাজ FOREIGNERS ONLY চলচ্চিত্রের পরিচালক অব ফটোগ্রাফি (Director of Photography) হিসেবেও কাজ করেছেন, যা 20th Digital Studio-এর জন্য নির্মিত এবং Hulu-তে মুক্তি পেয়েছে। এছাড়া তিনি A Thing About Kashem এবং পূর্ণদৈর্ঘ্য চলচ্চিত্র Moving Bangladesh–এর চিত্রগ্রাহক ছিলেন।",
    p5: "চলচ্চিত্রের পাশাপাশি তিনি BBC StoryWorks, The Economist, Vodafone, Yamaha, Uber, UNICEF এবং উপসাগরীয় অঞ্চলের বিভিন্ন প্রতিষ্ঠানের জন্য বাণিজ্যিক ও ব্র্যান্ডেড কনটেন্ট পরিচালনা ও চিত্রগ্রহণ করেছেন।",
    p6: "বর্তমানে তিনি ওমানের মাস্কাট, বাংলাদেশের ঢাকা এবং সাম্প্রতিক সময়ে নিউ ইয়র্ক সিটির মধ্যে সময় ভাগ করে কাজ করছেন। ওমানে তিনি DUSK নামের একটি হাইব্রিড ক্রিয়েটিভ এজেন্সি ও প্রোডাকশন কোম্পানি পরিচালনা করেন, যা ওমান এবং বৃহত্তর অঞ্চলের বিভিন্ন ক্লায়েন্টের জন্য প্রিমিয়াম ব্র্যান্ড ফিল্ম, বিজ্ঞাপনচিত্র এবং ব্র্যান্ডেড কনটেন্ট নির্মাণ করে।"
  },
  ar: {
    p1: "إيجاز مهدي هو مدير تصوير سينمائي وصانع أفلام بنغلاديشي، تشكّلت رؤيته البصرية من خلال ارتباطه العميق بوطنه ومن خلال فترات طويلة قضاها بعيداً عنه. نشأ في مدينة دكا، حيث بدأت علاقته المبكرة بالسينما من خلال أفلام مثل Stand By Me للمخرج روب راينر وDipu Number Two للمخرج مرشد الإسلام. وعلى الرغم من اختلافهما في اللغة والجغرافيا، فقد اشتركا في اهتمامهما بالمشاعر الإنسانية والمناظر الطبيعية والصداقة والذاكرة وتجارب النضج والصدمات النفسية، وهي عناصر تركت أثراً عميقاً في نفسه قبل أن يدرك أن صناعة الأفلام يمكن أن تكون مهنةً له.",
    p2: "لاحقاً انتقل من دكا إلى نوتنغهام في المملكة المتحدة ثم إلى سايبَر جايا في ماليزيا خلال سنواته التكوينية، قبل أن يعيش ويعمل في عدة دول أخرى. ومع مرور الوقت، غيّر البعد الجغرافي طريقته في النظر إلى بنغلاديش. فقد منحته العودة إلى الوطن بعد فترات طويلة من الغياب منظوراً يجمع بين الداخل والخارج؛ فهو على دراية عميقة بإيقاع الحياة في جنوب آسيا وتناقضاتها، وفي الوقت نفسه قادر على تأملها من مسافة نقدية وموضوعية. وقد أصبحت هذه الازدواجية عنصراً محورياً في أعماله، حيث يمزج بين القصص ذات الخصوصية الثقافية المحلية ولغة بصرية ذات طابع عالمي.",
    p3: "عُرضت أعماله في أكثر من 55 مهرجاناً سينمائياً في 15 دولة، وحصدت 19 جائزة. وكان مدير التصوير لفيلم MOSHARI للمخرج نوحاش همايون، والذي تولت إنتاجه التنفيذي شركتا Monkeypaw Productions التابعة لجوردان بيل وLeft Handed Films التابعة لريز أحمد. وقد أصبح الفيلم أول فيلم قصير من بنغلاديش يتأهل لجوائز الأوسكار، كما نال إشادة واسعة في مهرجانات SXSW وMelbourne International Film Festival وFantasia.",
    p4: "كما شغل منصب مدير التصوير (Director of Photography) لفيلم FOREIGNERS ONLY، الذي أُنتج لصالح 20th Digital Studio وعُرض على منصة Hulu، بالإضافة إلى فيلم A Thing About Kashem والفيلم الروائي الطويل Moving Bangladesh.",
    p5: "وبالتوازي مع عمله السينمائي، أخرج وصوّر أعمالاً تجارية ومحتوىً بصرياً للعلامات التجارية لصالح جهات عالمية مثل BBC StoryWorks وThe Economist وVodafone وYamaha وUber وUNICEF، إضافةً إلى عدد من المؤسسات في منطقة الخليج.",
    p6: "يقيم إيجاز مهدي حالياً بين مسقط ودكا، ومؤخراً مدينة نيويورك. كما يدير في سلطنة عُمان شركة DUSK، وهي وكالة إبداعية وشركة إنتاج هجينة متخصصة في إنتاج الأفلام التجارية الراقية والإعلانات والمحتوى المرتبط بالعلامات التجارية لعملاء في عُمان والمنطقة على نطاق أوسع."
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
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
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
      { key: 'oman', match: 'Oman' },
      { key: 'bangladesh', match: 'Bangladesh' }
    ],
    bn: [
      { key: 'oman', match: 'ওমান' },
      { key: 'bangladesh', match: 'বাংলাদেশ' }
    ],
    ar: [
      { key: 'oman', match: 'عُمان' },
      { key: 'bangladesh', match: 'بنغلاديش' }
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
            // Extend the chip to the end of the inflected word so suffixes
            // (e.g. "Bangladeshi", "বাংলাদেশি", "বাংলাদেশের") stay inside it
            let end = idx + kwLower.length;
            while (end < part.length && /[\p{L}\p{M}]/u.test(part[end])) end++;
            nextParts.push(part.slice(cursor, idx));
            nextParts.push(
              <span
                key={`${kw.key}-${count++}`}
                onMouseEnter={() => setHoveredKeyword(kw.key)}
                onMouseLeave={() => setHoveredKeyword(null)}
                onTouchStart={() => setHoveredKeyword(kw.key)}
                onTouchEnd={() => setHoveredKeyword(null)}
                className="cursor-pointer hover:opacity-70 transition-opacity inline-flex items-center gap-0.5 align-baseline font-medium"
                title={kw.key === 'oman' ? 'Oman' : kw.key === 'bangladesh' ? 'Bangladesh' : 'South Asia'}
              >
                {part.slice(idx, end)}
                <img
                  src={keywordImages[kw.key]}
                  alt=""
                  className="inline-block h-6 md:h-7 w-auto opacity-90 pointer-events-none -mb-0.5"
                  draggable={false}
                />
              </span>
            );
            cursor = end;
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
      className="min-h-screen text-[var(--about-ink)] font-medium pt-2 pb-24 px-4 sm:px-8 md:px-12 font-sans select-none max-w-[1700px] mx-auto space-y-12 md:space-y-16"
    >
      
      {/* TOP SECTION: BIOGRAPHY + PORTRAIT & DIRECT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch pb-12 md:pb-16">
        
        {/* Left Side: Photo Frame Container — swaps to demo photo on keyword hover */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="w-full flex-1 min-h-[480px] lg:min-h-0 overflow-hidden bg-[var(--about-ink-10)] border border-[var(--about-border)] relative group shadow-xl">
            <AnimatePresence mode="wait">
              {hoveredKeyword && portraitHoverPhotos[hoveredKeyword] ? (
                <motion.div
                  key={hoveredKeyword}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0"
                >
                  {portraitHoverPhotos[hoveredKeyword].length === 1 ? (
                    <img
                      src={portraitHoverPhotos[hoveredKeyword][0]}
                      alt={hoveredKeyword}
                      draggable={false}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid grid-rows-2 gap-1 p-1 bg-[var(--about-ink-5)]">
                      {portraitHoverPhotos[hoveredKeyword].slice(0, 2).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`${hoveredKeyword} ${i + 1}`}
                          draggable={false}
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </div>
                  )}
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
