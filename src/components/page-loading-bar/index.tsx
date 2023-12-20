import React, { useEffect, useRef } from 'react';
import { useNavigation } from 'react-router-dom';
import LoadingBarComponent from 'react-top-loading-bar';
import type { LoadingBarRef } from 'react-top-loading-bar';

/**
 * Show top bar loader while page is loading
 * @constructor
 */
const PageLoadingBar = () => {
  const { state } = useNavigation();
  const prevState = useRef(state);
  const loadingBar = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (state === 'loading') {
      loadingBar.current?.continuousStart();
    } else if (state === 'idle' && prevState.current === 'loading') {
      loadingBar.current?.complete();
    }

    prevState.current = state;
  }, [state]);

  return <LoadingBarComponent color="#de1b1b" ref={loadingBar} />;
};

export default PageLoadingBar;
