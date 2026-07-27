import React, { useState, useRef, useCallback } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 15; // Increased to 15 MB to support large GIFs
const MAX_FILES = 10;

const SECTIONS = [
  { value: 'galeria', label: 'Galería' },
  { value: 'hero', label: 'Hero' },
  { value: 'nosotros', label: 'Nosotros' },
  { value: 'productos', label: 'Productos' },
];

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'platano', label: '🍌 Plátanos' },
  { value: 'papas', label: '🥔 Papas' },
  { value: 'cebolla', label: '🧅 Cebolla' },
  { value: 'limon', label: '🍋 Limones' },
  { value: 'name', label: '🥔 Ñame' },
  { value: 'tierra', label: '🌱 Campo / Sobre la tierra' },
  { value: 'gif', label: '🎬 GIFs Animados' },
  { value: 'nosotros_quienes', label: '🏢 Nosotros: ¿Quiénes Somos?' },
  { value: 'nosotros_valores', label: '⭐ Nosotros: Nuestros Valores' },
];

const LAYOUTS = [
  { value: 'grid', label: 'Cuadrícula (Grid)' },
  { value: 'carousel', label: 'Carrusel' },
];

const ASPECT_OPTIONS = [
  { value: '4/3', label: 'Estándar 4:3 (Recomendado)' },
  { value: '1/1', label: 'Cuadrado 1:1' },
  { value: '16/9', label: 'Panorámico 16:9' },
  { value: '3/4', label: 'Vertical 3:4' },
];

const POSITION_OPTIONS = [
  { value: 'center', label: 'Centrado (Center)' },
  { value: 'top', label: 'Enfocar Arriba (Top)' },
  { value: 'bottom', label: 'Enfocar Abajo (Bottom)' },
];

const EFFECT_OPTIONS = [
  { value: 'zoom-gradient', label: 'Zoom + Degradado (Recomendado)' },
  { value: 'zoom', label: 'Solo Zoom al Hover' },
  { value: 'gradient', label: 'Solo Degradado Inferior' },
  { value: 'none', label: 'Sin efectos' },
];

const QUALITIES = [
  { value: 'low', label: 'Baja (~80% compresión)' },
  { value: 'medium', label: 'Media (~65% compresión - Recomendado)' },
  { value: 'high', label: 'Alta (~45% compresión)' },
  { value: 'max', label: 'Máxima (Calidad visual 95%)' },
];

const RESOLUTIONS = [
  { value: 800, label: '800px (Redes / Tarjetas)' },
  { value: 1200, label: '1200px (Estándar Web - Recomendado)' },
  { value: 1920, label: '1920px (Pantalla Completa HD)' },
  { value: 2560, label: '2560px (Ultra HD 2K)' },
];

export default function ImageUploader({ onUpload, uploading = false }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [section, setSection] = useState('galeria');
  const [category, setCategory] = useState('general');
  const [layoutFormat, setLayoutFormat] = useState('grid');
  const [aspectRatio, setAspectRatio] = useState('4/3');
  const [objectPosition, setObjectPosition] = useState('center');
  const [effect, setEffect] = useState('zoom-gradient');
  const [quality, setQuality] = useState('medium');
  const [maxWidth, setMaxWidth] = useState(1200);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFiles = useCallback((files) => {
    const valid = [];
    const errs = [];

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`${file.name}: Formato no permitido.`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`${file.name}: Excede ${MAX_SIZE_MB} MB.`);
      } else {
        valid.push(file);
      }
    });

    if (valid.length > MAX_FILES) {
      errs.push(`Máximo ${MAX_FILES} archivos a la vez. Se seleccionaron los primeros ${MAX_FILES}.`);
      return { valid: valid.slice(0, MAX_FILES), errs };
    }

    return { valid, errs };
  }, []);

  const handleAddFiles = useCallback((files) => {
    const { valid, errs } = validateFiles(files);
    setErrors(errs);
    setSelectedFiles((prev) => {
      const combined = [...prev, ...valid];
      return combined.slice(0, MAX_FILES);
    });
  }, [validateFiles]);

  const handleChange = (e) => {
    const files = e.target.files;
    if (files?.length) handleAddFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files?.length) handleAddFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;
    onUpload(selectedFiles, {
      section,
      category,
      layoutFormat,
      aspectRatio,
      objectPosition,
      effect,
      quality,
      maxWidth,
    });
    setSelectedFiles([]);
    setErrors([]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalOriginalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300
          ${dragOver ? 'border-[#2FAF9B] bg-[#2FAF9B]/5' : 'border-gray-200 hover:border-[#2FAF9B]/50 hover:bg-[#2FAF9B]/5'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#2FAF9B]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2FAF9B] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 font-roboto">Optimizando y subiendo imágenes...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-14 h-14 rounded-xl bg-[#1E4FA3]/5 text-[#1E4FA3] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700 font-roboto">Arrastre imágenes o GIFs aquí o haga clic</p>
              <p className="text-xs text-gray-400 mt-1 font-roboto">JPG, PNG, WebP, GIF — Sombra hasta {MAX_SIZE_MB} MB por archivo — Hasta {MAX_FILES} archivos</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-600 font-roboto">{err}</p>
          ))}
        </div>
      )}

      {/* File Preview & Options */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 font-roboto">
                {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado{selectedFiles.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400 font-roboto">
                Peso original total: {formatSize(totalOriginalSize)}
              </p>
            </div>
            <button
              onClick={() => { setSelectedFiles([]); setErrors([]); }}
              className="text-xs text-red-500 hover:text-red-700 font-roboto transition-colors"
            >
              Limpiar todo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-white">
                <div className="aspect-square bg-gray-50">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="p-1.5">
                  <p className="text-[10px] text-gray-500 truncate font-roboto">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-roboto">{formatSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Categorización y Sección */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 font-roboto">Categoría / Producto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 font-roboto">Sección destino</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
              >
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 font-roboto">Formato de visualización</label>
              <select
                value={layoutFormat}
                onChange={(e) => setLayoutFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
              >
                {LAYOUTS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Aspect Ratio, Position & Effects Controls */}
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-gray-700 font-roboto block">Ajustes de Tamaño, Encuadre y Efectos Visuales</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1 font-roboto">Proporción (Aspect Ratio)</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30"
                >
                  {ASPECT_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1 font-roboto">Alineación / Encuadre</label>
                <select
                  value={objectPosition}
                  onChange={(e) => setObjectPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30"
                >
                  {POSITION_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1 font-roboto">Efecto Visual</label>
                <select
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30"
                >
                  {EFFECT_OPTIONS.map((ef) => (
                    <option key={ef.value} value={ef.value}>{ef.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compression & Optimization Controls */}
          <div className="p-4 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 border border-emerald-100 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2FAF9B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700 font-roboto">Ajustes de optimización de archivo (Sharp WebP)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1 font-roboto">Calidad de compresión WebP</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B]"
                >
                  {QUALITIES.map((q) => (
                    <option key={q.value} value={q.value}>{q.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1 font-roboto">Ancho máximo de imagen</label>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B]"
                >
                  {RESOLUTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleSubmit}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full py-3 rounded-xl text-sm font-medium text-white bg-[#1E4FA3] hover:bg-[#1a4590] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-roboto flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Optimizar y subir {selectedFiles.length} imagen{selectedFiles.length > 1 ? 'es' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
