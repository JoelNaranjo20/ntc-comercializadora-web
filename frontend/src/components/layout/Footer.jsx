import React from 'react';

const LINKS = [
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1F47] text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16">
          {/* Brand */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-poppins font-extrabold text-white tracking-wider">NTC</span>
              <span className="text-xs text-[#2FAF9B] font-poppins font-medium">C.I. COMERCIALIZADORA DEL NORTE S & L S.A.S.</span>
            </div>
            <p className="text-xs text-gray-400 font-poppins">NIT. 901.545.228-1</p>
            <p className="text-slate-300 leading-relaxed max-w-sm text-sm font-roboto pt-2">
              Especialistas en importación y exportación de productos agroalimentarios de alta calidad. Nuestra prioridad eres tú.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-poppins font-bold tracking-wider text-[#2FAF9B] uppercase mb-5">Navegación</h4>
            <ul className="space-y-3 font-roboto">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-300 hover:text-[#2FAF9B] transition-colors duration-200 text-sm font-medium">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-poppins font-bold tracking-wider text-[#2FAF9B] uppercase mb-5">Contacto Directo</h4>
            <ul className="space-y-4 text-gray-300 text-sm font-roboto">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#163E85] text-[#2FAF9B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-300 leading-snug">Carrera 54 # 72 - 80 Oficina # 33-41 Edificio Centro</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#163E85] text-[#2FAF9B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <a href="mailto:ntcdelnorte@gmail.com" className="text-xs hover:text-[#2FAF9B] transition-colors duration-200">ntcdelnorte@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#163E85] text-[#2FAF9B] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.4 1.867a11.954 11.954 0 01-5.407-5.407l1.867-1.4c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <a href="https://wa.me/573113351064" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-[#2FAF9B] transition-colors duration-200">311 3351064</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-roboto">
          <p className="text-xs text-gray-400">&copy; {currentYear} C.I. COMERCIALIZADORA DEL NORTE S & L S.A.S. NIT. 901.545.228-1</p>
          <p className="text-[11px] text-gray-400">Importación y Exportación de Alimentos</p>
        </div>
      </div>
    </footer>
  );
}
