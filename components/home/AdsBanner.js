// components/home/AdsBanner.js
import Link from 'next/link';
import AdsBannerSlider from '@/components/home/AdsBannerSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'http://45.135.234.22/api/v1';

async function getAdsBanners() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/slider/banners`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error('Ошибка загрузки рекламных баннеров:', e);
    return [];
  }
}

export default async function AdsBanner() {
  const banners = await getAdsBanners();

  if (!banners.length) return null;

  const all = banners.map(b => ({
    id: b.id,
    variant: b.attributes.variant,
    image: `${IMAGES_BASE_URL}${b.attributes.image_url}`,
    link: b.attributes.link_url || '#',
  }));

  const small = all.filter(b => b.variant === 'secondary_742x256');
  const large = all.filter(b => b.variant === 'secondary_1500x256');

  // Приоритет у 742x256, если их нет — берём 1500x256
  const mapped = small.length > 0 ? small : large;


  // Группируем по 2 на слайд
  const slides = [];
  for (let i = 0; i < mapped.length; i += 2) {
    slides.push(mapped.slice(i, i + 2));
  }

  return <AdsBannerSlider slides={slides} />;
}
