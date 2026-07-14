import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Monitor, Eye, EyeOff } from 'lucide-react';

export default function CustomPlayer({ videoSrc, vimeoId, youtubeId, projectSpecs }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [hoverTimelineWidth, setHoverTimelineWidth] = useState(0);

  const fps = parseFloat(projectSpecs?.fps) || 24.00;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
    } else {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [isPlaying]);

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
      videoRef.current.play().catch(() => {});
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

  const handleTimelineLeave = () => setHoverTimelineWidth(0);

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

  const toggleCinemaMode = () => setIsCinemaMode(!isCinemaMode);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const overlayStyle = {
    pointerEvents: 'none',
    transition: 'opacity 0.4s ease',
    opacity: showControls ? 1 : 0
  };

  const ViewfinderOverlay = () => (
    <div className="viewfinder-overlay" style={overlayStyle}>
      <div className="viewfinder-top">
        <div className="viewfinder-rec">
          <span className="rec-dot"></span>
          <span>REC</span>
        </div>
        <div>{projectSpecs?.resolution || "4K UHD"}</div>
        <div>{youtubeId ? 'YOUTUBE' : 'TC LIVE'}</div>
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
  );

  if (youtubeId) {
    return (
      <div
        ref={containerRef}
        className={`video-player-container ${isCinemaMode ? 'cinema-mode' : ''}`}
        style={{ maxWidth: isCinemaMode ? '100%' : '1120px', margin: '0 auto 40px', aspectRatio: '16/9', position: 'relative' }}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          title="Project Video"
        />

        {showOverlay && <ViewfinderOverlay />}

        <div className="video-controls" style={{ transition: 'opacity 0.4s ease', opacity: showControls ? 1 : 0 }}>
          <div className="controls-row">
            <div className="controls-left">
              <button className="control-btn" onClick={() => {
                const iframe = containerRef.current?.querySelector('iframe');
                if (iframe) {
                  iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: isPlaying ? 'pauseVideo' : 'playVideo',
                    args: ''
                  }), '*');
                  setIsPlaying(!isPlaying);
                }
              }}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
            <div className="controls-right">
              <button className="control-btn" onClick={() => setShowOverlay(!showOverlay)}>
                {showOverlay ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button className="control-btn" onClick={toggleCinemaMode}>
                <Monitor size={18} style={{ color: isCinemaMode ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
              </button>
              <button className="control-btn" onClick={toggleFullscreen}>
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isVimeo = vimeoId || (
    videoSrc &&
    (videoSrc.includes('vimeo.com') || videoSrc.includes('player.vimeo.com')) &&
    !videoSrc.includes('.mp4')
  );

  if (isVimeo) {
    let embedUrl = videoSrc;
    if (vimeoId) {
      embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=d4af37`;
    } else if (!videoSrc.includes('player.vimeo.com')) {
      const match = videoSrc.match(/vimeo\.com\/(\d+)/);
      const id = match ? match[1] : '';
      embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&color=d4af37`;
    }

    return (
      <div
        ref={containerRef}
        className={`video-player-container ${isCinemaMode ? 'cinema-mode' : ''}`}
        style={{ maxWidth: isCinemaMode ? '100%' : '1120px', margin: '0 auto 40px', aspectRatio: '16/9', position: 'relative' }}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      >
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          title="Project Video"
        />

        {showOverlay && <ViewfinderOverlay />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`video-player-container ${isCinemaMode ? 'cinema-mode' : ''}`}
      style={{ maxWidth: isCinemaMode ? '100%' : '1120px', margin: '0 auto 40px', position: 'relative' }}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
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

      {showOverlay && <ViewfinderOverlay />}

      <div className="video-controls" style={{ transition: 'opacity 0.4s ease', opacity: showControls ? 1 : 0 }}>
        <div className="timeline-container" onClick={handleTimelineClick} onMouseMove={handleTimelineHover} onMouseLeave={handleTimelineLeave}>
          <div className="timeline-hover-bar" style={{ width: `${hoverTimelineWidth}%` }} />
          <div className="timeline-progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
            <div className="timeline-handle" />
          </div>
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="volume-container">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="volume-slider" />
            </div>
            <div className="timecode-display">
              <span>{formatTimecode(currentTime)}</span>
              <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>/</span>
              <span style={{ color: 'var(--text-secondary)' }}>{formatTimecode(duration)}</span>
            </div>
          </div>
          <div className="controls-right">
            <button className="control-btn" onClick={() => setShowOverlay(!showOverlay)}>
              {showOverlay ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button className="control-btn" onClick={toggleCinemaMode}>
              <Monitor size={18} style={{ color: isCinemaMode ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
            </button>
            <button className="control-btn" onClick={toggleFullscreen}>
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
