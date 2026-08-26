import React, { useEffect, useRef } from 'react';

/**
 * Oversized display word that bleeds past the viewport edges and is cropped by
 * the bottom of the page. Letters dip down and spring back as the pointer
 * sweeps past — no hover required.
 */
export const MegaName = ({
  text = 'EJAZ MEHEDI',
  isLime,
  tiltAngle = 24,     // 👈 Tilt angle in degrees (lower number = stands up more, higher = tilts back more)
  perspective = 650,  // 👈 3D perspective depth in px (higher number = subtle depth, lower = steep depth)
}) => {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!stage || !wrap) return;

    const spans = Array.from(wrap.querySelectorAll('[data-letter]'));

    const measure = () => {
      const stageBox = stage.getBoundingClientRect();
      lettersRef.current = spans.map((el) => {
        const box = el.getBoundingClientRect();
        const prev = lettersRef.current.find((l) => l.el === el);
        return {
          el,
          x: box.left - stageBox.left + box.width / 2,
          dip: prev?.dip ?? 0,
          vel: prev?.vel ?? 0,
          target: 0,
        };
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    let raf = 0;
    let pointerX = null;
    let isRunning = false;

    const startTick = () => {
      if (!isRunning) {
        isRunning = true;
        tick();
      }
    };

    const onMove = (e) => {
      const box = stage.getBoundingClientRect();
      const withinBand = e.clientY > box.top - 350 && e.clientY < box.bottom + 350;
      pointerX = withinBand ? e.clientX - box.left : null;
      if (pointerX !== null) startTick();
    };
    const onLeave = () => {
      pointerX = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    const tick = () => {
      let active = false;
      const radius = Math.max(160, stage.offsetWidth * 0.14);
      for (const l of lettersRef.current) {
        if (pointerX === null) {
          l.target = 0;
        } else {
          const d = Math.abs(pointerX - l.x);
          const f = Math.max(0, 1 - d / radius);
          l.target = f * f * (3 - 2 * f);
        }
        // smooth critically-damped ease
        l.dip += (l.target - l.dip) * (l.target > l.dip ? 0.18 : 0.08);

        if (Math.abs(l.dip) > 0.0005 || l.target > 0) {
          active = true;
        }

        const y = l.dip * 48;
        const scale = 1 - l.dip * 0.16;
        l.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      }

      if (active || pointerX !== null) {
        raf = requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [text]);

  const textColor = isLime ? 'text-[var(--about-ink)]' : 'text-ink';

  const chars = text.split('');
  const total = chars.length;
  const centerIdx = (total - 1) / 2;

  return (
    <div
      ref={stageRef}
      className="w-full relative flex justify-center items-end overflow-hidden pb-1 pt-4 px-0"
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 100%',
      }}
    >
      <div
        ref={wrapRef}
        className="flex w-full select-none items-end justify-between whitespace-nowrap px-1 sm:px-2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltAngle}deg)`,
          transformOrigin: 'bottom center',
        }}
        aria-label={text}
      >
        {chars.map((c, i) => {
          const normalizedDist = Math.abs(i - centerIdx) / centerIdx; // 0 at center, 1 at ends
          const curveFactor = Math.pow(normalizedDist, 1.5);
          
          const fontSizeVw = 28.5 + 10.5 * curveFactor;
          const fontSizeRem = 29.5 + 11 * curveFactor;
          const translateYVw = 6.2 * (1 - curveFactor);
          const rotateDeg = (centerIdx - i) * 1.2;

          return (
            <span
              key={`${c}-${i}`}
              data-letter="true"
              className="inline-block origin-bottom will-change-transform flex-shrink-0"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <span
                className={`block font-mega font-black leading-[0.70] tracking-[0.005em] ${textColor}`}
                style={{
                  fontSize: `min(${fontSizeVw.toFixed(3)}vw, ${fontSizeRem.toFixed(3)}rem)`,
                  transform: `translateY(${translateYVw.toFixed(5)}vw) rotate(${rotateDeg.toFixed(1)}deg)`,
                }}
              >
                {c === ' ' ? <span className="inline-block w-[3.5vw] min-w-[1.5rem]" /> : c}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};