import React, { useEffect, useRef, useState } from "react";

/**
 * CustomCursor: A sleek white dot cursor that follows mouse movement with lerp
 * and expands into a large circle over links, buttons, and video players.
 * Uses mix-blend-mode: difference for high-contrast visibility on all backgrounds.
 */
export const CustomCursor = () => {
  const dotRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      return () => document.body.classList.remove('admin-mode');
    }
    document.body.classList.remove('admin-mode');

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
        "a, button, [data-cursor-hover], [data-cursor], [role='button'], input, select, iframe, video, .custom-player-overlay"
      );
      setHovering(Boolean(el));
    };

    const onLeave = (e) => {
      // If mouse is still inside viewport bounds (e.g. over video iframe), stay visible
      if (
        e &&
        e.clientX > 0 &&
        e.clientX < window.innerWidth &&
        e.clientY > 0 &&
        e.clientY < window.innerHeight
      ) {
        return;
      }
      setVisible(false);
    };

    const onEnter = () => setVisible(true);

    const render = () => {
      pos.x += (target.x - pos.x) * 1;
      pos.y += (target.y - pos.y) * 1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { capture: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove, { capture: true });
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(frame);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

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
