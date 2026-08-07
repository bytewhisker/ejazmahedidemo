import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const names = [
  { id: 'en', text: "EZAZ MAHEDI", fontClass: "tracking-[0.08em] font-light font-serif" },
  { id: 'bn', text: "এজাজ মেহেদী", fontClass: "tracking-[0.04em] font-normal font-sans" },
  { id: 'ar', text: "إعزاز مهدي", fontClass: "tracking-[0.06em] font-normal font-sans" }
];

// Helper to safely segment characters/graphemes for all languages without breaking complex script ligatures
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
    transition: {
      staggerChildren: 0.055, // Slight delay for each character coming up
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
    },
  },
};

const charVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

export const SmoothHeaderName = ({ onClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % names.length);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  const current = names[index];
  const graphemes = getGraphemes(current.text);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none cursor-pointer py-1 md:py-2 select-none group min-h-[3rem] sm:min-h-[4rem]"
      aria-label="Ezaz Mahedi Home"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`flex items-center justify-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase group-hover:text-neutral-300 transition-colors ${current.fontClass}`}
        >
          {graphemes.map((char, charIdx) => (
            <motion.span
              key={`${index}-${charIdx}`}
              variants={charVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
