import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const names = [
  { 
    id: 'en', 
    text: "EJAZ MEHEDI", 
    fontClass: "font-display-heavy tracking-tighter font-black text-[clamp(2.2rem,8.6vw,13.5rem)] leading-none" 
  },
  { 
    id: 'bn', 
    text: "এজাজ মেহেদী", 
    fontClass: "font-sans tracking-normal font-black text-[clamp(2.0rem,7.2vw,10.5rem)] leading-none" 
  },
  { 
    id: 'ar', 
    text: "إعزاز مهدي", 
    fontClass: "font-sans tracking-normal font-black text-[clamp(2.0rem,7.2vw,10.5rem)] leading-none" 
  }
];

function getGraphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return text.split('');
}

const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.045 }
  },
  exit: {
    transition: { staggerChildren: 0.025, staggerDirection: 1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] }
  }
};

export const SmoothHeaderName = ({ onClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % names.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const current = names[index];
  const items = current.id === 'ar' 
    ? current.text.split(' ') 
    : getGraphemes(current.text);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center h-[5.2rem] sm:h-[7.2rem] md:h-[9.5rem] lg:h-[11.8rem] focus:outline-none cursor-pointer select-none group w-full overflow-hidden"
      aria-label="Ejaz Mehedi Home"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`text-ink uppercase group-hover:text-ink-soft transition-colors whitespace-nowrap w-full text-center flex items-center justify-center h-full ${current.fontClass}`}
        >
          {items.map((item, itemIdx) => (
            <motion.span
              key={`${index}-${itemIdx}`}
              variants={itemVariants}
              className="inline-block transform-gpu"
            >
              {current.id === 'ar'
                ? itemIdx === items.length - 1 ? item : item + '\u00A0'
                : item === ' ' ? '\u00A0' : item}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
