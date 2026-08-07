import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-neutral-900 text-center select-none">
      <p className="text-[11px] font-mono-custom tracking-[0.25em] text-neutral-500 uppercase">
        © {new Date().getFullYear()} EZAZ MAHEDI. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
};
