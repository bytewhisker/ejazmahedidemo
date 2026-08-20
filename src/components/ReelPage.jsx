import React from 'react';
import { motion } from 'framer-motion';
import { CustomPlayer } from './CustomPlayer';

const REEL_VIMEO_ID = '782070615';

export const ReelPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen pt-2 pb-24 px-4 sm:px-6 lg:px-8 font-sans select-none max-w-[1700px] mx-auto"
    >
      <CustomPlayer
        vimeoId={REEL_VIMEO_ID}
        title="Ejaz Mehedi — Showreel"
      />
    </motion.div>
  );
};