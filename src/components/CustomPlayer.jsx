import React from 'react';

export const CustomPlayer = ({ poster, videoUrl, embedUrl, vimeoId, title, isReel }) => {
  let extractVimeoId = vimeoId;
  if (!extractVimeoId && embedUrl) {
    const match = embedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) extractVimeoId = match[1];
  }

  const hasVimeo = Boolean(extractVimeoId);
  const isReelVideo = isReel || extractVimeoId === '782070615';

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-sm shadow-2xl">
      {hasVimeo ? (
        <iframe
          src={`https://player.vimeo.com/video/${extractVimeoId}?transparent=0&title=0&byline=0&portrait=0&color=000000`}
          className="absolute inset-0 w-full h-full border-0 bg-black"
          style={{ backgroundColor: '#000000' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || "Vimeo Video Player"}
        />
      ) : (
        <video
          src={videoUrl}
          poster={poster}
          controls
          playsInline
          className="absolute inset-0 w-full h-full object-cover bg-black"
        />
      )}
    </div>
  );
};
