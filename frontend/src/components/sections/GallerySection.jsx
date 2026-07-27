import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import api from '../../services/api';

const CATEGORY_NAMES = {
  platano: '🍌 Plátanos',
  papas: '🥔 Papas',
  cebolla: '🧅 Cebolla',
  limon: '🍋 Limones',
  name: '🥔 Ñame',
  tierra: '🌱 Campo / Sobre la tierra',
  gif: '🎬 GIFs Animados',
  nosotros_quienes: '🏢 Nosotros: ¿Quiénes Somos?',
  nosotros_valores: '⭐ Nuestros Valores',
  general: '📦 Productos Generales',
};

const GRID_COL_CLASSES = {
  2: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
  5: 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5',
  6: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3',
};

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    api.get('/gallery').then((data) => {
      if (!cancelled) {
        setImages(data.images || []);
        setSections(data.sections || []);
        setLoading(false);
      }
    }).catch((err) => {
      if (!cancelled) { setError(err.message); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  // Map section/category metadata for quick title lookup
  const sectionTitleMap = React.useMemo(() => {
    const map = {};
    sections.forEach((s) => {
      map[s.id] = s.title;
    });
    return map;
  }, [sections]);

  // Group images by category cleanly (Only for section = 'galeria')
  const imageGroups = React.useMemo(() => {
    const groups = {};
    const galeriaImages = images.filter((img) => !img.section || img.section === 'galeria');

    galeriaImages.forEach((img) => {
      const key = img.category || 'general';

      if (!groups[key]) {
        const customTitle = sectionTitleMap[key] || CATEGORY_NAMES[key] || (key === 'carousel' ? 'Carrusel Destacado' : `🏷️ ${key}`);
        groups[key] = {
          id: key,
          title: customTitle,
          layoutFormat: img.layoutFormat || 'grid',
          cols: img.gridColumns || 3,
          images: [],
        };
      }

      groups[key].images.push(img);
      if (img.layoutFormat === 'carousel') groups[key].layoutFormat = 'carousel';
      if (img.gridColumns && img.gridColumns > groups[key].cols) groups[key].cols = img.gridColumns;
    });

    // Order groups: carousels first, then grids
    return Object.values(groups).sort((a, b) => {
      if (a.layoutFormat === 'carousel' && b.layoutFormat !== 'carousel') return -1;
      if (a.layoutFormat !== 'carousel' && b.layoutFormat === 'carousel') return 1;
      return 0;
    });
  }, [images, sectionTitleMap]);

  return (
    <section id="galeria" className="min-h-[100dvh] flex items-center py-20 relative overflow-hidden bg-stone-50">
      {/* 30% Opacity Repeating Background Image Layer */}
      <div
        className="absolute inset-0 z-0 opacity-10 bg-repeat pointer-events-none"
        style={{
          backgroundImage: 'url(/back1.jpg)',
          backgroundRepeat: 'repeat',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full"
        style={reduce ? {} : {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s cubic-bezier(0.32,0.72,0,1), transform 0.7s cubic-bezier(0.32,0.72,0,1)',
        }}>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-navy-900 tracking-tight mb-5">
            Nuestro Trabajo<br />en Imágenes
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-[52ch] font-sans">
            Desde el campo hasta el envío, trabajamos con dedicación para llevar lo mejor a su mesa.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 text-gray-300 flex items-center justify-center mb-5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium font-sans">No se pudieron cargar las imágenes</p>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="text-center py-24">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white border border-gray-100 text-gray-200 flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium font-sans">Galería vacía</p>
            <p className="text-gray-300 text-sm mt-1 font-sans">Las imágenes que suba desde el panel aparecerán aquí.</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* RENDER ALL IMAGE GROUPS (CAROUSELS & GRIDS DYNAMICALLY) */}
        {/* ======================================================== */}
        {!loading && !error && imageGroups.length > 0 && (
          <div className="space-y-16">
            {imageGroups.map((group) => {
              const isCarousel = group.layoutFormat === 'carousel';
              const gridClass = GRID_COL_CLASSES[group.cols] || GRID_COL_CLASSES[3];

              if (isCarousel) {
                return (
                  <div key={group.id} className="space-y-4">
                    {/* Carousel Group Title */}
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <h3 className="text-xl sm:text-2xl font-poppins font-bold text-gray-900 flex items-center gap-2.5">
                        <span>{group.title}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1E4FA3]/10 text-[#1E4FA3] text-xs font-sans font-semibold">
                          {group.images.length} historias
                        </span>
                      </h3>
                    </div>
                    {/* 3D Coverflow Carousel Component */}
                    <GalleryCarousel images={group.images} />
                  </div>
                );
              }

              return (
                <div key={group.id} className="space-y-4">
                  {/* Category Title Header */}
                  <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-poppins font-semibold text-gray-800">
                        {group.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-xs font-sans font-medium">
                        {group.images.length} fotos
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Grid based on group columns */}
                  <div className={`grid ${gridClass}`}>
                    {group.images.map((image, index) => (
                      <LazyImageCard key={image.id} image={image} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// 3D Tilted Coverflow Carousel (Central Straight + Inward Tilted Sides)
// =========================================================================

function GalleryCarousel({ images }) {
  const scrollRef = useRef(null);
  const initialIndex = images.length > 1 ? 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.children[index];
    if (child) {
      const targetLeft = child.offsetLeft - (container.clientWidth - child.clientWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setActiveIndex(index);
    }
  }, []);

  // Sync scroll position with active card index
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Center on the 2nd card (index 1) on mount to show cards on both sides
  useEffect(() => {
    const startIndex = images.length > 1 ? 1 : 0;
    const timer = setTimeout(() => {
      scrollToIndex(startIndex);
    }, 200);
    return () => clearTimeout(timer);
  }, [images.length, scrollToIndex]);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % images.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, scrollToIndex]);

  const goNext = () => {
    setIsAutoPlaying(false);
    const next = (activeIndex + 1) % images.length;
    scrollToIndex(next);
  };

  const goPrev = () => {
    setIsAutoPlaying(false);
    const prev = (activeIndex - 1 + images.length) % images.length;
    scrollToIndex(prev);
  };

  return (
    <div className="relative group">
      {/* Overflow wrapper: allows rotated cards to extend vertically without clipping */}
      <div style={{ overflowX: 'hidden', overflowY: 'visible' }}>
        {/* Scrollable Cards Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="flex items-center justify-start gap-3 sm:gap-6 snap-x snap-mandatory scrollbar-hide py-16 px-[calc(50%-120px)] sm:px-[calc(50%-140px)] lg:px-[calc(50%-160px)]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowX: 'auto', overflowY: 'visible' }}
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            const isLeft = index < activeIndex;
            const isRight = index > activeIndex;
            const isGif = image.mimeType === 'image/gif';

            // 3D Tilt calculation (Inward tilt like the reference photo)
            let transformStyle = 'scale(1.06) rotate(0deg) translateZ(0px)';
            let zIndex = 30;
            let opacity = 'opacity-100';

            if (isLeft) {
              transformStyle = 'scale(0.88) rotate(-7deg) translateY(10px)';
              zIndex = 10;
              opacity = 'opacity-80 hover:opacity-95';
            } else if (isRight) {
              transformStyle = 'scale(0.88) rotate(7deg) translateY(10px)';
              zIndex = 10;
              opacity = 'opacity-80 hover:opacity-95';
            }

            return (
              <div
                key={image.id}
                onClick={() => { setIsAutoPlaying(false); scrollToIndex(index); }}
                style={{
                  transform: transformStyle,
                  zIndex: zIndex,
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
                }}
                className={`flex-shrink-0 cursor-pointer snap-center ${opacity} w-[240px] sm:w-[280px] lg:w-[320px]`}
              >
                {/* Card Frame — Vertical Aspect Ratio (3:4) */}
                <div className={`relative overflow-hidden rounded-[2.2rem] border-2 transition-all duration-500 bg-slate-900 ${isActive
                    ? 'border-[#2FAF9B] shadow-[0_25px_50px_-12px_rgba(47,175,155,0.35)] ring-4 ring-[#2FAF9B]/20'
                    : 'border-white/90 shadow-xl'
                  }`}>
                  {/* Vertical Image Aspect Ratio (3:4) */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
                    <LazyImage
                      src={image.url}
                      alt={image.title || image.originalName || `Historia ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* GIF badge only */}
                    {isGif && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2FAF9B] text-white shadow-md font-sans uppercase">
                          GIF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrow Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-800 shadow-2xl border border-gray-100 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-40 opacity-90 group-hover:opacity-100"
            aria-label="Anterior historia"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 text-gray-800 shadow-2xl border border-gray-100 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-40 opacity-90 group-hover:opacity-100"
            aria-label="Siguiente historia"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => { setIsAutoPlaying(false); scrollToIndex(index); }}
              className={`rounded-full transition-all duration-300 ${activeIndex === index
                  ? 'w-8 h-2.5 bg-[#1E4FA3] shadow-sm'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Ir a historia ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================
// Grid Image Card
// ==============================

function LazyImageCard({ image, index }) {
  const [loaded, setLoaded] = useState(false);
  const isGif = image.mimeType === 'image/gif';

  // Map aspect ratio
  const aspectClass = {
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
    '3/4': 'aspect-[3/4]',
    '4/3': 'aspect-[4/3]',
  }[image.aspectRatio] || 'aspect-[4/3]';

  // Map object position
  const positionClass = {
    top: 'object-top',
    bottom: 'object-bottom',
    center: 'object-center',
  }[image.objectPosition] || 'object-center';

  // Map effects
  const effect = image.effect || 'zoom-gradient';
  const hasZoom = effect === 'zoom' || effect === 'zoom-gradient';
  const hasGradient = effect === 'gradient' || effect === 'zoom-gradient';

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className={`${aspectClass} relative overflow-hidden w-full`}>
        {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />}
        <img
          src={image.url}
          alt={image.title || image.originalName || 'Imagen corporativa'}
          className={`w-full h-full object-cover ${positionClass} transition-all duration-500 ${hasZoom ? 'group-hover:scale-105' : ''
            } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        {isGif && loaded && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white backdrop-blur-sm z-10 font-sans">GIF</span>
        )}

      </div>
    </div>
  );
}

// ==============================
// Carousel Image (eager load — all carousel images must be preloaded)
// ==============================

function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="eager"
      />
    </>
  );
}
