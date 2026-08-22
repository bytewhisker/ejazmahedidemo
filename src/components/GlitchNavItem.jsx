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
  const phaseTimeoutRef = useRef(null);
  const startDelayRef = useRef(null);
  const hoveredRef = useRef(false);
  const currentTextRef = useRef(enText);

  // Sync button text with state
  const updateText = (newText) => {
    currentTextRef.current = newText;
    setDisplayText(newText);
  };

  const stopAllTimers = () => {
    if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (startDelayRef.current) clearTimeout(startDelayRef.current);
  };

  const triggerGlitch = (targetText, onComplete) => {
    if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
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

  // One language cycle per hover: EN -> BN -> wait -> AR -> wait -> back to EN.
  // The cycle always ends back on English, it never re-triggers itself.
  const runLanguageCycle = () => {
    triggerGlitch(bnText, () => {
      phaseTimeoutRef.current = setTimeout(() => {
        triggerGlitch(arText, () => {
          phaseTimeoutRef.current = setTimeout(() => {
            triggerGlitch(enText);
          }, 2500);
        });
      }, 2500);
    });
  };

  const handleMouseEnter = () => {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    setIsHovered(true);
    // Stay on English for 800ms before starting the cycle
    startDelayRef.current = setTimeout(() => {
      if (hoveredRef.current) runLanguageCycle();
    }, 800);
  };

  const handleMouseLeave = () => {
    hoveredRef.current = false;
    setIsHovered(false);
    stopAllTimers();
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
      data-cursor="hover"
      className={`inline-block w-fit self-start text-left transition-colors py-0.5 select-none ${
        className ? className : (isActive ? 'text-ink font-bold tracking-[0.22em]' : isHovered ? 'text-ink' : 'text-muted hover:text-ink')
      }`}
    >
      <span className={`relative inline-block transition-opacity duration-150 ${isGlitching ? 'opacity-90 font-mono text-accent' : ''}`}>
        <span aria-hidden="true" className="invisible whitespace-nowrap">{enText}</span>
        <span aria-hidden="true" className="invisible absolute inset-0 flex items-center justify-center whitespace-nowrap">{bnText}</span>
        <span aria-hidden="true" className="invisible absolute inset-0 flex items-center justify-center whitespace-nowrap">{arText}</span>
        <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap">{displayText}</span>
      </span>
    </button>
  );
};
