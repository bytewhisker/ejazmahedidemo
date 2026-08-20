import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const journalCopy = {
  en: {
    label: "JOURNAL",
    title: "Notes from the Set & Beyond",
    body: "Journal entries are coming soon — dispatches from the set, behind-the-scenes stories, and field notes on cinematography."
  },
  bn: {
    label: "জার্নাল",
    title: "সেট থেকে ও তার বাইরের নোট",
    body: "জার্নাল আর্টিকেল শীঘ্রই আসছে — সেটের অভিজ্ঞতা, দৃশ্যের অন্তরালের গল্প এবং চিত্রগ্রহণ নিয়ে ফিল্ড নোট।"
  },
  ar: {
    label: "مجلة",
    title: "ملاحظات من موقع التصوير وما بعده",
    body: "قريباً ستصدر مقالات المجلة — قصص من كواليس التصوير وملاحظات ميدانية حول فن التصوير السينمائي."
  }
};

export const JournalPage = () => {
  const { lang } = useLanguage();
  const copy = journalCopy[lang] || journalCopy.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen pt-2 pb-24 px-4 sm:px-6 lg:px-8 font-sans select-none max-w-[1700px] mx-auto"
    >
      <div className="flex flex-col items-start justify-center min-h-[60vh] space-y-6">
        <span className="text-[10px] font-mono-custom tracking-[0.25em] uppercase text-muted font-bold">
          {copy.label}
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-ink-soft font-medium max-w-xl">
          {copy.body}
        </p>
      </div>
    </motion.div>
  );
};