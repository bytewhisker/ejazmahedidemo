import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUp } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050506] border-t border-neutral-800/80 py-12 px-4 sm:px-6 lg:px-8 text-neutral-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand info */}
        <div className="text-center md:text-left rtl:md:text-right space-y-1">
          <span className="text-white font-serif text-base tracking-widest block">
            {t.brandName}
          </span>
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
            © {new Date().getFullYear()} {t.footer.rights} • {t.footer.cinematography}
          </span>
        </div>

        {/* Center: Social links */}
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest">
          <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Vimeo</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a>
          <a href="https://imdb.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">IMDb</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a>
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-amber-500/40 transition-all uppercase tracking-widest text-[10px]"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </footer>
  );
};
