import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { submitContact } from '../../services/contactService';

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const reduce = useReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setFieldErrors({}); setServerError(''); setStatus('loading');
    try {
      await submitContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      if (err.validationErrors) { setFieldErrors(err.validationErrors); setStatus('idle'); }
      else { setServerError(err.message || 'Error al enviar el mensaje.'); setStatus('error'); }
    }
  };

  return (
    <section id="contacto" className="relative min-h-[100dvh] flex items-center py-16 lg:py-24 bg-slate-950 overflow-hidden">
      {/* Background Image Layer with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/back.png"
          alt="Fondo Sección de Contacto NTC"
          className="w-full h-full object-cover object-center"
        />
        {/* Light subtle overlay so back.png is bright and clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/15" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full"
        style={reduce ? {} : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s cubic-bezier(0.32,0.72,0,1), transform 0.7s cubic-bezier(0.32,0.72,0,1)',
        }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md font-poppins text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#2FAF9B]"></span>
                Contáctanos
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-white tracking-tight leading-tight">
                Hablemos de su<br />próximo envío
              </h2>
            </div>
            <p className="text-gray-200 text-base sm:text-lg font-roboto leading-relaxed max-w-[38ch]">
              Complete el formulario y nuestro equipo se pondrá en contacto a la brevedad.
            </p>

            {/* Official Contact Info Box */}
            <div className="space-y-4 pt-6 border-t border-white/15 font-roboto">
              {/* Address */}
              <div className="flex items-start gap-3.5 text-sm text-gray-200 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#2FAF9B]/20 text-[#2FAF9B] flex items-center justify-center shrink-0 mt-0.5 border border-[#2FAF9B]/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-xs uppercase tracking-wider font-poppins">Dirección</p>
                  <p className="text-xs text-gray-200 leading-snug">Carrera 54 # 72 - 80 Oficina # 33-41 Edificio Centro</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 text-sm text-gray-200 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#1E4FA3]/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-xs uppercase tracking-wider font-poppins">Correo Electrónico</p>
                  <a href="mailto:ntcdelnorte@gmail.com" className="text-xs text-blue-300 hover:underline break-all">
                    ntcdelnorte@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5 text-sm text-gray-200 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#2FAF9B]/20 text-[#2FAF9B] flex items-center justify-center shrink-0 mt-0.5 border border-[#2FAF9B]/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.4 1.867a11.954 11.954 0 01-5.407-5.407l1.867-1.4c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-xs uppercase tracking-wider font-poppins">Teléfono / WhatsApp</p>
                  <a href="https://wa.me/573113351064" target="_blank" rel="noopener noreferrer" className="text-xs text-[#2FAF9B] font-semibold hover:underline">
                    311 3351064
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <div className="lg:col-span-3">
            {status === 'success' && (
              <motion.div className="bg-white/95 backdrop-blur-md border border-emerald-200 rounded-2xl p-10 text-center shadow-2xl"
                initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}>
                <div className="mx-auto w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-poppins font-semibold text-emerald-800 mb-2">Mensaje enviado</h3>
                <p className="text-emerald-700 mb-6 font-roboto">Nos pondremos en contacto con usted a la brevedad.</p>
                <button onClick={() => setStatus('idle')}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4 font-roboto">
                  Enviar otro mensaje
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div className="bg-white/95 backdrop-blur-md border border-red-200 rounded-2xl p-6 mb-6 shadow-2xl"
                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-red-700 text-sm font-roboto">{serverError}</p>
                <button onClick={() => setStatus('idle')}
                  className="mt-2 text-xs font-medium text-red-600 hover:text-red-800 underline underline-offset-4 font-roboto">
                  Intentar de nuevo
                </button>
              </motion.div>
            )}

            {(status === 'idle' || status === 'loading') && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 p-6 sm:p-8 space-y-5 shadow-2xl">
                  <Input label="Nombre completo" name="name" value={formData.name} onChange={handleChange} error={fieldErrors.name} placeholder="Ingrese su nombre completo" required />
                  <Input label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} error={fieldErrors.email} placeholder="su@correo.com" required />
                  <Input label="Mensaje" name="message" type="textarea" value={formData.message} onChange={handleChange} error={fieldErrors.message} placeholder="Cuéntenos cómo podemos ayudarle..." rows={5} required />
                  <input type="text" name="_website" tabIndex={-1} autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
                  <Button type="submit" variant="secondary" size="lg" className="w-full" loading={status === 'loading'}>
                    {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
