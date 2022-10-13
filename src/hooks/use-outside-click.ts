import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * Closed element when click outside
 */
const useOnClickOutside = (ref: RefObject<any>, handler: (e?: MouseEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
