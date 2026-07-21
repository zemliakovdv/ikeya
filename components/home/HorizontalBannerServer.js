import HorizontalBannerSlider from '@/components/home/HorizontalBannerSlider';
import {
  groupResponsiveBanners,
  normalizeBannerRecord,
  pickResponsiveImages,
} from '@/components/home/bannerUtils';
import { getHorizontalBanners } from '@/lib/api/ikea';

const HORIZONTAL_SIZES = {
  desktop: { width: 1500, height: 256 },
  tablet: { width: 960, height: 256 },
  mobile: { width: 742, height: 256 },
};

function mapGroupToSlide(group) {
  const first = group[0];
  const images = pickResponsiveImages(group, HORIZONTAL_SIZES);

  if (!first || !images) return null;

  return {
    id: first.id,
    slotKey: first.slotKey,
    position: first.position,
    link: first.link || '/catalog',
    desktopImage: images.desktopImage,
    tabletImage: images.tabletImage,
    mobileImage: images.mobileImage,
  };
}

export default async function HorizontalBannerServer() {
  try {
    const { data } = await getHorizontalBanners();

    if (!data?.length) return null;

    const banners = data
      .map(normalizeBannerRecord)
      .filter((banner) => banner.image)
      .filter((banner) => !banner.section || banner.section === 'horizontal');

    const slides = groupResponsiveBanners(banners)
      .map(mapGroupToSlide)
      .filter(Boolean);

    if (!slides.length) return null;

    return <HorizontalBannerSlider slides={slides} />;
  } catch (e) {
    console.error('Error loading horizontal banners:', e);
    return null;
  }
}
