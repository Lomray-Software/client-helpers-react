import { useState, useEffect } from 'react';

interface IWindowSizeReturn {
  width: number;
  height: number;
  isMatchWith: boolean;
}

interface IWindowSizeParams {
  matchWith?: number;
}

const useWindowSize = ({ matchWith = -1 }: IWindowSizeParams = {}): IWindowSizeReturn => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<IWindowSizeReturn>({
    width: 0,
    height: 0,
    isMatchWith: false,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        const width = window.innerWidth ?? 0;
        const height = window.innerHeight ?? 0;

        // Set window width/height to state
        setWindowSize({
          width,
          height,
          isMatchWith: width <= matchWith,
        });
      }

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }

    return void 0;
  }, [matchWith]); // Empty array ensures that effect is only run on mount

  return windowSize;
};

export default useWindowSize;
