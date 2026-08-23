import React from 'react';
import { MegaName } from './MegaName';

export const Footer = ({ isLime, showMegaName = isLime }) => {
  const textColor = isLime ? 'text-[var(--about-ink)]' : 'text-ink';

  return (
    <footer className="overflow-hidden pt-[1.5vw] pb-[0.75vw] w-full mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto w-full">
        <div className={`pt-4 pb-12 flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-6 text-sm sm:text-base ${textColor}`}>
          
          {/* Left Side */}
          <div className="flex flex-col gap-1.5 font-sans">
            <div>
              <a href="mailto:ejazmeh.work@gmail.com" className="font-black">ejazmeh.work@gmail.com</a>
              <span className="mx-2 font-normal">/</span>
              <span className="font-normal">+968 78058101</span> 
            </div>
            <div>
              <a href="https://instagram.com/ejazmehedi" target="_blank" rel="noreferrer" className="font-black">Instagram</a>
              <span className="mx-2 font-normal">-</span>
              <a href="https://vimeo.com/ejazmehedi" target="_blank" rel="noreferrer" className="font-black">Vimeo</a>
              <span className="mx-2 font-normal">-</span>
              <a href="https://www.imdb.com/name/nm13341457/" target="_blank" rel="noreferrer" className="font-black">IMDb</a>
            </div>
          </div>

          {/* Right Side */}
          <div className={`font-sans font-light text-xs sm:text-sm sm:mt-auto ${textColor}`}>
            © 2026 Ejaz Mehedi. All rights reserved.
          </div>
        </div>
      </div>
      
      {showMegaName && <MegaName text="EJAZ MEHEDI" isLime={isLime} />}
    </footer>
  );
};