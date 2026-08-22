import React, { useEffect, useRef, useState } from "react";

/**
 * BlendCursor: A clean white dot cursor that follows the mouse with easing (lerp 0.35)
 * and expands into a large circle when hovering over links, buttons, or project cards.
 * Uses `mix-blend-mode: difference` to invert whatever is underneath.
 */
export const CustomCursor = () => {
  const dotRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on fine pointer devices (desktop)
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let frame = 0;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);

      const el = e.target?.closest?.(
        "a, button, [data-cursor-hover], [data-cursor], [role='button'], input, select"
      );
      setHovering(Boolean(el));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const render = () => {
      // 1:1 Real-time tracking (no delay/lag)
      pos.x += (target.x - pos.x) * 1;
      pos.y += (target.y - pos.y) * 1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999999] hidden rounded-full bg-white mix-blend-difference transition-[width,height,opacity] duration-300 ease-out md:block select-none"
      style={{
        width: hovering ? 64 : 12,
        height: hovering ? 64 : 12,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};
