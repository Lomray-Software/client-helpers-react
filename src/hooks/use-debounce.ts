import type { Dispatch, SetStateAction } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * This hook need for reduce call state change
 */
const useDebounce = <TValue>(
  initValue: TValue | (() => TValue),
  delay: number,
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  const [value, setValue] = useState<TValue>(initValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Clear timeout on unmount
   */
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const setDebouncedValue = useCallback(
    (newValue: TValue) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setValue(newValue), delay);
    },
    [delay],
  );

  return [value, setDebouncedValue];
};

export default useDebounce;
