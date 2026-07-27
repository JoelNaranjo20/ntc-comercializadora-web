import React, { useState, useEffect, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import {
  uploadImagesBatch,
  uploadImage,
  replaceImage,
  deleteImage,
  reorderImages,
  updateImageMeta,
  bulkUpdateImages,
  bulkDeleteImages,
  updateSectionMeta,
} from '../../services/adminService';
import api from '../../services/api';

const SECTIONS = [
  { value: '', label: 'Todas las secciones' },
  { value: 'galeria', label: 'Galería' },
  { value: 'hero', label: 'Hero' },
  { value: 'nosotros', label: 'Nosotros' },
  { value: 'productos', label: 'Productos' },
];

const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  { value: 'platano', label: '🍌 Plátanos' },
  { value: 'papas', label: '🥔 Papas' },
  { value: 'cebolla', label: '🧅 Cebolla' },
  { value: 'limon', label: '🍋 Limones' },
  { value: 'name', label: '🥔 Ñame' },
  { value: 'tierra', label: '🌱 Campo / Sobre la tierra' },
  { value: 'gif', label: '🎬 GIFs Animados' },
  { value: 'nosotros_quienes', label: '🏢 Nosotros: ¿Quiénes Somos?' },
  { value: 'nosotros_valores', label: '⭐ Nosotros: Nuestros Valores' },
  { value: 'general', label: '📦 General' },
];

const LAYOUTS = [
  { value: '', label: 'Todos los formatos' },
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carrusel' },
];

const SECTION_OPTIONS = SECTIONS.filter((s) => s.value !== '');
const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.value !== '');
const LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Cuadrícula (Grid)' },
  { value: 'carousel', label: 'Carrusel' },
];

const ASPECT_OPTIONS = [
  { value: '4/3', label: 'Estándar 4:3 (Rectangular)' },
  { value: '1/1', label: 'Cuadrado 1:1' },
  { value: '16/9', label: 'Panorámico 16:9' },
  { value: '3/4', label: 'Vertical 3:4' },
];

const POSITION_OPTIONS = [
  { value: 'center', label: 'Centrado (Center)' },
  { value: 'top', label: 'Enfocar Arriba (Top)' },
  { value: 'bottom', label: 'Enfocar Abajo (Bottom)' },
  { value: 'left', label: '👈 Al lado del texto (Izquierda)' },
  { value: 'right', label: '👉 Al lado del texto (Derecha)' },
];

const EFFECT_OPTIONS = [
  { value: 'zoom-gradient', label: 'Zoom + Degradado' },
  { value: 'zoom', label: 'Solo Zoom al Hover' },
  { value: 'gradient', label: 'Solo Degradado' },
  { value: 'none', label: 'Sin efectos' },
];

const COLUMN_SIZE_OPTIONS = [
  { value: 2, label: '2 Columnas (Grandes)' },
  { value: 3, label: '3 Columnas (Medianas - Estándar)' },
  { value: 4, label: '4 Columnas (Pequeñas)' },
  { value: 5, label: '5 Columnas (Muy Pequeñas)' },
  { value: 6, label: '6 Columnas (Miniaturas)' },
];

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterSection, setFilterSection] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLayout, setFilterLayout] = useState('');
  const [groupBy, setGroupBy] = useState('category'); // 'category' | 'section' | 'none'
  const [view, setView] = useState('library'); // 'library' | 'upload'

  const fetchImages = useCallback(async () => {
    try {
      const data = await api.get('/gallery');
      setImages(data.images || []);
      setSections(data.sections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ----------- Multi-Select Handlers -----------

  const toggleSelectId = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredImages.map((img) => img.id));
    }
  };

  const selectEntireGroup = (groupImages) => {
    const groupIds = groupImages.map((img) => img.id);
    const allSelected = groupIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...groupIds])));
    }
  };

  // ----------- Bulk Operations -----------

  const handleBulkChangeCategory = async (targetCategory) => {
    if (!targetCategory || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { category: targetCategory });
      showMessage('success', `Se movieron ${selectedIds.length} imagen(es) a la categoría seleccionada.`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar categoría.');
    }
  };

  const handleBulkChangeSection = async (targetSection) => {
    if (!targetSection || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { section: targetSection });
      showMessage('success', `Se movieron ${selectedIds.length} imagen(es) a "${targetSection}".`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar grupo.');
    }
  };

  const handleBulkChangeLayout = async (targetLayout) => {
    if (!targetLayout || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { layoutFormat: targetLayout });
      showMessage('success', `Se cambió el formato a ${targetLayout === 'carousel' ? 'Carrusel' : 'Grid'} en ${selectedIds.length} imagen(es).`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar grupo.');
    }
  };

  const handleBulkChangeAspect = async (targetAspect) => {
    if (!targetAspect || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { aspectRatio: targetAspect });
      showMessage('success', `Se cambió la proporción a ${targetAspect} en ${selectedIds.length} imagen(es).`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar grupo.');
    }
  };

  const handleBulkChangeColumns = async (targetCols) => {
    if (!targetCols || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { gridColumns: Number(targetCols) });
      showMessage('success', `Se ajustó el tamaño (${targetCols} columnas) en ${selectedIds.length} imagen(es).`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al cambiar tamaño de grupo.');
    }
  };

  const handleBulkChangeEffect = async (targetEffect) => {
    if (!targetEffect || selectedIds.length === 0) return;
    try {
      await bulkUpdateImages(selectedIds, { effect: targetEffect });
      showMessage('success', `Se aplicó el efecto visual en ${selectedIds.length} imagen(es).`);
      setSelectedIds([]);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar grupo.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`¿Está seguro de eliminar estas ${selectedIds.length} imágenes seleccionadas?`)) return;
    try {
      await bulkDeleteImages(selectedIds);
      showMessage('success', `Se eliminaron ${selectedIds.length} imágenes.`);
      setSelectedIds([]);
      setSelectedImage(null);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al eliminar grupo.');
    }
  };

  // ----------- Single Upload / Actions Handlers -----------

  const handleBatchUpload = async (files, meta) => {
    setUploading(true);
    try {
      if (files.length === 1) {
        await uploadImage(files[0], meta);
        showMessage('success', 'Imagen subida exitosamente.');
      } else {
        const result = await uploadImagesBatch(files, meta);
        showMessage('success', `${result.uploaded} imagen(es) subida(s)${result.failed > 0 ? `, ${result.failed} fallida(s)` : ''}.`);
      }
      await fetchImages();
      setView('library');
    } catch (err) {
      showMessage('error', err.message || 'Error al subir.');
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (id, file) => {
    try {
      await replaceImage(id, file);
      showMessage('success', 'Imagen reemplazada.');
      await fetchImages();
      setSelectedImage(null);
    } catch (err) {
      showMessage('error', err.message || 'Error al reemplazar.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta imagen?')) return;
    try {
      await deleteImage(id);
      showMessage('success', 'Imagen eliminada.');
      setSelectedImage(null);
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error al eliminar.');
    }
  };

  const handleUpdateMeta = async (id, meta) => {
    try {
      await updateImageMeta(id, meta);
      showMessage('success', 'Metadatos actualizados.');
      await fetchImages();
      if (selectedImage?.id === id) {
        setSelectedImage((prev) => ({ ...prev, ...meta }));
      }
    } catch (err) {
      showMessage('error', err.message || 'Error al actualizar.');
    }
  };

  // ----------- Drag & Drop Reorder -----------

  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const reordered = [...images];
    const a = reordered.findIndex((img) => img.id === dragId);
    const b = reordered.findIndex((img) => img.id === targetId);
    if (a === -1 || b === -1) return;
    const [d] = reordered.splice(a, 1);
    reordered.splice(b, 0, d);
    setImages(reordered);
    setDragId(null);
    reorderImages(reordered.map((img) => img.id)).catch(() => {
      showMessage('error', 'Error al reordenar.');
      fetchImages();
    });
  };

  // ----------- Filtering & Grouping -----------

  const filteredImages = images.filter((img) => {
    if (filterSection && img.section !== filterSection) return false;
    if (filterCategory && (img.category || 'general') !== filterCategory) return false;
    if (filterLayout && img.layoutFormat !== filterLayout) return false;
    return true;
  });

  const sectionMap = React.useMemo(() => {
    const map = {};
    sections.forEach((s) => { map[s.id] = s; });
    return map;
  }, [sections]);

  // Group images dynamically by Category or Section
  const groupedImages = React.useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: 'Todas las imágenes', images: filteredImages }];
    }

    const groups = {};
    filteredImages.forEach((img) => {
      let key = 'general';
      let title = '📦 General';

      if (groupBy === 'category') {
        key = img.category || (img.mimeType === 'image/gif' ? 'gif' : 'general');
        const catObj = CATEGORIES.find((c) => c.value === key);
        title = sectionMap[key]?.title || (catObj ? catObj.label : `🏷️ ${key}`);
      } else if (groupBy === 'section') {
        key = img.section || 'galeria';
        const secObj = SECTIONS.find((s) => s.value === key);
        title = sectionMap[key]?.title || (secObj ? `📁 Sección: ${secObj.label}` : `📁 ${key}`);
      }

      if (!groups[key]) {
        groups[key] = { key, title, images: [], layoutFormat: sectionMap[key]?.layoutFormat || img.layoutFormat || 'grid' };
      }
      groups[key].images.push(img);
      if (img.layoutFormat === 'carousel') groups[key].layoutFormat = 'carousel';
    });

    return Object.values(groups);
  }, [filteredImages, groupBy, sectionMap]);

  // ----------- Render -----------

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const SECTION_TABS = [
    { value: '', label: 'Todas las Secciones' },
    { value: 'nosotros', label: 'Nosotros (Información Corporativa)' },
    { value: 'hero', label: 'Hero / Portada' },
    { value: 'galeria', label: 'Galería' },
    { value: 'productos', label: 'Productos' },
  ];

  const nosotrosImg = images.find((img) => img.section === 'nosotros');

  const handleSetNosotrosAlignment = async (pos) => {
    if (!nosotrosImg) return;
    try {
      await updateImageMeta(nosotrosImg.id, { objectPosition: pos });
      showMessage('success', 'Posición de imagen actualizada');
      await fetchImages();
    } catch (err) {
      showMessage('error', err.message || 'Error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Navigation Tabs Menu */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#1E4FA3]/5 border border-[#1E4FA3]/15 rounded-2xl overflow-x-auto">
        {SECTION_TABS.map((tab) => {
          const isActive = filterSection === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setFilterSection(tab.value);
                setSelectedIds([]);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-poppins font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1E4FA3] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.value && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-roboto ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {images.filter((img) => img.section === tab.value).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      

      {/* Special Contextual Banner for Section "NOSOTROS" */}
      {filterSection === 'nosotros' && (
        <div className="p-4 bg-gradient-to-r from-slate-900 via-[#1E4FA3]/90 to-slate-900 text-white rounded-2xl shadow-lg border border-slate-700 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2FAF9B]/20 text-[#2FAF9B] text-[11px] font-poppins font-semibold uppercase tracking-wider">
                <span>🏢 Empresa NTC - Gestión de Imágenes y GIFs de Nosotros</span>
              </div>
              <h3 className="text-lg font-poppins font-bold">Gestión de la Sección NOSOTROS</h3>
              <p className="text-xs text-gray-300 font-roboto max-w-xl">
                Puedes subir o asignar imágenes o GIFs por separado para los bloques <strong>¿Quiénes Somos?</strong> y <strong>Nuestros Valores</strong>. Al subirlas, también aparecerán como nuevas secciones organizadas en la Galería Pública.
              </p>
            </div>

            <button
              onClick={() => setView('upload')}
              className="px-3.5 py-2 rounded-xl bg-[#2FAF9B] hover:bg-[#279d8b] text-white font-medium text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              + Subir Nueva Imagen / GIF para Nosotros
            </button>
          </div>

          {/* Active Image Cards for ¿Quiénes Somos? and Nuestros Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-roboto">
            {/* Card 1: ¿Quiénes Somos? */}
            {(() => {
              const imgQuienes = images.find((img) => img.category === 'nosotros_quienes') || images.find((img) => img.section === 'nosotros');
              return (
                <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {imgQuienes ? (
                      <img
                        src={imgQuienes.thumbnailUrl || imgQuienes.url}
                        alt="¿Quiénes Somos?"
                        className="w-12 h-12 rounded-lg object-cover border border-white/30 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 text-gray-400 flex items-center justify-center shrink-0">🏢</div>
                    )}
                    <div>
                      <span className="font-bold text-white block">1. Bloque: ¿Quiénes Somos?</span>
                      <span className="text-gray-300 text-[11px] block truncate max-w-[200px]">
                        {imgQuienes ? (imgQuienes.originalName || 'Imagen asignada') : 'Sin imagen específica'}
                      </span>
                      {imgQuienes?.mimeType === 'image/gif' && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-[#2FAF9B] text-white text-[9px] font-bold">GIF</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setView('upload')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] transition-colors shrink-0"
                  >
                    {imgQuienes ? 'Cambiar' : 'Asignar'}
                  </button>
                </div>
              );
            })()}

            {/* Card 2: Nuestros Valores */}
            {(() => {
              const imgVal = images.find((img) => img.category === 'nosotros_valores') || images.filter((img) => img.section === 'nosotros')[1];
              return (
                <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {imgVal ? (
                      <img
                        src={imgVal.thumbnailUrl || imgVal.url}
                        alt="Nuestros Valores"
                        className="w-12 h-12 rounded-lg object-cover border border-white/30 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 text-gray-400 flex items-center justify-center shrink-0">⭐</div>
                    )}
                    <div>
                      <span className="font-bold text-white block">2. Bloque: Nuestros Valores</span>
                      <span className="text-gray-300 text-[11px] block truncate max-w-[200px]">
                        {imgVal ? (imgVal.originalName || 'Imagen asignada') : 'Sin imagen específica'}
                      </span>
                      {imgVal?.mimeType === 'image/gif' && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-[#2FAF9B] text-white text-[9px] font-bold">GIF</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setView('upload')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] transition-colors shrink-0"
                  >
                    {imgVal ? 'Cambiar' : 'Asignar'}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Message Toast */}
      {message && (
        <div className={`p-3 rounded-xl text-sm font-roboto ${
          message.type === 'success'
            ? 'bg-[#2FAF9B]/10 text-[#2FAF9B] border border-[#2FAF9B]/20'
            : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* Top Toolbar — WordPress Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <button
            onClick={() => setView('library')}
            className={`px-3 py-2 rounded-lg text-xs font-roboto transition-all ${
              view === 'library'
                ? 'bg-[#1E4FA3] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Biblioteca
          </button>
          <button
            onClick={() => setView('upload')}
            className={`px-3 py-2 rounded-lg text-xs font-roboto transition-all ${
              view === 'upload'
                ? 'bg-[#1E4FA3] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Subir imágenes / GIFs
          </button>
        </div>

        {view === 'library' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Group By Selector */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() => setGroupBy('category')}
                className={`px-2 py-1 text-[11px] font-roboto rounded ${groupBy === 'category' ? 'bg-[#2FAF9B] text-white' : 'text-gray-600'}`}
              >
                Por Categoría
              </button>
              <button
                onClick={() => setGroupBy('section')}
                className={`px-2 py-1 text-[11px] font-roboto rounded ${groupBy === 'section' ? 'bg-[#2FAF9B] text-white' : 'text-gray-600'}`}
              >
                Por Sección
              </button>
              <button
                onClick={() => setGroupBy('none')}
                className={`px-2 py-1 text-[11px] font-roboto rounded ${groupBy === 'none' ? 'bg-[#2FAF9B] text-white' : 'text-gray-600'}`}
              >
                Lista continua
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setSelectedIds([]); }}
              className="px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={filterSection}
              onChange={(e) => { setFilterSection(e.target.value); setSelectedIds([]); }}
              className="px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30"
            >
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Select All Toggle */}
            <button
              onClick={toggleSelectAll}
              className="px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white font-roboto hover:bg-gray-100 transition-colors"
            >
              {selectedIds.length === filteredImages.length && filteredImages.length > 0
                ? 'Desmarcar todo'
                : 'Seleccionar todo'}
            </button>

            {/* Image Count Badge */}
            <span className="px-2.5 py-1.5 rounded-full bg-[#1E4FA3]/10 text-[#1E4FA3] text-[10px] font-medium font-roboto">
              {filteredImages.length} imagen{filteredImages.length !== 1 ? 'es' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Bulk Action Bar (Visible when 1+ images are checked) */}
      {view === 'library' && selectedIds.length > 0 && (
        <div className="p-3 bg-[#1E4FA3]/5 border border-[#1E4FA3]/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1E4FA3] text-white text-[11px] font-bold flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-medium text-[#1E4FA3] font-roboto">
                Edición masiva de grupo ({selectedIds.length} seleccionadas)
              </span>
            </div>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg text-xs font-roboto bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Eliminar grupo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 border-t border-[#1E4FA3]/10">
            {/* Bulk Category Move */}
            <select
              onChange={(e) => { handleBulkChangeCategory(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Categoría grupo...</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Bulk Section Move */}
            <select
              onChange={(e) => { handleBulkChangeSection(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Sección grupo...</option>
              {SECTION_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Bulk Size / Grid Columns */}
            <select
              onChange={(e) => { handleBulkChangeColumns(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Tamaño / Cols grupo...</option>
              {COLUMN_SIZE_OPTIONS.map((col) => (
                <option key={col.value} value={col.value}>{col.label}</option>
              ))}
            </select>

            {/* Bulk Layout Change */}
            <select
              onChange={(e) => { handleBulkChangeLayout(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Formato grupo...</option>
              {LAYOUT_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>

            {/* Bulk Aspect Ratio */}
            <select
              onChange={(e) => { handleBulkChangeAspect(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Proporción grupo...</option>
              {ASPECT_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>

            {/* Bulk Effect */}
            <select
              onChange={(e) => { handleBulkChangeEffect(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="px-2 py-1.5 rounded-lg border border-[#1E4FA3]/30 text-xs text-[#1E4FA3] bg-white font-roboto font-medium focus:outline-none"
            >
              <option value="" disabled>Efecto grupo...</option>
              {EFFECT_OPTIONS.map((ef) => (
                <option key={ef.value} value={ef.value}>{ef.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Upload View */}
      {view === 'upload' && (
        <ImageUploader onUpload={handleBatchUpload} uploading={uploading} />
      )}

      {/* Library View — Grouped Mode */}
      {view === 'library' && (
        <div className="flex gap-4">
          <div className={`flex-1 ${selectedImage ? 'max-w-[calc(100%-280px)]' : ''} space-y-6`}>
            {filteredImages.length > 0 ? (
              groupedImages.map((group) => {
                const groupIds = group.images.map((img) => img.id);
                const isGroupAllSelected = groupIds.length > 0 && groupIds.every((id) => selectedIds.includes(id));
                const currentGroupCols = group.images[0]?.gridColumns || 3;

                return (
                  <div key={group.key} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
                    {/* Group Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-800 font-roboto">{group.title}</h3>
                        <button
                          onClick={async () => {
                            const newTitle = window.prompt(`Cambiar título visible para el grupo "${group.title}":`, group.title);
                            if (newTitle && newTitle.trim()) {
                              try {
                                await updateSectionMeta(group.key, { title: newTitle.trim() });
                                showMessage('success', `Título de grupo actualizado a: "${newTitle.trim()}"`);
                                await fetchImages();
                              } catch (err) {
                                showMessage('error', err.message || 'Error al actualizar título del grupo.');
                              }
                            }
                          }}
                          className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-roboto transition-colors flex items-center gap-1"
                          title="Editar título amigable de este grupo"
                        >
                          ✏️ Editar título
                        </button>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-roboto">
                          {group.images.length} {group.layoutFormat === 'carousel' ? 'historias' : 'fotos'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Group Layout Switcher: Carrusel 3D vs Grilla */}
                        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px] font-roboto">
                          <button
                            onClick={async () => {
                              await bulkUpdateImages(groupIds, { layoutFormat: 'carousel' });
                              await updateSectionMeta(group.key, { layoutFormat: 'carousel' });
                              showMessage('success', `Grupo "${group.title}" cambiado a Carrusel 3D Coverflow.`);
                              await fetchImages();
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                              group.layoutFormat === 'carousel'
                                ? 'bg-[#1E4FA3] text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            🎠 Carrusel 3D
                          </button>
                          <button
                            onClick={async () => {
                              await bulkUpdateImages(groupIds, { layoutFormat: 'grid' });
                              await updateSectionMeta(group.key, { layoutFormat: 'grid' });
                              showMessage('success', `Grupo "${group.title}" cambiado a Grilla de fotos.`);
                              await fetchImages();
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                              group.layoutFormat !== 'carousel'
                                ? 'bg-[#2FAF9B] text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            🖼️ Grilla
                          </button>
                        </div>

                        {/* Group Column Size Direct Controller (only if grid) */}
                        {group.layoutFormat !== 'carousel' && (
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                            <span className="text-[11px] text-gray-500 font-roboto">Cols:</span>
                            <select
                              value={currentGroupCols}
                              onChange={async (e) => {
                                const newCols = Number(e.target.value);
                                await bulkUpdateImages(groupIds, { gridColumns: newCols });
                                showMessage('success', `Tamaño ajustado a ${newCols} columnas.`);
                                await fetchImages();
                              }}
                              className="bg-white text-xs font-roboto text-gray-700 rounded border border-gray-200 px-1.5 py-0.5 focus:outline-none"
                            >
                              {COLUMN_SIZE_OPTIONS.map((c) => (
                                <option key={c.value} value={c.value}>{c.value} cols</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <button
                          onClick={() => selectEntireGroup(group.images)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-roboto transition-all flex items-center gap-1.5 border ${
                            isGroupAllSelected
                              ? 'bg-[#2FAF9B] text-white border-[#2FAF9B]'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {isGroupAllSelected ? 'Seleccionado' : 'Seleccionar grupo'}
                        </button>
                      </div>
                    </div>

                    {/* Group Images Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {group.images.map((image) => {
                        const isChecked = selectedIds.includes(image.id);
                        const isSelected = selectedImage?.id === image.id;

                        return (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={() => handleDragStart(image.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(image.id)}
                            onClick={() => setSelectedImage(image)}
                            className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                              isChecked
                                ? 'border-[#2FAF9B] ring-2 ring-[#2FAF9B]/20 bg-emerald-50/20'
                                : isSelected
                                ? 'border-[#1E4FA3] ring-2 ring-[#1E4FA3]/20'
                                : dragId === image.id
                                ? 'opacity-40 border-[#2FAF9B]'
                                : 'border-transparent hover:border-gray-200'
                            }`}
                          >
                            <div className="aspect-square bg-gray-50">
                              <img
                                src={image.thumbnailUrl || image.url}
                                alt={image.originalName || 'Imagen'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  if (e.target.src !== image.url && image.url) {
                                    e.target.src = image.url;
                                  }
                                }}
                              />
                            </div>

                            {/* Checkbox Multi-Select Toggle */}
                            <div
                              onClick={(e) => toggleSelectId(image.id, e)}
                              className={`absolute top-2 left-2 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                isChecked
                                  ? 'bg-[#2FAF9B] text-white shadow-sm'
                                  : 'bg-black/30 border border-white/60 text-transparent group-hover:bg-black/50'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-8 left-2 flex flex-col gap-1 pointer-events-none">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#1E4FA3]/80 text-white backdrop-blur-sm font-roboto uppercase">
                                {image.section || 'galeria'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium backdrop-blur-sm font-roboto uppercase ${
                                image.layoutFormat === 'carousel'
                                  ? 'bg-[#2FAF9B]/80 text-white'
                                  : 'bg-black/40 text-white'
                              }`}>
                                {image.layoutFormat === 'carousel' ? 'Carrusel' : `${image.gridColumns || 3} cols`}
                              </span>
                            </div>

                            {/* Selection Highlight */}
                            {isSelected && !isChecked && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1E4FA3] flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-[10px] truncate font-roboto">{image.originalName || `Imagen`}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-50 text-gray-200 flex items-center justify-center mb-4 border border-gray-100">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-roboto">
                  {images.length === 0
                    ? 'No hay imágenes. Use "Subir imágenes / GIFs" para agregar.'
                    : 'No se encontraron imágenes con los filtros seleccionados.'}
                </p>
              </div>
            )}
          </div>

          {/* Side Panel — Inspector (WordPress style) */}
          {selectedImage && (
            <ImageInspector
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onDelete={handleDelete}
              onReplace={handleReplace}
              onUpdateMeta={handleUpdateMeta}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// Image Inspector Panel (WordPress Style)
// ========================================

function ImageInspector({ image, onClose, onDelete, onReplace, onUpdateMeta }) {
  const [section, setSection] = useState(image.section || 'galeria');
  const [category, setCategory] = useState(image.category || 'general');
  const [layoutFormat, setLayoutFormat] = useState(image.layoutFormat || 'grid');
  const [aspectRatio, setAspectRatio] = useState(image.aspectRatio || '4/3');
  const [objectPosition, setObjectPosition] = useState(image.objectPosition || 'center');
  const [effect, setEffect] = useState(image.effect || 'zoom-gradient');
  const [gridColumns, setGridColumns] = useState(image.gridColumns || 3);
  const [title, setTitle] = useState(image.title || '');
  const replaceRef = React.useRef(null);

  useEffect(() => {
    setSection(image.section || 'galeria');
    setCategory(image.category || 'general');
    setLayoutFormat(image.layoutFormat || 'grid');
    setAspectRatio(image.aspectRatio || '4/3');
    setObjectPosition(image.objectPosition || 'center');
    setEffect(image.effect || 'zoom-gradient');
    setGridColumns(image.gridColumns || 3);
    setTitle(image.title || '');
  }, [image.id]);

  const hasChanges =
    section !== (image.section || 'galeria') ||
    category !== (image.category || 'general') ||
    layoutFormat !== (image.layoutFormat || 'grid') ||
    aspectRatio !== (image.aspectRatio || '4/3') ||
    objectPosition !== (image.objectPosition || 'center') ||
    effect !== (image.effect || 'zoom-gradient') ||
    gridColumns !== (image.gridColumns || 3) ||
    title !== (image.title || '');

  const handleSave = () => {
    onUpdateMeta(image.id, {
      section,
      category,
      layoutFormat,
      aspectRatio,
      objectPosition,
      effect,
      gridColumns,
      title,
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return dateStr; }
  };

  const SECTION_OPTIONS = [
    { value: 'galeria', label: 'Galería' },
    { value: 'hero', label: 'Hero' },
    { value: 'nosotros', label: 'Nosotros' },
    { value: 'productos', label: 'Productos' },
  ];

  const CATEGORY_OPTIONS = [
    { value: 'general', label: 'General' },
    { value: 'platano', label: '🍌 Plátanos' },
    { value: 'papas', label: '🥔 Papas' },
    { value: 'cebolla', label: '🧅 Cebolla' },
    { value: 'limon', label: '🍋 Limones' },
    { value: 'name', label: '🥔 Ñame' },
    { value: 'tierra', label: '🌱 Campo / Sobre la tierra' },
    { value: 'gif', label: '🎬 GIFs Animados' },
  ];

  const LAYOUT_OPTIONS = [
    { value: 'grid', label: 'Cuadrícula (Grid)' },
    { value: 'carousel', label: 'Carrusel' },
  ];

  const COLUMN_OPTIONS = [
    { value: 2, label: '2 Cols (Muy Grandes)' },
    { value: 3, label: '3 Cols (Medianas)' },
    { value: 4, label: '4 Cols (Pequeñas)' },
    { value: 5, label: '5 Cols (Muy Pequeñas)' },
    { value: 6, label: '6 Cols (Miniaturas)' },
  ];

  return (
    <div className="w-[260px] flex-shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xs font-medium text-gray-700 font-roboto">Detalle de imagen</h3>
        <button onClick={onClose} className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div className="aspect-video bg-gray-50 border-b border-gray-100">
        <img
          src={image.url || image.thumbnailUrl}
          alt={image.originalName || 'Imagen'}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Metadata */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {/* File Info */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-roboto tracking-wide">Información</p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-500 font-roboto">Nombre</span>
              <span className="text-[11px] text-gray-700 font-roboto truncate max-w-[140px]">{image.originalName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-500 font-roboto">Tamaño</span>
              <span className="text-[11px] font-semibold text-emerald-600 font-roboto">{formatSize(image.sizeBytes)}</span>
            </div>
            {image.originalSizeBytes && image.originalSizeBytes > image.sizeBytes && (
              <div className="flex justify-between">
                <span className="text-[11px] text-gray-500 font-roboto">Original</span>
                <span className="text-[11px] text-gray-400 font-roboto line-through">{formatSize(image.originalSizeBytes)}</span>
              </div>
            )}
            {image.originalSizeBytes && image.originalSizeBytes > image.sizeBytes && (
              <div className="flex justify-between">
                <span className="text-[11px] text-gray-500 font-roboto">Reducción</span>
                <span className="text-[11px] font-bold text-emerald-600 font-roboto">
                  -{Math.round((1 - image.sizeBytes / image.originalSizeBytes) * 100)}%
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-500 font-roboto">Dimensiones</span>
              <span className="text-[11px] text-gray-700 font-roboto">{image.width && image.height ? `${image.width} × ${image.height}` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-500 font-roboto">Formato</span>
              <span className="text-[11px] text-gray-700 font-roboto">{image.mimeType || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-500 font-roboto">Subido</span>
              <span className="text-[11px] text-gray-700 font-roboto">{formatDate(image.createdAt)}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Editable Fields */}
        <div className="space-y-3">
          <p className="text-[10px] text-gray-400 uppercase font-roboto tracking-wide">Configuración</p>

          {/* Title */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Título / Alt</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título descriptivo..."
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Categoría / Producto</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Column Count / Photo Size */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Tamaño / Columnas por Fila</label>
            <select
              value={gridColumns}
              onChange={(e) => setGridColumns(Number(e.target.value))}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {COLUMN_OPTIONS.map((co) => (
                <option key={co.value} value={co.value}>{co.label}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Sección</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {SECTION_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Layout Format */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Visualización</label>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLayoutFormat(opt.value)}
                  className={`px-2 py-2 rounded-lg text-[11px] font-roboto transition-all border ${
                    layoutFormat === opt.value
                      ? 'bg-[#1E4FA3] text-white border-[#1E4FA3]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#1E4FA3]/30'
                  }`}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Proporción / Tamaño Marco</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {ASPECT_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Object Position / Alignment */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Alineación / Encuadre</label>
            <select
              value={objectPosition}
              onChange={(e) => setObjectPosition(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {POSITION_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Visual Effect */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1 font-roboto">Efecto Visual</label>
            <select
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white font-roboto focus:outline-none focus:ring-2 focus:ring-[#2FAF9B]/30 focus:border-[#2FAF9B] transition-all"
            >
              {EFFECT_OPTIONS.map((ef) => (
                <option key={ef.value} value={ef.value}>{ef.label}</option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-2 rounded-lg text-xs font-medium text-white bg-[#2FAF9B] hover:bg-[#28a08e] transition-all font-roboto"
            >
              Guardar cambios
            </button>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Actions */}
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-roboto tracking-wide">Acciones</p>
          <button
            onClick={() => replaceRef.current?.click()}
            className="w-full py-2 rounded-lg text-xs font-roboto border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Reemplazar imagen
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(image.id, f);
              e.target.value = '';
            }}
            className="hidden"
          />
          <button
            onClick={() => onDelete(image.id)}
            className="w-full py-2 rounded-lg text-xs font-roboto border border-red-200 text-red-500 hover:bg-red-50 transition-all"
          >
            Eliminar permanentemente
          </button>
        </div>
      </div>
    </div>
  );
}
