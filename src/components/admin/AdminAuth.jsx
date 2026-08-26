import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Lock, ArrowRight, ShieldCheck, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAuth = () => {
  const { loginAdmin } = useCMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div data-admin="true" className="admin-root min-h-screen bg-canvas text-ink flex items-center justify-center p-4 font-sans relative overflow-hidden select-none">
      {/* Background Subtle Gradient & Grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black pointer-events-none" />
      <div className="film-grain" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-surface/90 border border-line-strong p-8 rounded-xl shadow-2xl backdrop-blur-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-accent/10 text-accent mb-2">
            <Film className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-mono-custom tracking-[0.2em] font-bold text-ink uppercase">
            EJAZ MEHEDI / CMS
          </h1>
          <p className="text-xs font-mono-custom text-muted uppercase tracking-widest">
            Visual Webflow Builder Login
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-custom text-center rounded-md"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono-custom tracking-widest text-muted uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 bg-canvas/80 border border-line text-ink rounded-lg focus:outline-none focus:border-accent text-sm font-mono-custom transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono-custom tracking-widest text-muted uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-canvas/80 border border-line text-ink rounded-lg focus:outline-none focus:border-accent text-sm font-mono-custom transition-colors pr-10"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-accent text-canvas font-mono-custom text-xs uppercase tracking-[0.2em] font-bold rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
          >
            <span>Enter Admin Dashboard</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="pt-4 border-t border-line/40 text-center">
          <p className="text-[10px] font-mono-custom text-muted tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Default Credentials: admin / admin</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
