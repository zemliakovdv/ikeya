'use client';

import Script from 'next/script';

export function openJivoChat() {
  window.jivo_api?.open();
}

export default function FloatingChatButton() {
  return (
    <Script
      src="//code.jivo.ru/widget/MEodDsqt9w"
      strategy="afterInteractive"
    />
  );
}