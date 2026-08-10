import { useEffect, useRef } from "react";

type LetterState = {
  el: HTMLSpanElement;
  x: number;
  dip: number;
  vel: number;
  target: number;
};

/**
 * Oversized display word that bleeds past the viewport edges and is cropped by
 * the bottom of the page. Letters dip down and spring back as the pointer
 * sweeps past — no hover required.
 */
export function MegaName({ text = "EJAZ MEHEDI" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<LetterState[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const spans = Array.from(
      wrap.querySelectorAll<HTMLSpanElement>("[data-letter]"),
    );

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
    let pointerX: number | null = null;

    const onMove = (e: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      const withinBand =
        e.clientY > box.top - 260 && e.clientY < box.bottom + 260;
      pointerX = withinBand ? e.clientX - box.left : null;
    };
    const onLeave = () => {
      pointerX = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const tick = () => {
      const radius = Math.max(140, wrap.offsetWidth * 0.12);
      for (const l of lettersRef.current) {
        if (pointerX === null) {
          l.target = 0;
        } else {
          const d = Math.abs(pointerX - l.x);
          const f = Math.max(0, 1 - d / radius);
          l.target = f * f * (3 - 2 * f);
        }
        // smooth critically-damped ease — eases out with no bounce
        l.dip += (l.target - l.dip) * (l.target > l.dip ? 0.16 : 0.08);


        const y = l.dip * 40;
        const scale = 1 - l.dip * 0.14;
        l.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div
      ref={wrapRef}
      className="flex w-full select-none items-end justify-center gap-[0.5vw] whitespace-nowrap px-[2vw]"
      aria-label={text}
    >
      {text.split("").map((c, i, arr) => {
        const n = arr.length - 1;
        const t = n === 0 ? 0.5 : i / n;
        // deep smile curve: ends lifted, middle drops low
        const arc = Math.sin(t * Math.PI) * 4.5;
        const tilt = (t - 0.5) * 12;
        return (
          <span
            key={`${c}-${i}`}
            data-letter
            className="inline-block origin-bottom will-change-transform"
          >
            <span
              className="block font-mega text-[min(13vw,14rem)] font-black leading-[0.72] tracking-[0.005em] text-foreground"
              style={{ transform: `translateY(${arc}vw) rotate(${tilt}deg)` }}
            >
              {c === " " ? "\u2009" : c}
            </span>
          </span>
        );
      })}
    </div>
  );
}

