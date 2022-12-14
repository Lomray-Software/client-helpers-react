interface IGoogleTagManagerInit {
  gtmId: string;
  initDelay?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    dataLayer: {
      push: (data: Record<string, any>) => void;
    };
  }
}

/**
 * Insert GTM scripts on page
 */
class GoogleTagManager {
  /**
   * Is initialized GTM module
   * @private
   */
  private isInitialized = false;

  /**
   * Initialize gtm module on page
   */
  public init({ gtmId, initDelay = 0 }: IGoogleTagManagerInit): void {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      // this part ensures PageViews is always tracked
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'gtm.js',
        'gtm.start': Date.now(),
        'gtm.uniqueEventId': 0,
      });
    };
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}&gtm_cookies_win=x`;

    const iframe = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}&gtm_cookies_win=x"
        height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`;
    const noscript = document.createElement('noscript');

    noscript.innerHTML = iframe;

    const init = () => {
      if (this.isInitialized) {
        return;
      }

      document.head.appendChild(script);
      document.body.insertBefore(noscript, document.body.childNodes[0]);

      this.isInitialized = true;
    };

    if (!initDelay) {
      init();
    } else {
      const events = ['DOMContentLoaded', 'scroll', 'mousemove', 'touchstart'];
      const delayInitFunc = (event: Event) => {
        const isDomLoadedEvent = event.type === 'DOMContentLoaded';

        setTimeout(init, isDomLoadedEvent ? initDelay : 0);

        if (!isDomLoadedEvent) {
          events.forEach((eventName) => {
            document.removeEventListener(eventName, delayInitFunc);
          });
        }
      };

      events.forEach((eventName) => {
        document.addEventListener(eventName, delayInitFunc);
      });
    }
  }
}

export default new GoogleTagManager();
