import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-8 px-4 text-center select-none">
      <p className="text-[11px] font-mono-custom tracking-[0.25em] text-muted uppercase">
        © {new Date().getFullYear()} EZAZ MAHEDI. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};
