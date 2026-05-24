'use client';

import { useEffect } from 'react';

const HEADER_SELECTOR = 'header.header.sticky';

export default function CatalogStickyOffset() {
  useEffect(() => {
    let frameId = null;
    let resizeObserver = null;

    const setStickyOffset = () => {
      const header = document.querySelector(HEADER_SELECTOR);

      if (!header) {
        document.documentElement.style.setProperty('--catalog-sticky-top', '0px');
        return;
      }

      const rect = header.getBoundingClientRect();
      const offset = Math.max(0, Math.ceil(rect.bottom));

      document.documentElement.style.setProperty(
        '--catalog-sticky-top',
        `${offset}px`
      );
    };

    const requestUpdate = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(setStickyOffset);
    };

    requestUpdate();

    const header = document.querySelector(HEADER_SELECTOR);

    if (header && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(header);
    }

    window.addEventListener('resize', requestUpdate);
    window.addEventListener('scroll', requestUpdate, { passive: true });

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('scroll', requestUpdate);
      document.documentElement.style.removeProperty('--catalog-sticky-top');
    };
  }, []);

  return null;
}