import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * This hook used when you need do something when click outside of ref elements
 */
const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event?: MouseEvent) => void,
  hasListeners?: boolean,
) => {
  useEffect(() => {
    // Prevent adding unnecessary event listeners.
    if (!hasListeners) {
      return;
    }

    const listener = (event: MouseEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      for (const r of refs) {
        const el = r?.current;

        if (!el || el.contains((event?.target as Node) || null)) {
          return;
        }
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, hasListeners]); // Reload only if ref or handler changes
};

export default useClickOutside;
