import React from 'react';

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#1E4FA3] text-white text-[11px] sm:text-xs font-roboto font-medium border-b border-[#163E85]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-9 tracking-wide">
          {/* Tagline / Badge */}
          <div className="hidden md:flex items-center gap-2 text-[#2FAF9B] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#2FAF9B] animate-pulse" />
            <span className="text-white">Exportación de Alimentos de Alta Calidad</span>
          </div>

          {/* Contact Details */}
          <div className="flex items-center justify-center sm:justify-end gap-6 w-full md:w-auto">
            <a href="mailto:ntcdelnorte@gmail.com"
              className="flex items-center gap-2 text-white/90 hover:text-[#2FAF9B] transition-colors duration-200">
              <span className="w-5 h-5 rounded-full bg-[#2FAF9B]/20 border border-[#2FAF9B]/40 flex items-center justify-center text-[#2FAF9B]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>ntcdelnorte@gmail.com</span>
            </a>

            <span className="w-px h-3.5 bg-white/20 hidden sm:block" />

            <a href="https://wa.me/573113351064" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/90 hover:text-[#2FAF9B] transition-colors duration-200">
              <span className="w-5 h-5 rounded-full bg-[#2FAF9B]/20 border border-[#2FAF9B]/40 flex items-center justify-center text-[#2FAF9B]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span>+57 311 335 1064</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


