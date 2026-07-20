// components/home/AdsBanner.js

import AdsBannerSlider from '@/components/home/AdsBannerSlider';
import { IMAGES_BASE_URL } from '@/lib/api/ikea';

import { buildApiUrl } from '@/lib/config/api';

const DESKTOP_SIZE = { width: 1500, height: 256 };
const TABLET_SIZE = { width: 960, height: 256 };
const MOBILE_SIZE = { width: 742, height: 256 };

async function getAdsBanners() {
  try {
    const res = await fetch(buildApiUrl('/homepage/slider/banners'), {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error('Error fetching ads banners:', e);
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

function isMatchingSize(banner, size) {
  return banner.width === size.width && banner.height === size.height;
}

function pickImage(group, preferredSizes) {
  for (const size of preferredSizes) {
    const match = group.find((banner) => isMatchingSize(banner, size));
    if (match) return match.image;
  }

  return null;
}

function normalizeBanner(banner) {
  const attr = banner.attributes || {};
  const position = Number(attr.position) || 0;
  const width = Number(attr.width) || 0;
  const height = Number(attr.height) || 0;
  const image = resolveImageUrl(attr.image_url);
  const link = attr.link_url || '/catalog';

  return {
    id: banner.id,
    section: attr.section,
    position,
    width,
    height,
    image,
    link,
  };
}

function shouldUseBanner(banner) {
  if (!banner.image) return false;

  if (banner.section && banner.section !== 'secondary') {
    return false;
  }

  if (banner.width && banner.height && banner.height !== 256) {
    return false;
  }

  return true;
}

function groupBannersBySlot(banners) {
  const groups = new Map();

  for (const banner of banners) {
    const key = `${banner.position}::${banner.link}`;
    const group = groups.get(key) || [];
    group.push(banner);
    groups.set(key, group);
  }

  return Array.from(groups.values()).sort((a, b) => {
    const aPosition = a[0]?.position || 0;
    const bPosition = b[0]?.position || 0;
    return aPosition - bPosition;
  });
}

function mapGroupToSlide(group) {
  const first = group[0];
  const desktopImage = pickImage(group, [DESKTOP_SIZE, TABLET_SIZE, MOBILE_SIZE]);
  const tabletImage = pickImage(group, [TABLET_SIZE, DESKTOP_SIZE, MOBILE_SIZE]);
  const mobileImage = pickImage(group, [MOBILE_SIZE, TABLET_SIZE, DESKTOP_SIZE]);

  if (!first || !desktopImage || !tabletImage || !mobileImage) {
    return null;
  }

  return {
    id: first.id,
    position: first.position,
    link: first.link || '/catalog',
    desktopImage,
    tabletImage,
    mobileImage,
  };
}

export default async function AdsBanner() {
  const banners = await getAdsBanners();

  if (!banners.length) return null;

  const normalized = banners
    .map(normalizeBanner)
    .filter(shouldUseBanner);

  const slides = groupBannersBySlot(normalized)
    .map(mapGroupToSlide)
    .filter(Boolean);

  if (!slides.length) return null;

  return <AdsBannerSlider slides={slides} />;
}
