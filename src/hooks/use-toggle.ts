import { useCallback, useState } from 'react';

/**
 * Use toggle hook to toggle boolean value
 */
const useToggle = (initialState: boolean) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const toggle = useCallback(() => setIsToggled((prevIsToggled) => !prevIsToggled), []);

  const close = useCallback(() => setIsToggled(false), []);

  return [isToggled, toggle, close] as const;
};

export default useToggle;
