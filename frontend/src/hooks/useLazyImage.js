import { useState, useEffect, useRef } from 'react';

/**
 * Hook that lazy-loads an image when it approaches the viewport.
 * Returns the actual src only when the element is near-visible.
 *
 * @param {string} src - The real image source URL
 * @param {string} placeholderSrc - Optional low-res placeholder
 * @returns {{ src: string, loaded: boolean, imgRef: React.RefObject }}
 */
export default function useLazyImage(src, placeholderSrc = '') {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: load immediately
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Load the real image
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setLoaded(true);
          };
          img.onerror = () => {
            // Keep placeholder on error
            setLoaded(true);
          };
          img.src = src;
          observer.unobserve(element);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before entering viewport
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [src]);

  return { src: imageSrc, loaded, imgRef };
}
