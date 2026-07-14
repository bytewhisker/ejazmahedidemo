import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Monitor, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function CustomPlayer({ videoSrc, projectSpecs }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [hoverTimelineWidth, setHoverTimelineWidth] = useState(0);

  const fps = parseFloat(projectSpecs?.fps) || 24.00;

  useEffect(() => {
    // Reset player state when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  // Format time to director timecode (HH:MM:SS:FF)
  const formatTimecode = (secs) => {
    if (isNaN(secs)) return "00:00:00:00";
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    const frames = Math.floor((secs % 1) * fps);

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
      frames.toString().padStart(2, '0')
    ].join(':');
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleTimelineClick = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const handleTimelineHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setHoverTimelineWidth(pos * 100);
  };

  const handleTimelineLeave = () => {
    setHoverTimelineWidth(0);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const toggleCinemaMode = () => {
    setIsCinemaMode(!isCinemaMode);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const isVimeo = videoSrc && 
    (videoSrc.includes('vimeo.com') || videoSrc.includes('player.vimeo.com')) &&
    !videoSrc.includes('.mp4');
  
  if (isVimeo) {
    let embedUrl = videoSrc;
    if (!videoSrc.includes('player.vimeo.com')) {
      const match = videoSrc.match(/vimeo\.com\/(\d+)/);
      const videoId = match ? match[1] : '';
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&color=d4af37`;
    }

    return (
      <div 
        ref={containerRef}
        className={`video-player-container ${isCinemaMode ? 'cinema-mode' : ''}`}
        style={{ maxWidth: isCinemaMode ? '100%' : '1120px', margin: '0 auto 40px', aspectRatio: '16/9', position: 'relative' }}
      >
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          title="Project Video"
        />

        {showOverlay && (
          <div className="viewfinder-overlay" style={{ pointerEvents: 'none' }}>
            <div className="viewfinder-top">
              <div className="viewfinder-rec">
                <span className="rec-dot"></span>
                <span>REC</span>
              </div>
              <div>{projectSpecs?.resolution || "4K UHD"}</div>
              <div>TC LIVE</div>
            </div>
            
            <div className="viewfinder-middle">
              <div className="viewfinder-crosshair"></div>
            </div>
            
            <div className="viewfinder-bottom">
              <div>ASPECT: {projectSpecs?.aspectRatio || "2.39:1"}</div>
              <div>LENS: {projectSpecs?.gear || "ZEISS CP.3"}</div>
              <div>{projectSpecs?.fps || "24.00 fps"}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`video-player-container ${isCinemaMode ? 'cinema-mode' : ''}`}
      style={{ maxWidth: isCinemaMode ? '100%' : '1120px', margin: '0 auto 40px' }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="video-element"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
        autoPlay
        loop
        muted={isMuted}
      />

      {/* Viewfinder Spec Overlay (DP specific) */}
      {showOverlay && (
        <div className="viewfinder-overlay">
          <div className="viewfinder-top">
            <div className="viewfinder-rec">
              <span className="rec-dot"></span>
              <span>REC</span>
            </div>
            <div>{projectSpecs?.resolution || "4K UHD"}</div>
            <div>TC {formatTimecode(currentTime)}</div>
          </div>
          
          <div className="viewfinder-middle">
            <div className="viewfinder-crosshair"></div>
          </div>
          
          <div className="viewfinder-bottom">
            <div>ASPECT: {projectSpecs?.aspectRatio || "2.39:1"}</div>
            <div>LENS: {projectSpecs?.gear || "ZEISS CP.3"}</div>
            <div>{projectSpecs?.fps || "24.00 fps"}</div>
          </div>
        </div>
      )}

      {/* Custom Controls Bar */}
      <div className="video-controls">
        {/* Timeline Scrubber */}
        <div 
          className="timeline-container"
          onClick={handleTimelineClick}
          onMouseMove={handleTimelineHover}
          onMouseLeave={handleTimelineLeave}
        >
          <div 
            className="timeline-hover-bar"
            style={{ width: `${hoverTimelineWidth}%` }}
          />
          <div 
            className="timeline-progress"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="timeline-handle" />
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="volume-container">
              <button className="control-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <div className="timecode-display">
              <span>{formatTimecode(currentTime)}</span>
              <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--text-secondary)' }}>{formatTimecode(duration)}</span>
            </div>
          </div>

          <div className="controls-right">
            <button 
              className="control-btn" 
              onClick={() => setShowOverlay(!showOverlay)} 
              title={showOverlay ? "Hide Viewfinder Overlay" : "Show Viewfinder Overlay"}
            >
              {showOverlay ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button 
              className="control-btn" 
              onClick={toggleCinemaMode} 
              title="Cinema Mode"
            >
              <Monitor size={18} style={{ color: isCinemaMode ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
            </button>
            <button 
              className="control-btn" 
              onClick={toggleFullscreen} 
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
