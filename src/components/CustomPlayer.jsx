import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export const CustomPlayer = ({ poster, videoUrl, embedUrl, vimeoId, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);
  }, [videoUrl, embedUrl, vimeoId]);

  // Determine effective Vimeo embed URL (no autoplay — playback is user-initiated)
  const effectiveVimeoUrl = vimeoId 
    ? `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0`
    : embedUrl && (embedUrl.includes('vimeo.com') || embedUrl.includes('youtube.com'))
      ? embedUrl
      : null;

  // Iframe Embed Player (Vimeo / YouTube) — Full Width Responsive 16:9 Cinema Container
  if (effectiveVimeoUrl) {
    return (
      <div className="relative w-full aspect-video bg-black overflow-hidden select-none rounded-sm shadow-2xl">
        <iframe
          src={effectiveVimeoUrl}
          title={title || "Video Player"}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 bg-black"
        />
      </div>
    );
  }

  // HTML5 Video Player
  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Play interrupted:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
      setProgress(pos * 100);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden group select-none rounded-sm shadow-2xl">
      
      {/* Video Poster Cover Image */}
      {!isPlaying && (
        <img
          src={poster}
          alt={title || "Video poster"}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500"
        />
      )}

      {/* HTML5 Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={handlePlayToggle}
        playsInline
        className="w-full h-full object-cover z-0 cursor-pointer"
      />

      {/* Center Play Button if paused */}
      {!isPlaying && (
        <button
          onClick={handlePlayToggle}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors group/play"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl pl-1 transform group-hover/play:scale-110 transition-transform">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-black" />
          </div>
        </button>
      )}

      {/* Video Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          onClick={handleSeek}
          className="w-full h-1 bg-white/20 mb-3 cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-white relative"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white font-mono-custom text-xs">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayToggle} className="hover:text-neutral-400">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button onClick={toggleMute} className="hover:text-neutral-400">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button onClick={toggleFullScreen} className="hover:text-neutral-400">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
