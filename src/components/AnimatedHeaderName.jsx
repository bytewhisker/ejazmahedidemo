import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const nameVariants = [
  { text: "EZAZ MAHEDI", fontClass: "tracking-[0.2em] font-normal" },
  { text: "এজাজ মেহেদী", fontClass: "tracking-[0.1em] font-medium" },
  { text: "إعزاز مهدي", fontClass: "tracking-[0.15em] font-medium" }
];

export const AnimatedHeaderName = ({ onClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % nameVariants.length);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const currentVariant = nameVariants[index];

  return (
    <button
      onClick={onClick}
      className="relative h-10 md:h-12 overflow-hidden flex items-center justify-center focus:outline-none group cursor-pointer px-4"
      aria-label="Ejaz Mahedi Home"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-serif uppercase uppercase select-none group-hover:text-neutral-300 transition-colors ${currentVariant.fontClass}`}
        >
          {currentVariant.text}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
