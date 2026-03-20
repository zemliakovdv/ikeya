'use client';

import { useRef } from 'react';
import Script from 'next/script';

export default function FloatingChatButton() {
  const isOpenRef    = useRef(false);
  const observerRef  = useRef(null);

  function handleJivoLoad() {
    const interval = setInterval(() => {
      if (!window.jivo_api) return;
      clearInterval(interval);

      function hideJivoButton() {
        if (isOpenRef.current) return;
        document.querySelectorAll('jdiv').forEach(el => {
          el.style.display = 'none';
        });
      }

      hideJivoButton();

      window.jivo_api.onOpen = () => {
        isOpenRef.current = true;
      };

      window.jivo_api.onClose = () => {
        isOpenRef.current = false;
        setTimeout(hideJivoButton, 100);
      };

      observerRef.current = new MutationObserver(() => {
        if (!isOpenRef.current) hideJivoButton();
      });
      observerRef.current.observe(document.body, { childList: true, subtree: true });
    }, 300);
  }

  const handleOpen = () => {
    // 1. Останавливаем observer чтобы не мешал
    observerRef.current?.disconnect();

    // 2. Выставляем флаг и показываем jdiv
    isOpenRef.current = true;
    document.querySelectorAll('jdiv').forEach(el => {
      el.style.display = 'block';
    });

    // 3. Открываем чат
    window.jivo_api?.open();

    // 4. Возобновляем observer после того как Jivo отрисовался
    setTimeout(() => {
      if (observerRef.current) {
        observerRef.current.observe(document.body, { childList: true, subtree: true });
      }
    }, 500);
  };

  return (
    <>
      <Script
        src="//code.jivo.ru/widget/MEodDsqt9w"
        strategy="afterInteractive"
        onLoad={handleJivoLoad}
      />
      <button
        className="fab-chat show"
        aria-label="Открыть чат"
        onClick={handleOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.49 2 2 6.3 2 11.6C2 14.06 2.97 16.4 4.73 18.19C4.95 18.42 5.06 18.68 5.02 18.89C4.89 19.58 4.59 20.23 4.15 20.77C3.99 20.96 3.95 21.22 4.04 21.45C4.12 21.68 4.33 21.85 4.57 21.9C4.97 21.97 5.37 22.01 5.78 22.01C6.88 22.01 7.98 21.74 8.97 21.21C9.23 21.07 9.47 20.95 9.51 20.93C9.56 20.93 9.84 20.98 10.08 21.02C10.71 21.14 11.36 21.2 11.99 21.2H12.01C17.52 21.2 22.01 16.89 22.01 11.6C22.01 6.31 17.51 2 12 2ZM8.29 12.93C7.78 12.93 7.36 12.51 7.36 12C7.36 11.49 7.77 11.07 8.29 11.07C8.8 11.07 9.22 11.49 9.22 12C9.22 12.51 8.8 12.93 8.29 12.93ZM12.01 12.93C11.5 12.93 11.08 12.51 11.08 12C11.08 11.49 11.49 11.07 12.01 11.07C12.52 11.07 12.94 11.49 12.94 12C12.94 12.51 12.52 12.93 12.01 12.93ZM15.73 12.93C15.22 12.93 14.8 12.51 14.8 12C14.8 11.49 15.21 11.07 15.73 11.07C16.24 11.07 16.66 11.49 16.66 12C16.66 12.51 16.24 12.93 15.73 12.93Z" fill="white"/>
        </svg>
      </button>
    </>
  );
}