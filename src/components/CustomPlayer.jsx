import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import Player from '@vimeo/player';

export const CustomPlayer = ({ poster, videoUrl, embedUrl, vimeoId, title }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const vimeoContainerRef = useRef(null);
  const playerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const hasVimeo = Boolean(vimeoId || (embedUrl && (embedUrl.includes('vimeo.com') || embedUrl.includes('youtube.com'))));

  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [videoUrl, embedUrl, vimeoId]);

  // Init Vimeo Player
  useEffect(() => {
    if (hasVimeo && vimeoContainerRef.current) {
      let id = vimeoId;
      if (!id && embedUrl) {
        // Simple extraction for Vimeo IDs from embed URL if needed
        id = embedUrl.split('/').pop().split('?')[0];
      }
      if (id) {
        playerRef.current = new Player(vimeoContainerRef.current, {
          id: id,
          responsive: true,
          controls: false, // Custom controls handle interactions
          dnt: true,
          autoplay: false,
          loop: false,
          muted: false,
          transparent: true
        });

        playerRef.current.on('play', () => setIsPlaying(true));
        playerRef.current.on('pause', () => setIsPlaying(false));
        playerRef.current.on('timeupdate', (data) => {
          setProgress(data.percent * 100);
        });
        playerRef.current.on('loaded', () => {
          setIsLoading(false);
          playerRef.current.getDuration().then(d => setDuration(d));
          // Reset any default muting just in case
          playerRef.current.getVolume().then(v => {
            setIsMuted(v === 0);
          });
        });
        playerRef.current.on('volumechange', (data) => {
          setIsMuted(data.volume === 0);
        });
        playerRef.current.on('ended', () => {
          setIsPlaying(false);
        });
        
        return () => {
          if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
          }
        };
      }
    }
  }, [hasVimeo, vimeoId, embedUrl]);

  const handlePlayToggle = (e) => {
    if (e) e.stopPropagation();
    
    if (hasVimeo) {
      if (playerRef.current) {
        if (isPlaying) playerRef.current.pause();
        else playerRef.current.play();
      }
      return;
    }
    
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
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    if (hasVimeo) {
      if (playerRef.current && duration) {
        playerRef.current.setCurrentTime(pos * duration);
        setProgress(pos * 100);
      }
      return;
    }

    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
      setProgress(pos * 100);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (hasVimeo) {
      if (playerRef.current) {
        playerRef.current.setVolume(isMuted ? 1 : 0);
        setIsMuted(!isMuted);
      }
      return;
    }
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-canvas overflow-hidden group select-none rounded-sm shadow-2xl"
      data-cursor-hover
    >
      {/* Video Poster Cover Image */}
      {!isPlaying && poster && (
        <img
          src={poster}
          alt={title || "Video poster"}
          className="absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 pointer-events-none"
        />
      )}

      {/* Vimeo Embed */}
      {hasVimeo && (
        <div 
          className="absolute inset-0 w-full h-full bg-canvas z-0 pointer-events-none [&>iframe]:w-full [&>iframe]:h-full"
          ref={vimeoContainerRef} 
        />
      )}

      {/* HTML5 Video */}
      {!hasVimeo && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          onCanPlay={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Invisible Click Overlay for Play/Pause */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer" 
        onClick={handlePlayToggle}
      />

      {/* Center Play Button if paused */}
      {!isPlaying && (
        <button
          onClick={handlePlayToggle}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors group/play pointer-events-none"
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
            className="h-full bg-white relative pointer-events-none"
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
