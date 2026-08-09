import React, { useState, useEffect } from 'react';

const names = [
  "EJAZ MEHEDI",
  "এজাজ মেহেদী",
  "إعزاز مهدي"
];

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/XØÆµ§0123456789";

export const GlitchHeaderName = ({ onClick }) => {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayText, setDisplayText] = useState(names[0]);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (nameIndex + 1) % names.length;
      triggerGlitchAnimation(names[nextIndex], () => {
        setNameIndex(nextIndex);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [nameIndex]);

  const triggerGlitchAnimation = (targetText, onComplete) => {
    setIsGlitching(true);
    let iteration = 0;
    const maxIterations = targetText.length * 3;

    const glitchInterval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return targetText[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(glitchInterval);
        setDisplayText(targetText);
        setIsGlitching(false);
        if (onComplete) onComplete();
      }
    }, 30);
  };

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none cursor-pointer px-4 py-1 group select-none"
      aria-label="Ejaz Mehedi Home"
    >
      <span
        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white uppercase tracking-[0.2em] transition-all duration-200 ${
          isGlitching ? 'text-amber-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'group-hover:text-neutral-300'
        }`}
      >
        {displayText}
      </span>
    </button>
  );
};
