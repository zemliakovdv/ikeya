// components/home/StartSliderServer.js
// Серверный компонент — грузит данные и передаёт в клиентский StartSlider

import StartSlider from '@/components/home/StartSlider';
import { getMainSliderBanners } from '@/lib/api/ikea';

export default async function StartSliderServer() {
  try {
    const { data } = await getMainSliderBanners();

    if (!data?.length) return null;

    const firstVariant = data[0]?.attributes?.variant;
    const sorted = [...data].sort((a, b) => a.attributes.position - b.attributes.position);

    if (firstVariant === 'main_1500x516') {
      return <StartSlider slides={sorted} type="single" />;
    }

    if (firstVariant === 'main_572x594') {
      const grouped = [];
      for (let i = 0; i < sorted.length; i += 3) {
        grouped.push(sorted.slice(i, i + 3));
      }
      return <StartSlider slides={grouped} type="triple" />;
    }

    return null;
  } catch (e) {
    console.error('Ошибка загрузки слайдера:', e);
    return null;
  }
}