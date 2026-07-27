import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, title, className = '' }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose} />
          <motion.div
            className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-[2rem]
              shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_32px_rgba(0,0,0,0.08),0_16px_64px_rgba(0,0,0,0.06)] ${className}`}
            initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.9 }}>
            {title && (
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                <h2 className="text-lg font-heading font-semibold text-gray-900 tracking-tight">{title}</h2>
                <button onClick={onClose} className="group p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300 active:scale-90" aria-label="Cerrar">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
