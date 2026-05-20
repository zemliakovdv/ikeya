// components/home/AdsBanner.js

import AdsBannerSlider from '@/components/home/AdsBannerSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

const API_BASE_URL = 'https://test.ikeya.by/api/v1';

async function getAdsBanners() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/slider/banners`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error('Ошибка загрузки рекламных баннеров:', e);
    return [];
  }
}

function resolveImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http')) {
    return url.replace(/^https?:\/\/[^/]+/, IMAGES_BASE_URL);
  }

  return `${IMAGES_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export default async function AdsBanner() {
  const banners = await getAdsBanners();

  if (!banners.length) return null;

  const all = banners
    .map((banner) => {
      const attr = banner.attributes || {};

      return {
        id: banner.id,
        variant: attr.variant,
        image: resolveImageUrl(attr.image_url),
        link: attr.link_url || '#',
      };
    })
    .filter((banner) => banner.image);

  const small = all.filter((banner) => banner.variant === 'secondary_742x256');
  const large = all.filter((banner) => banner.variant === 'secondary_1500x256');

  const mapped = small.length > 0 ? small : large;

  if (!mapped.length) return null;

  const slides = [];
  for (let i = 0; i < mapped.length; i += 2) {
    slides.push(mapped.slice(i, i + 2));
  }

  return <AdsBannerSlider slides={slides} />;
}