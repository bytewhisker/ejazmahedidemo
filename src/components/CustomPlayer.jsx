import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export const CustomPlayer = ({ poster, videoUrl, embedUrl, vimeoId, title }) => {
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  let extractVimeoId = vimeoId;
  if (!extractVimeoId && embedUrl) {
    const match = embedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) extractVimeoId = match[1];
  }

  const hasVimeo = Boolean(extractVimeoId);

  const togglePlay = () => {
    if (hasVimeo && iframeRef.current) {
      const targetWindow = iframeRef.current.contentWindow;
      if (targetWindow) {
        const action = isPlaying ? 'pause' : 'play';
        targetWindow.postMessage(JSON.stringify({ method: action }), '*');
        setIsPlaying(!isPlaying);
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Listen for Vimeo messages to sync play/pause state
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.origin.includes('vimeo.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'play') setIsPlaying(true);
        if (data.event === 'pause') setIsPlaying(false);
      } catch (e) {
        // Ignore non-json messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      data-cursor-hover="true"
      onClick={togglePlay}
      className="custom-player-overlay group relative w-full aspect-video bg-black overflow-hidden rounded-sm shadow-2xl cursor-pointer select-none"
    >
      {hasVimeo ? (
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${extractVimeoId}?api=1&player_id=1&transparent=0&title=0&byline=0&portrait=0&color=000000`}
          className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-none"
          style={{ backgroundColor: '#000000' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || "Vimeo Video Player"}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg-black pointer-events-none"
        />
      )}

      {/* Transparent Click Overlay — Keeps Custom Designer Cursor active over video */}
      <div className="absolute inset-0 z-10 bg-transparent flex items-center justify-center">
        {/* Subtle Play/Pause Overlay Icon on Hover */}
        <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105">
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-white" />
          ) : (
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};
