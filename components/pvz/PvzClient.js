'use client';

// components/pvz/PvzClient.js

import { useState } from 'react';
import Script from 'next/script';
import PvzMapContent from '@/components/pvz/PvzMapContent';

const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531';

export default function PvzClient() {
  const [ymapsReady, setYmapsReady] = useState(false);

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => setYmapsReady(true)}
      />
      <PvzMapContent mapId="pvz-map" ymapsReady={ymapsReady} />
    </>
  );
}