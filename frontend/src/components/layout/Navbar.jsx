import React, { useState } from 'react';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#sobre-nosotros' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-9 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(10,25,41,0.06)] border-b border-gray-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }}
            className="flex items-center gap-3 shrink-0 group transition-transform active:scale-[0.98]">
            <img
              src="/assets/logo.png"
              alt="NTC Del Norte"
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300 group-hover:brightness-105"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 font-roboto">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}
                className={`relative py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                  index === 0 ? 'text-[#1E4FA3]' : 'text-slate-700 hover:text-[#2FAF9B]'
                }`}
              >
                {link.label}
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2FAF9B] rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button
                variant="secondary"
                size="sm"
                className="!bg-[#1E4FA3] hover:!bg-[#163E85] !text-white font-roboto font-medium !rounded-xl !px-6 !py-2.5 shadow-md shadow-[#1E4FA3]/20 uppercase tracking-wider"
                onClick={() => scrollTo('contacto')}
              >
                Contáctenos
              </Button>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Menu"
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span className={`block h-[2px] w-full rounded-full bg-[#000000] transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                <span className={`block h-[2px] w-full rounded-full bg-[#000000] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[2px] w-full rounded-full bg-[#000000] transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] bg-white border-t border-gray-100 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 space-y-2">
          {NAV_LINKS.map((link, index) => (
            <a key={link.label} href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href.substring(1)); }}
              className={`block px-4 py-3 rounded-xl text-base font-normal transition-all duration-200 ${
                index === 0 ? 'bg-emerald-50 text-[#1E4FA3]' : 'text-slate-700 hover:bg-slate-50'
              }`}>
              {link.label}
            </a>
          ))}
          <div className="pt-3 sm:hidden">
            <Button variant="secondary" size="sm" className="w-full !bg-[#1E4FA3] !text-white font-medium !rounded-xl" onClick={() => scrollTo('contacto')}>
              Contáctenos
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

