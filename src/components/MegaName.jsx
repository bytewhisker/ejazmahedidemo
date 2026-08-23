import React, { useEffect, useRef } from 'react';

/**
 * Oversized display word that bleeds past the viewport edges and is cropped by
 * the bottom of the page. Letters dip down and spring back as the pointer
 * sweeps past — no hover required.
 */
export const MegaName = ({ text = 'EJAZ MEHEDI', isLime }) => {
  const wrapRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const spans = Array.from(wrap.querySelectorAll('[data-letter]'));

    const measure = () => {
      const wrapBox = wrap.getBoundingClientRect();
      lettersRef.current = spans.map((el) => {
        const box = el.getBoundingClientRect();
        const prev = lettersRef.current.find((l) => l.el === el);
        return {
          el,
          x: box.left - wrapBox.left + box.width / 2,
          dip: prev?.dip ?? 0,
          vel: prev?.vel ?? 0,
          target: 0,
        };
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

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
      const box = wrap.getBoundingClientRect();
      const withinBand = e.clientY > box.top - 260 && e.clientY < box.bottom + 260;
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
      const radius = Math.max(140, wrap.offsetWidth * 0.12);
      for (const l of lettersRef.current) {
        if (pointerX === null) {
          l.target = 0;
        } else {
          const d = Math.abs(pointerX - l.x);
          const f = Math.max(0, 1 - d / radius);
          l.target = f * f * (3 - 2 * f);
        }
        // smooth critically-damped ease
        l.dip += (l.target - l.dip) * (l.target > l.dip ? 0.16 : 0.08);

        if (Math.abs(l.dip) > 0.0005 || l.target > 0) {
          active = true;
        }

        const y = l.dip * 40;
        const scale = 1 - l.dip * 0.14;
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

  return (
    <div
      ref={wrapRef}
      className="flex w-full select-none items-end justify-center gap-[0.5vw] whitespace-nowrap px-[0.5vw]"
      aria-label={text}
    >
      {text.split('').map((c, i, arr) => {
        const n = arr.length - 1;
        const t = n === 0 ? 0.5 : i / n;
        // taper: big at both ends, smaller in the middle
        const f = 1 - 0.28 * Math.sin(t * Math.PI);
        // deep smile curve: ends lifted, middle drops low
        const arc = Math.sin(t * Math.PI) * 4.5;
        // tilt: left letters lean down-right, right letters lean down-left
        const tilt = (0.5 - t) * 12;
        return (
          <span
            key={`${c}-${i}`}
            data-letter
            className="inline-block origin-bottom will-change-transform"
          >
            <span
              className={`block font-mega font-black leading-[0.72] tracking-[0.005em] ${textColor}`}
              style={{
                fontSize: `min(${(15 * f).toFixed(3)}vw, ${(16 * f).toFixed(3)}rem)`,
                transform: `translateY(${arc}vw) rotate(${tilt}deg)`,
              }}
            >
              {c === ' ' ? '\u2009' : c}
            </span>
          </span>
        );
      })}
    </div>
  );
};