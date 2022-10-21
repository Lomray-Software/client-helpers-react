import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * Closed element when click outside
 */
const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event?: any) => void,
  ignoreCondition?: boolean,
) => {
  useEffect(() => {
    const listener = (event: any) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      for (const r of refs) {
        const el = r?.current;

        if (!el || el.contains((event?.target as Node) || null)) {
          return;
        }
      }

      !ignoreCondition && handler(event); // Call the handler only if the click is outside the element passed.
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, ignoreCondition]); // Reload only if ref or handler changes
};

export default useOutsideClick;
