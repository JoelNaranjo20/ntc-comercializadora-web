import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import api from '../../services/api';

const VALORES = [
  'Responder y actuar con agilidad.',
  'Formar un personal con sentido de liderazgo.',
  'Garantizar transparencia en cada proceso.',
  'Asumir la responsabilidad de cada servicio prestado.',
  'Respeto y trabajo en equipo.',
];

const HIGHLIGHTS = [
  {
    value: '3+', label: 'Países de Destino',
    detail: 'Presencia consolidada en mercados internacionales clave.',
  },
  {
    value: '100%', label: 'Garantía de Calidad',
    detail: 'Productos seleccionados bajo estrictos estándares internacionales.',
  },
  {
    value: '24/7', label: 'Atención Logística',
    detail: 'Respuesta rápida y compromiso continuo en cada etapa del servicio.',
  },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const reduce = useReducedMotion();
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    let active = true;
    api.get('/gallery')
      .then((res) => {
        if (active) setAllImages(res.images || []);
      })
      .catch((err) => {
        console.error('Error al cargar imágenes de Nosotros:', err);
      });
    return () => { active = false; };
  }, []);

  const nosotrosSectionImages = allImages.filter((img) => img.section === 'nosotros');
  const imgMission = allImages.find((img) => img.category === 'nosotros_quienes') || nosotrosSectionImages[0] || null;
  const imgValues = allImages.find((img) => img.category === 'nosotros_valores') || nosotrosSectionImages[1] || nosotrosSectionImages[0] || null;

  return (
    <section id="sobre-nosotros" className="py-20 lg:py-28 bg-white overflow-hidden font-sans">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24 sm:space-y-32"
        style={reduce ? {} : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s cubic-bezier(0.32,0.72,0,1), transform 0.7s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* ======================================================== */}
        {/* BLOCK 1: ¿QUIÉNES SOMOS? (Text Left, Organic Image Right) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Who We Are Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E4FA3]/10 text-[#1E4FA3] font-poppins text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2FAF9B]"></span>
              C.I. COMERCIALIZADORA DEL NORTE S & L S.A.S. &bull; NIT. 901.545.228-1
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 tracking-tight leading-tight">
              ¿Quiénes Somos?
            </h2>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-[54ch] mx-auto lg:mx-0 font-roboto uppercase tracking-wide">
              NTC es una empresa con experiencia en comercio internacional. Nos especializamos en importación y exportación de productos de alta calidad, garantizando la satisfacción de nuestros clientes.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[#2FAF9B] font-poppins font-extrabold text-base sm:text-lg uppercase tracking-wider bg-[#2FAF9B]/10 px-4 py-2 rounded-xl border border-[#2FAF9B]/20">
                &ldquo;Nuestra prioridad eres tú..&rdquo;
              </span>
            </div>
          </div>

          {/* Right Column: Organic Blob Image 1 */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs lg:max-w-sm aspect-square">
              {/* Background Decorative Glow */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-[#1E4FA3]/15 to-[#2FAF9B]/20 transform scale-105 translate-x-3 translate-y-3"
                style={{
                  borderRadius: '40% 60% 70% 30% / 50% 60% 30% 50%',
                }}
              />

              {/* Main Image Blob Mask Container */}
              <div
                className="relative w-full h-full overflow-hidden shadow-2xl bg-slate-900 border-4 border-white transition-transform duration-700 hover:scale-[1.02]"
                style={{
                  borderRadius: '55% 45% 42% 58% / 58% 42% 58% 42%',
                }}
              >
                {imgMission ? (
                  <img
                    src={imgMission.url}
                    alt={imgMission.title || 'NTC Comercializadora del Norte'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E4FA3] to-[#102E66] p-8 flex flex-col items-center justify-center text-white text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18" />
                      </svg>
                    </div>
                    <h3 className="font-poppins font-bold text-lg mb-1">NTC Comercializadora</h3>
                    <p className="text-xs text-white/80 font-roboto max-w-xs">
                      C.I. COMERCIALIZADORA DEL NORTE S & L S.A.S.
                    </p>
                    <p className="text-[11px] text-[#2FAF9B] font-semibold mt-2">
                      NIT. 901.545.228-1
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BLOCK 2: NUESTROS VALORES (Organic Image Left, Text Right) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Organic Blob Image 2 (Mirrored Blob Shape) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-xs lg:max-w-sm aspect-square">
              {/* Background Decorative Glow (Mirrored Tint) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#2FAF9B]/20 to-[#1E4FA3]/15 transform scale-105 -translate-x-3 translate-y-3"
                style={{
                  borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                }}
              />

              {/* Main Image Blob Mask Container (Mirrored organic shape) */}
              <div
                className="relative w-full h-full overflow-hidden shadow-2xl bg-slate-900 border-4 border-white transition-transform duration-700 hover:scale-[1.02]"
                style={{
                  borderRadius: '42% 58% 58% 42% / 55% 45% 55% 45%',
                }}
              >
                {imgValues ? (
                  <img
                    src={imgValues.url}
                    alt={imgValues.title || 'Nuestros Valores NTC'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-bl from-[#2FAF9B] to-[#163E85] p-8 flex flex-col items-center justify-center text-white text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <h3 className="font-poppins font-bold text-lg mb-1">Nuestros Valores</h3>
                    <p className="text-xs text-white/80 font-roboto max-w-xs">
                      Principios de excelencia, liderazgo y compromiso total.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Values List */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2FAF9B]/10 text-[#2FAF9B] font-poppins text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1E4FA3]"></span>
              Principios que nos definen
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-gray-900 tracking-tight leading-tight">
              Nuestros Valores
            </h2>

            {/* List of 5 Exact Values with SVG Checkmarks */}
            <div className="space-y-3.5 pt-2">
              {VALORES.map((valText, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-white hover:border-[#2FAF9B]/40 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#2FAF9B]/10 text-[#2FAF9B] flex items-center justify-center shrink-0 group-hover:bg-[#2FAF9B] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base font-roboto font-medium leading-snug">
                    {valText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BLOCK 3: STATS HIGHLIGHTS BAR                             */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {HIGHLIGHTS.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-poppins font-extrabold text-[#2FAF9B] tracking-tight">{item.value}</span>
                <span className="text-base font-poppins font-semibold text-gray-900">{item.label}</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm font-roboto leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
