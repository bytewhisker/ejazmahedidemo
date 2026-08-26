import React from 'react';
import { MegaName } from './MegaName';

export const Footer = ({ isLime, showMegaName = isLime }) => {
  const textColor = isLime ? 'text-[var(--about-ink)]' : 'text-accent';
  const copyrightColor = isLime ? 'text-[var(--about-ink-70)]' : 'text-muted';

  return (
    <footer className="overflow-hidden pt-[2vw] pb-[1vw] w-full mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto w-full">
        
        {/* Horizontal Divider Line marked by user */}
        <div className={`w-full border-t ${isLime ? 'border-[var(--about-ink)]/20' : 'border-white/20'} pt-6`} />

        <div className={`pb-12 ${isLime ? 'pb-16 mb-4 justify-end' : 'justify-between'} flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-6 text-sm sm:text-base`}>
          
          {/* Left Side — Hidden on Info page (isLime) */}
          {!isLime && (
            <div className={`flex flex-col gap-1.5 font-sans ${textColor}`}>
              <div>
                <a href="mailto:ejazmeh.work@gmail.com" className="font-bold hover:underline">ejazmeh.work@gmail.com</a>
                <span className="mx-2 font-normal">/</span>
                <span className="font-normal">+968 78058101</span> 
              </div>
              <div>
                <a href="https://instagram.com/ejazmehedi" target="_blank" rel="noreferrer" className="font-bold hover:underline">Instagram</a>
                <span className="mx-2 font-normal">-</span>
                <a href="https://vimeo.com/ejazmehedi" target="_blank" rel="noreferrer" className="font-bold hover:underline">Vimeo</a>
                <span className="mx-2 font-normal">-</span>
                <a href="https://www.imdb.com/name/nm13341457/" target="_blank" rel="noreferrer" className="font-bold hover:underline">IMDb</a>
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className={`font-sans font-light text-xs sm:text-sm ${isLime ? 'text-right' : 'sm:mt-auto'} ${copyrightColor}`}>
            © 2026 Ejaz Mehedi. All rights reserved.
          </div>
        </div>
      </div>
      
      {showMegaName && <MegaName text="EJAZ MEHEDI" isLime={isLime} />}
    </footer>
  );
};