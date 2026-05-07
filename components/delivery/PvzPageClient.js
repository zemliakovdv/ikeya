'use client';

// components/delivery/PvzPageClient.js

import { useState } from 'react';
import Script from 'next/script';
import PickupTab from '@/components/delivery/modal/PickupTab';

const YMAPS_API_KEY = 'ee57964a-5010-4536-9733-41c78d29d531';
const YMAPS_SRC = `https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;

export default function PvzPageClient() {
  const [ymapsReady, setYmapsReady] = useState(
    typeof window !== 'undefined' && !!window.ymaps
  );
  const [activeTab, setActiveTab] = useState('pickup');
  const needScript = !ymapsReady;

  return (
    <>
      {needScript && (
        <Script
          src={YMAPS_SRC}
          strategy="afterInteractive"
          onLoad={() => setYmapsReady(true)}
        />
      )}
      <PickupTab
        ymapsReady={ymapsReady}
        cartToken={null}
        cartItems={[]}
        onSelect={null}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}