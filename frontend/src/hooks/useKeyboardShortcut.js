import { useEffect, useCallback } from 'react';

/**
 * Hook that listens for a keyboard shortcut and triggers a callback.
 *
 * @param {string} key - The key to listen for (e.g., 'j')
 * @param {boolean} ctrlKey - Whether Ctrl must be held
 * @param {Function} callback - Function to call when shortcut is pressed
 * @param {boolean} enabled - Whether the shortcut is active
 */
export default function useKeyboardShortcut(key, ctrlKey, callback, enabled = true) {
  const handler = useCallback(
    (e) => {
      if (!enabled) return;

      const ctrlMatch = ctrlKey ? (e.ctrlKey || e.metaKey) : true;
      const keyMatch = e.key.toLowerCase() === key.toLowerCase();

      if (ctrlMatch && keyMatch) {
        e.preventDefault();
        e.stopPropagation();
        callback();
      }
    },
    [key, ctrlKey, callback, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handler]);
}
