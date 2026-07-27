import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const reduce = useReducedMotion();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section id="inicio"
      className="relative flex items-center min-h-[100dvh] pt-[100px] lg:pt-[116px] pb-8 overflow-hidden bg-slate-50 font-sans">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero.png"
          alt="NTC Del Norte - Exportacion de alimentos"
          className="w-full h-full object-cover object-right-top opacity-100"
          loading="eager"
        />
        {/* Soft light overlays for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 sm:via-white/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="max-w-2xl">
          {/* Headline - Poppins */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold tracking-tight text-[#000000] leading-[1.12] uppercase mb-3">
              Del campo a su mesa,
              <br />
              <span className="text-[#1E4FA3]">calidad que se exporta</span>
            </h1>
            {/* Teal decorative line */}
            <div className="w-14 h-1 bg-[#2FAF9B] rounded-full mb-5" />
          </motion.div>

          {/* Subtext - Open Sans */}
          <motion.p
            className="text-base sm:text-lg font-sans font-medium text-slate-800 leading-relaxed max-w-[48ch] mb-7"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            Conectamos los mejores productos agrícolas Colombianos con mercados internacionales. Frescura, confianza y excelencia en cada envío.
          </motion.p>

          {/* Main CTA Button - Roboto */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() => scrollTo('contacto')}
              className="bg-[#1E4FA3] hover:bg-[#163E85] text-white font-roboto font-medium text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-[#1E4FA3]/25 hover:shadow-xl hover:shadow-[#1E4FA3]/35 transition-all duration-300 inline-flex items-center gap-2.5 uppercase tracking-wider group active:scale-[0.98]"
            >
              <svg className="w-5 h-5 text-[#2FAF9B] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 10 59 16.17 3.83 12 17.83 12 17.83 12 17.83zm-5.66 4.24a5 5 0 0 1 7.07 0L21 14.83A7 7 0 0 0 11.34 5.17l-1.41 1.41a5 5 0 0 1 1.41 5.66z" />
                <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-1.85-.56-3.57-1.52-5l-1.45 1.45C18.66 9.49 19 10.7 19 12a7 7 0 1 1-14 0c0-3.87 3.13-7 7-7 1.3 0 2.51.34 3.55.97l1.45-1.45A8.94 8.94 0 0 0 12 3z" />
              </svg>
              Conoce más
            </button>
          </motion.div>

          {/* 4 Feature Badges Grid - Montserrat & Roboto */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-5 border-t border-slate-200/80 max-w-2xl"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Badge 1: Alcance Internacional */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1E4FA3]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-heading font-medium text-slate-800 leading-tight">
                Alcance<br />Internacional
              </span>
            </div>

            {/* Badge 2: Calidad Certificada */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#2FAF9B]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-heading font-medium text-slate-800 leading-tight">
                Calidad<br />Certificada
              </span>
            </div>

            {/* Badge 3: Productos Sostenibles */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#1E4FA3]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-heading font-medium text-slate-800 leading-tight">
                Productos<br />Sostenibles
              </span>
            </div>

            {/* Badge 4: Logística Eficiente */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#2FAF9B]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25v11.25m0-11.25h-5.25m5.25 0H14.25" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-heading font-medium text-slate-800 leading-tight">
                Logística<br />Eficiente
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

