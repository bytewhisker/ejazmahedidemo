import React from 'react';
import { motion } from 'framer-motion';

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

export const SmoothHeaderName = ({ onClick, isLime = false }) => {
  const lines = ["EJAZ", "MEHEDI"];

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-start justify-start h-auto py-1 focus:outline-none cursor-pointer select-none group overflow-visible text-left"
      aria-label="Ejaz Mehedi Home"
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`uppercase transition-colors flex flex-col items-start text-left font-mega font-extrabold leading-[0.80] text-[clamp(2.8rem,9vw,9.5rem)] tracking-[0.015em] ${
          isLime ? 'text-[var(--about-ink)] group-hover:text-[var(--about-ink-80)]' : 'text-ink group-hover:text-ink-soft'
        }`}
      >
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex items-center">
            {line.split('').map((char, charIdx) => (
              <motion.span
                key={`${lineIdx}-${charIdx}`}
                variants={itemVariants}
                className="inline-block transform-gpu"
              >
                {char}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.div>
    </button>
  );
};
