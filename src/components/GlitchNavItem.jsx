import React, { useState, useEffect, useRef } from 'react';

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/XØÆµ§0123456789";

function getGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export const GlitchNavItem = ({
  enText,
  bnText,
  arText,
  onClick,
  isActive,
  className = ""
}) => {
  const [displayText, setDisplayText] = useState(enText);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const glitchIntervalRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const currentLangRef = useRef('en');
  const currentTextRef = useRef(enText);

  // Sync currentTextRef with state
  const updateText = (newText) => {
    currentTextRef.current = newText;
    setDisplayText(newText);
  };

  const stopAllTimers = () => {
    if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
  };

  const triggerGlitch = (targetText, onComplete) => {
    stopAllTimers();
    setIsGlitching(true);

    const startText = currentTextRef.current;
    const startGraphemes = getGraphemes(startText);
    const targetGraphemes = getGraphemes(targetText);

    const startLen = startGraphemes.length;
    const targetLen = targetGraphemes.length;
    const maxIterations = Math.max(targetLen * 2, 12);

    let iteration = 0;

    glitchIntervalRef.current = setInterval(() => {
      iteration++;
      const progress = iteration / maxIterations;
      const currentLength = Math.round(startLen + (targetLen - startLen) * progress);
      const revealedCount = Math.floor(progress * targetLen);

      let result = [];
      for (let idx = 0; idx < currentLength; idx++) {
        if (targetGraphemes[idx] === ' ') {
          result.push(' ');
        } else if (idx < revealedCount && idx < targetLen) {
          result.push(targetGraphemes[idx]);
        } else {
          const randChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          result.push(randChar);
        }
      }

      const scrambled = result.join('');
      updateText(scrambled);

      if (iteration >= maxIterations) {
        if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
        updateText(targetText);
        setIsGlitching(false);
        if (onComplete) onComplete();
      }
    }, 28);
  };

  // Start sequence: EN -> BN (glitch) -> wait 2.5s -> AR (glitch) -> wait 2.5s -> BN (glitch)...
  const cycleArabicPhase = () => {
    currentLangRef.current = 'ar';
    triggerGlitch(arText, () => {
      cycleTimeoutRef.current = setTimeout(() => {
        cycleBanglaPhase();
      }, 2500);
    });
  };

  const cycleBanglaPhase = () => {
    currentLangRef.current = 'bn';
    triggerGlitch(bnText, () => {
      cycleTimeoutRef.current = setTimeout(() => {
        cycleArabicPhase();
      }, 2500);
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    cycleBanglaPhase();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopAllTimers();
    currentLangRef.current = 'en';
    triggerGlitch(enText, () => {
      updateText(enText);
    });
  };

  useEffect(() => {
    return () => {
      stopAllTimers();
    };
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block w-fit self-start text-left transition-colors py-0.5 select-none ${
        className ? className : (isActive ? 'text-ink font-bold tracking-[0.22em]' : isHovered ? 'text-ink' : 'text-muted hover:text-ink')
      }`}
    >
      <span className={`inline-block transition-opacity duration-150 ${isGlitching ? 'opacity-90 font-mono text-amber-400 dark:text-amber-300' : ''}`}>
        {displayText}
      </span>
    </button>
  );
};
