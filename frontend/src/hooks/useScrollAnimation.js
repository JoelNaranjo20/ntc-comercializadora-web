import { useEffect, useRef, useState } from 'react';

/**
 * Hook that triggers a fade-in animation when an element enters the viewport.
 * Uses IntersectionObserver for performance.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export default function useScrollAnimation({
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If IntersectionObserver is not available, show immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
