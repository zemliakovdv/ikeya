import HorizontalBannerSlider from '@/components/home/HorizontalBannerSlider';
import {
  groupResponsiveBanners,
  mapResponsiveBannerGroup,
  normalizeBannerRecord,
} from '@/components/home/bannerUtils';
import { getHorizontalBanners } from '@/lib/api/ikea';

export default async function HorizontalBannerServer() {
  try {
    const { data } = await getHorizontalBanners();

    if (!data?.length) return null;

    const banners = data
      .map(normalizeBannerRecord)
      .filter((banner) => banner.image)
      .filter((banner) => !banner.section || banner.section === 'horizontal');

    const slides = groupResponsiveBanners(banners)
      .map(mapResponsiveBannerGroup)
      .filter(Boolean);

    if (!slides.length) return null;

    return <HorizontalBannerSlider slides={slides} />;
  } catch (e) {
    console.error('Error loading horizontal banners:', e);
    return null;
  }
}
