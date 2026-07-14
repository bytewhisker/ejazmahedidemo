import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, .filter-btn, .project-card, .social-btn, .info-toggle-btn, .nav-link-item, [data-cursor-hover]');
      setIsHovering(!!el);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    const frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          opacity: isHidden ? 0 : 1,
          transform: isHovering
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(1)',
          width: isHovering ? '50px' : '32px',
          height: isHovering ? '50px' : '32px',
          borderColor: isHovering ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
          background: isHovering ? 'rgba(212,175,55,0.06)' : 'transparent',
        }}
      />
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{
          opacity: isHidden ? 0 : 1,
          transform: isHovering
            ? 'translate(-50%, -50%) scale(0)'
            : 'translate(-50%, -50%) scale(1)',
        }}
      />
    </>
  );
}
