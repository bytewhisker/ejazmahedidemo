import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const CinematicLoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Show full screen GIF for 1.8 seconds max then complete
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Salomon Ligthelm Fullscreen Loading GIF */}
      <img
        src="https://ligthelm.work/static/img/loading.gif"
        alt="Loading..."
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
